// Genera las reglas de los style props (atributos data-*) y sus tipos a partir de los tokens.
// Función pura: el ejecutor (build-style-props.ts) lee los ficheros y escribe el resultado.
type Group = Record<string, unknown>;

/** Los ficheros de tokens que alimentan los style props, ya parseados. */
export interface TokenSources {
  space: Group;
  font: Group;
  shape: Group;
  colorPrimitive: Group;
  colorLight: Group;
  base: Group;
}

const keys = (group: unknown) =>
  Object.keys(group as Group).filter((key) => !key.startsWith("$"));
const at = (document: Group, ...path: string[]) =>
  path.reduce<unknown>((node, key) => (node as Group)[key], document) as Group;
const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

const header =
  "Generado por scripts/build-style-props.ts desde src/design-system/tokens. No editar.";

const listNames: Record<string, string> = {
  Space: "spaceSteps",
  BgRole: "bgRoles",
  TextColor: "textColors",
  BorderRole: "borderRoles",
  Radius: "radii",
  FontSize: "fontSizes",
  FontWeight: "fontWeights",
  LineHeight: "lineHeights",
};

export function buildStyleProps(sources: TokenSources) {
  const font = at(sources.font, "font");
  const color = at(sources.colorLight, "color");

  const scales: Record<string, string[]> = {
    Space: keys(at(sources.space, "space")),
    BgRole: keys(color.bg),
    TextColor: keys(color.text),
    BorderRole: keys(color.border),
    Radius: keys(at(sources.base, "radius")),
    FontSize: keys(font.size),
    FontWeight: keys(font.weight),
    LineHeight: keys(font["line-height"]),
  };
  const space = scales.Space!;

  // prop -> [valores válidos, declaraciones CSS en función del valor]
  const props: Record<string, [string[], (value: string) => string]> = {
    p: [space, (v) => `padding: var(--space-${v})`],
    px: [space, (v) => `padding-inline: var(--space-${v})`],
    py: [space, (v) => `padding-block: var(--space-${v})`],
    pt: [space, (v) => `padding-block-start: var(--space-${v})`],
    pr: [space, (v) => `padding-inline-end: var(--space-${v})`],
    pb: [space, (v) => `padding-block-end: var(--space-${v})`],
    pl: [space, (v) => `padding-inline-start: var(--space-${v})`],
    gap: [space, (v) => `gap: var(--space-${v})`],
    gapX: [space, (v) => `column-gap: var(--space-${v})`],
    gapY: [space, (v) => `row-gap: var(--space-${v})`],
    minColumn: [
      space,
      (v) =>
        `grid-template-columns: repeat(auto-fit, minmax(min(var(--space-${v}), 100%), 1fr))`,
    ],
    iconSize: [
      space,
      (v) => `inline-size: var(--space-${v}); block-size: var(--space-${v})`,
    ],
    bg: [scales.BgRole!, (v) => `background-color: var(--color-bg-${v})`],
    color: [scales.TextColor!, (v) => `color: var(--color-text-${v})`],
    border: [
      scales.BorderRole!,
      (v) => `border: var(--border-width-1) solid var(--color-border-${v})`,
    ],
    radius: [scales.Radius!, (v) => `border-radius: var(--radius-${v})`],
    size: [scales.FontSize!, (v) => `font-size: var(--font-size-${v})`],
    weight: [scales.FontWeight!, (v) => `font-weight: var(--font-weight-${v})`],
    leading: [
      scales.LineHeight!,
      (v) => `line-height: var(--font-line-height-${v})`,
    ],
  };

  const rules = Object.entries(props).flatMap(([prop, [values, declaration]]) =>
    values.map(
      (value) => `  [data-${kebab(prop)}="${value}"] { ${declaration(value)}; }`
    )
  );
  const css = `/* ${header} */\n@layer base, components, props;\n\n@layer props {\n${rules.join("\n")}\n}\n`;

  // Cada escala se exporta como lista `as const` y como tipo unión derivado de ella,
  // de modo que el catálogo y los tests recorren los mismos valores que aceptan los props.
  const list = (name: string, values: string[]) =>
    `export const ${name} = ${JSON.stringify(values)} as const;`;
  const scaleExports = Object.entries(scales).flatMap(([type, values]) => [
    list(listNames[type]!, values),
    `export type ${type} = (typeof ${listNames[type]!})[number];`,
  ]);
  const colorRoles = keys(color).flatMap((group) =>
    keys(color[group]).map((name) => `${group}-${name}`)
  );
  const ts = `// ${header}\n${[
    ...scaleExports,
    list("neutralSteps", keys(at(sources.colorPrimitive, "color", "neutral"))),
    list("radiusSteps", keys(at(sources.shape, "radius"))),
    list("colorRoles", colorRoles),
  ].join("\n")}\n`;

  return { css, ts };
}
