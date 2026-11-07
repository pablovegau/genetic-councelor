import { describe, expect, it } from "vitest";
import { treeNodes } from "./family-tree-geometry";

describe("árbol genealógico", () => {
  it("el texto de cada símbolo coincide con su forma: cuadrado = hombre, círculo = mujer", () => {
    for (const { shape, symbol } of treeNodes) {
      expect(symbol.startsWith("man")).toBe(shape === "square");
      expect(symbol.startsWith("woman")).toBe(shape === "circle");
    }
  });

  it("los portadores llevan punto y las condiciones, relleno", () => {
    for (const { symbol, carrier, fill } of treeNodes) {
      expect(Boolean(carrier)).toBe(symbol.endsWith("Carrier"));
      expect(Boolean(fill)).toBe(
        symbol.endsWith("Affected") || symbol.endsWith("Other")
      );
    }
  });
});
