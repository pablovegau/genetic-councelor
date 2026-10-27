import { describe, expect, it } from "vitest";
import { buildStyleProps, type TokenSources } from "./style-props.ts";

// Tokens mínimos: el generador solo mira los nombres de los pasos y de los roles.
const token = { $value: "x" };
const sources: TokenSources = {
  space: { space: { $type: "dimension", "1": token, "2": token } },
  font: {
    font: {
      size: { $type: "dimension", "1": token },
      weight: { $type: "fontWeight", regular: token, bold: token },
      "line-height": { $type: "number", tight: token },
    },
  },
  shape: {
    radius: { $type: "dimension", "0": token, full: token },
    border: { width: { $type: "dimension", "1": token } },
  },
  colorPrimitive: { color: { neutral: { "50": token, "100": token } } },
  colorLight: {
    color: {
      $type: "color",
      bg: { page: token, surface: token },
      text: { default: token, muted: token },
      border: { default: token },
      action: { bg: token, fg: token },
      focus: { ring: token },
    },
  },
  base: { radius: { $type: "dimension", control: token } },
};

const { css, ts } = buildStyleProps(sources);

describe("reglas CSS de los style props", () => {
  it("genera una regla de padding por cada paso de espaciado", () => {
    expect(css).toContain('[data-p="1"] { padding: var(--space-1); }');
    expect(css).toContain('[data-p="2"] { padding: var(--space-2); }');
  });

  it.each([
    ["px", "padding-inline"],
    ["py", "padding-block"],
    ["pt", "padding-block-start"],
    ["pr", "padding-inline-end"],
    ["pb", "padding-block-end"],
    ["pl", "padding-inline-start"],
    ["gap", "gap"],
    ["gap-x", "column-gap"],
    ["gap-y", "row-gap"],
  ])(
    "el atributo data-%s aplica %s con la escala de espaciado",
    (attr, property) => {
      expect(css).toContain(
        `[data-${attr}="2"] { ${property}: var(--space-2); }`
      );
    }
  );

  it("minColumn reparte las columnas según un ancho mínimo", () => {
    expect(css).toContain(
      '[data-min-column="2"] { grid-template-columns: repeat(auto-fit, minmax(min(var(--space-2), 100%), 1fr)); }'
    );
  });

  it("iconSize fija el ancho y el alto con la escala de espaciado", () => {
    expect(css).toContain(
      '[data-icon-size="1"] { inline-size: var(--space-1); block-size: var(--space-1); }'
    );
  });

  it.each([
    ['[data-bg="page"]', "background-color: var(--color-bg-page)"],
    ['[data-color="muted"]', "color: var(--color-text-muted)"],
    [
      '[data-border="default"]',
      "border: var(--border-width-1) solid var(--color-border-default)",
    ],
    ['[data-radius="control"]', "border-radius: var(--radius-control)"],
    ['[data-size="1"]', "font-size: var(--font-size-1)"],
    ['[data-weight="bold"]', "font-weight: var(--font-weight-bold)"],
    ['[data-leading="tight"]', "line-height: var(--font-line-height-tight)"],
  ])("la regla %s declara %s", (selector, declaration) => {
    expect(css).toContain(`${selector} { ${declaration}; }`);
  });

  it("genera exactamente 34 reglas para estos tokens", () => {
    expect(css.match(/\[data-/g)).toHaveLength(34);
  });

  it("declara el orden de capas y mete todas las reglas en la capa props", () => {
    expect(css).toContain("@layer base, components, props;");
    const afterLayer = css.slice(css.indexOf("@layer props {"));
    expect(afterLayer.match(/\[data-/g)).toHaveLength(34);
    expect(css.slice(0, css.indexOf("@layer props {"))).not.toContain("[data-");
  });

  it("ignora las propiedades $ de los grupos", () => {
    expect(css).not.toContain("$type");
    expect(css).not.toContain("$value");
  });

  it("produce siempre la misma salida con las mismas entradas", () => {
    expect(buildStyleProps(sources)).toEqual({ css, ts });
  });
});

describe("tipos y listas generados", () => {
  it.each([
    'export const spaceSteps = ["1","2"] as const;',
    'export const bgRoles = ["page","surface"] as const;',
    'export const textColors = ["default","muted"] as const;',
    'export const borderRoles = ["default"] as const;',
    'export const radii = ["control"] as const;',
    'export const fontSizes = ["1"] as const;',
    'export const fontWeights = ["regular","bold"] as const;',
    'export const lineHeights = ["tight"] as const;',
    'export const neutralSteps = ["50","100"] as const;',
    'export const radiusSteps = ["0","full"] as const;',
  ])("exporta la lista %s", (line) => {
    expect(ts).toContain(line);
  });

  it("exporta todos los roles de color como grupo-nombre", () => {
    expect(ts).toContain(
      'export const colorRoles = ["bg-page","bg-surface","text-default","text-muted","border-default","action-bg","action-fg","focus-ring"] as const;'
    );
  });

  it("deriva cada tipo unión de su lista", () => {
    expect(ts).toContain("export type Space = (typeof spaceSteps)[number];");
    expect(ts).toContain("export type BgRole = (typeof bgRoles)[number];");
    expect(ts).toContain(
      "export type LineHeight = (typeof lineHeights)[number];"
    );
  });
});
