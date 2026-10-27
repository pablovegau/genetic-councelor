// Genera las reglas de los style props (atributos data-*) y sus tipos a partir de los tokens.
// Fuente única: src/design-system/tokens. Se ejecuta con `pnpm tokens`.
import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../src/design-system/", import.meta.url);
const read = async (path) =>
  JSON.parse(await readFile(new URL(path, root), "utf8"));
const keys = (group) =>
  Object.keys(group).filter((key) => !key.startsWith("$"));
const kebab = (name) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

const space = keys((await read("tokens/primitive/space.tokens.json")).space);
const font = (await read("tokens/primitive/font.tokens.json")).font;
const color = (await read("tokens/semantic/color.light.tokens.json")).color;
const base = await read("tokens/semantic/base.tokens.json");

const scales = {
  Space: space,
  BgRole: keys(color.bg),
  TextColor: keys(color.text),
  BorderRole: keys(color.border),
  Radius: keys(base.radius),
  FontSize: keys(font.size),
  FontWeight: keys(font.weight),
  LineHeight: keys(font["line-height"]),
};

// prop -> [valores válidos, declaraciones CSS (función del valor)]
const props = {
  p: [scales.Space, (v) => `padding: var(--space-${v})`],
  px: [scales.Space, (v) => `padding-inline: var(--space-${v})`],
  py: [scales.Space, (v) => `padding-block: var(--space-${v})`],
  pt: [scales.Space, (v) => `padding-block-start: var(--space-${v})`],
  pr: [scales.Space, (v) => `padding-inline-end: var(--space-${v})`],
  pb: [scales.Space, (v) => `padding-block-end: var(--space-${v})`],
  pl: [scales.Space, (v) => `padding-inline-start: var(--space-${v})`],
  gap: [scales.Space, (v) => `gap: var(--space-${v})`],
  gapX: [scales.Space, (v) => `column-gap: var(--space-${v})`],
  gapY: [scales.Space, (v) => `row-gap: var(--space-${v})`],
  minColumn: [
    scales.Space,
    (v) =>
      `grid-template-columns: repeat(auto-fit, minmax(min(var(--space-${v}), 100%), 1fr))`,
  ],
  iconSize: [
    scales.Space,
    (v) => `inline-size: var(--space-${v}); block-size: var(--space-${v})`,
  ],
  bg: [scales.BgRole, (v) => `background-color: var(--color-bg-${v})`],
  color: [scales.TextColor, (v) => `color: var(--color-text-${v})`],
  border: [
    scales.BorderRole,
    (v) => `border: var(--border-width-1) solid var(--color-border-${v})`,
  ],
  radius: [scales.Radius, (v) => `border-radius: var(--radius-${v})`],
  size: [scales.FontSize, (v) => `font-size: var(--font-size-${v})`],
  weight: [scales.FontWeight, (v) => `font-weight: var(--font-weight-${v})`],
  leading: [
    scales.LineHeight,
    (v) => `line-height: var(--font-line-height-${v})`,
  ],
};

const header =
  "Generado por scripts/build-style-props.mjs desde src/design-system/tokens. No editar.";

const rules = Object.entries(props).flatMap(([prop, [values, declaration]]) =>
  values.map(
    (value) => `  [data-${kebab(prop)}="${value}"] { ${declaration(value)}; }`
  )
);
const css = `/* ${header} */\n@layer base, components, props;\n\n@layer props {\n${rules.join("\n")}\n}\n`;

// Cada escala se exporta como lista `as const` y como tipo unión derivado de ella,
// de modo que el catálogo y los tests recorren los mismos valores que aceptan los props.
const listNames = {
  Space: "spaceSteps",
  BgRole: "bgRoles",
  TextColor: "textColors",
  BorderRole: "borderRoles",
  Radius: "radii",
  FontSize: "fontSizes",
  FontWeight: "fontWeights",
  LineHeight: "lineHeights",
};
const list = (name, values) =>
  `export const ${name} = ${JSON.stringify(values)} as const;`;
const scaleExports = Object.entries(scales).flatMap(([type, values]) => [
  list(listNames[type], values),
  `export type ${type} = (typeof ${listNames[type]})[number];`,
]);

// Listas que no son props pero documenta el catálogo: escala neutral y todos los roles de color.
const neutralSteps = keys(
  (await read("tokens/primitive/color.tokens.json")).color.neutral
);
const colorRoles = keys(color).flatMap((group) =>
  keys(color[group]).map((name) => `${group}-${name}`)
);
const radiusSteps = keys(
  (await read("tokens/primitive/shape.tokens.json")).radius
);
const ts = `// ${header}\n${[
  ...scaleExports,
  list("neutralSteps", neutralSteps),
  list("radiusSteps", radiusSteps),
  list("colorRoles", colorRoles),
].join("\n")}\n`;

await writeFile(new URL("style-props.generated.css", root), css);
await writeFile(new URL("style-props.generated.ts", root), ts);
console.log(
  `style props: ${rules.length} reglas, ${Object.keys(scales).length} tipos`
);
