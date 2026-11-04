import { describe, expect, it } from "vitest";
import {
  aliasTarget,
  describeValue,
  flattenTokens,
  formatOklch,
  formatTokenValue,
  pixelEquivalent,
  resolveValue,
  tokenReference,
  tokenVariable,
  typographyDeclarations,
  typographyStyles,
} from "./tokens";

describe("nombre y referencia de un token", () => {
  it("la variable CSS es la ruta con guiones y dos guiones delante", () => {
    expect(tokenVariable("color.action.bg")).toBe("--color-action-bg");
  });

  it("respeta los guiones que ya tiene el nombre", () => {
    expect(tokenVariable("color.action.bg-hover")).toBe(
      "--color-action-bg-hover"
    );
  });

  it("la referencia para pegar en CSS envuelve la variable en var()", () => {
    expect(tokenReference("color.violet.600")).toBe("var(--color-violet-600)");
  });
});

describe("alias DTCG", () => {
  it("quita las llaves y deja la ruta del token destino", () => {
    expect(aliasTarget("{color.violet.600}")).toBe("color.violet.600");
  });
});

describe("color oklch", () => {
  it("se escribe como en CSS", () => {
    expect(formatOklch([0.55, 0.235, 288])).toBe("oklch(0.55 0.235 288)");
  });
});

describe("aplanar un árbol de tokens", () => {
  const tree = {
    $description: "no es un token",
    color: {
      $type: "color",
      bg: { page: { $value: "{color.neutral.50}" } },
      action: {
        bg: { $value: "{color.violet.600}" },
        "bg-hover": { $value: "{color.violet.700}" },
      },
    },
  };

  it("devuelve cada token con su ruta completa y su valor", () => {
    expect(flattenTokens(tree)).toEqual([
      { path: "color.bg.page", value: "{color.neutral.50}" },
      { path: "color.action.bg", value: "{color.violet.600}" },
      { path: "color.action.bg-hover", value: "{color.violet.700}" },
    ]);
  });

  it("ignora las propiedades que empiezan por $", () => {
    expect(flattenTokens({ $type: "color", $description: "x" })).toEqual([]);
  });

  it("un token con un valor que es un objeto cuenta como un solo token", () => {
    const value = { colorSpace: "oklch", components: [1, 0, 0] };
    expect(flattenTokens({ color: { white: { $value: value } } })).toEqual([
      { path: "color.white", value },
    ]);
  });
});

describe("valor de un token para mostrar", () => {
  it("una dimensión se escribe con su unidad", () => {
    expect(formatTokenValue({ value: 0.5, unit: "rem" })).toBe("0.5rem");
  });

  it("una duración se escribe con su unidad", () => {
    expect(formatTokenValue({ value: 150, unit: "ms" })).toBe("150ms");
  });

  it("una curva de easing se escribe como cubic-bezier", () => {
    expect(formatTokenValue([0.2, 0, 0, 1])).toBe("cubic-bezier(0.2, 0, 0, 1)");
  });

  it("una familia tipográfica lista sus fuentes separadas por comas", () => {
    expect(formatTokenValue(["system-ui", "sans-serif"])).toBe(
      "system-ui, sans-serif"
    );
  });

  it("un número se escribe tal cual", () => {
    expect(formatTokenValue(1.5)).toBe("1.5");
  });

  it("un alias se muestra con una flecha a su destino", () => {
    expect(formatTokenValue("{radius.2}")).toBe("→ radius.2");
  });
});

describe("equivalente en píxeles", () => {
  it("convierte rem a píxeles con 1 rem igual a 16 px", () => {
    expect(pixelEquivalent({ value: 0.5, unit: "rem" })).toBe("8px");
  });

  it("no añade nada a un valor que ya está en píxeles", () => {
    expect(pixelEquivalent({ value: 2, unit: "px" })).toBeUndefined();
  });

  it("no añade nada a un valor que no es una dimensión", () => {
    expect(pixelEquivalent(1.5)).toBeUndefined();
  });
});

describe("resolver alias", () => {
  const lookup = new Map<string, unknown>([
    ["radius.2", { value: 0.5, unit: "rem" }],
    ["radius.control", "{radius.2}"],
  ]);

  it("devuelve un valor que no es un alias sin tocarlo", () => {
    expect(resolveValue(1.5, lookup)).toBe(1.5);
  });

  it("sigue un alias hasta su valor", () => {
    expect(resolveValue("{radius.2}", lookup)).toEqual({
      value: 0.5,
      unit: "rem",
    });
  });

  it("sigue una cadena de alias", () => {
    expect(resolveValue("{radius.control}", lookup)).toEqual({
      value: 0.5,
      unit: "rem",
    });
  });

  it("devuelve undefined si el destino no existe", () => {
    expect(resolveValue("{radius.9}", lookup)).toBeUndefined();
  });

  it("no se queda en bucle ante un ciclo de alias", () => {
    const cycle = new Map<string, unknown>([
      ["a", "{b}"],
      ["b", "{a}"],
    ]);
    expect(resolveValue("{a}", cycle)).toBe("{a}");
  });
});

describe("detalle de un token", () => {
  const lookup = new Map<string, unknown>([
    ["radius.2", { value: 0.5, unit: "rem" }],
    ["duration.fast", { value: 150, unit: "ms" }],
  ]);

  it("una dimensión en rem muestra su valor y los píxeles", () => {
    expect(describeValue({ value: 0.5, unit: "rem" }, lookup)).toEqual([
      "0.5rem",
      "8px",
    ]);
  });

  it("un alias muestra a qué apunta, su valor final y los píxeles", () => {
    expect(describeValue("{radius.2}", lookup)).toEqual([
      "→ radius.2",
      "= 0.5rem",
      "8px",
    ]);
  });

  it("un alias a una duración no añade píxeles", () => {
    expect(describeValue("{duration.fast}", lookup)).toEqual([
      "→ duration.fast",
      "= 150ms",
    ]);
  });

  it("un alias roto muestra solo el destino", () => {
    expect(describeValue("{radius.9}", lookup)).toEqual(["→ radius.9"]);
  });
});

describe("estilos de texto semánticos", () => {
  it("lista cada estilo una sola vez y en orden, ignorando otros tokens", () => {
    const tokens = [
      { path: "color.bg.page", value: "x" },
      { path: "typography.heading-1.font-size", value: "x" },
      { path: "typography.heading-1.font-weight", value: "x" },
      { path: "typography.text.font-size", value: "x" },
    ];
    expect(typographyStyles(tokens)).toEqual(["heading-1", "text"]);
  });

  it("el CSS del estilo usa las cinco variables del estilo", () => {
    expect(typographyDeclarations("heading-2")).toBe(
      [
        "font-family: var(--typography-heading-2-font-family);",
        "font-size: var(--typography-heading-2-font-size);",
        "font-weight: var(--typography-heading-2-font-weight);",
        "line-height: var(--typography-heading-2-line-height);",
        "letter-spacing: calc(var(--typography-heading-2-letter-spacing) * 1em);",
      ].join("\n")
    );
  });
});
