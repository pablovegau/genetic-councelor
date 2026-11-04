import { describe, expect, it } from "vitest";
import {
  aliasTarget,
  flattenTokens,
  formatOklch,
  tokenReference,
  tokenVariable,
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
