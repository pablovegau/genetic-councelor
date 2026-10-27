import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { cx } from "./cx";
import { splitStyleProps, styleKeys } from "./style-props";

describe("splitStyleProps", () => {
  it("convierte los style props en atributos data-*", () => {
    expect(splitStyleProps({ p: "4", bg: "surface" }).data).toEqual({
      "data-p": "4",
      "data-bg": "surface",
    });
  });

  it("escribe los nombres en camelCase como kebab-case", () => {
    expect(splitStyleProps({ gapX: "2", minColumn: "24" }).data).toEqual({
      "data-gap-x": "2",
      "data-min-column": "24",
    });
  });

  it("deja pasar el resto de atributos sin tocarlos", () => {
    const rest = { id: "a", "aria-label": "Cerrar", onClick: () => {} };
    expect(splitStyleProps(rest).rest).toEqual(rest);
    expect(splitStyleProps(rest).data).toEqual({});
  });

  it("separa style props y atributos cuando vienen mezclados", () => {
    const result = splitStyleProps({ p: "2", id: "x", radius: "control" });
    expect(result.data).toEqual({ "data-p": "2", "data-radius": "control" });
    expect(result.rest).toEqual({ id: "x" });
  });

  it("omite los style props sin valor", () => {
    expect(splitStyleProps({ p: undefined, bg: "page" }).data).toEqual({
      "data-bg": "page",
    });
  });

  it('conserva el paso "0", que es un valor válido aunque parezca vacío', () => {
    expect(splitStyleProps({ p: "0" }).data).toEqual({ "data-p": "0" });
  });
});

describe("cx", () => {
  it("une los nombres de clase con un espacio, en orden", () => {
    expect(cx("box", "flex", "extra")).toBe("box flex extra");
  });

  it("ignora los valores vacíos o falsos", () => {
    expect(cx("box", false, undefined, null, "", "extra")).toBe("box extra");
  });

  it("devuelve una cadena vacía si no hay nada que unir", () => {
    expect(cx(undefined, false)).toBe("");
  });
});

// Contrato entre el generador (S3) y el helper: el CSS generado y splitStyleProps
// deben hablar de los mismos props. Requiere `pnpm tokens`.
const read = (relative: string) =>
  readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

const camel = (name: string) =>
  name.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());

describe("contrato entre los style props generados y el helper", () => {
  const styleCss = read("../style-props.generated.css");
  const tokensCss = read("../tokens.generated.css");

  it("el CSS generado emite exactamente los props que reconoce el helper, más iconSize", () => {
    const emitted = [
      ...new Set(
        [...styleCss.matchAll(/\[data-([a-z-]+)="/g)].map((m) => camel(m[1]!))
      ),
    ].sort();
    // iconSize lo gestiona el componente Icon, no splitStyleProps.
    expect(emitted).toEqual([...styleKeys, "iconSize"].sort());
  });

  it("todas las variables que usan los style props están declaradas en los tokens", () => {
    const used = new Set(
      [...styleCss.matchAll(/var\((--[a-z0-9-]+)\)/g)].map((m) => m[1]!)
    );
    const declared = new Set(
      [...tokensCss.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1]!)
    );
    expect([...used].filter((name) => !declared.has(name))).toEqual([]);
  });

  it("hay variables referenciadas (el test no es vacío)", () => {
    expect(styleCss.match(/var\(--/g)!.length).toBeGreaterThan(100);
  });
});
