import { describe, expect, it } from "vitest";
import {
  colorValueToSrgb,
  contrastRatio,
  oklchToSrgb,
  type Rgb,
} from "./color";

const close = (actual: Rgb, expected: Rgb, tolerance: number) => {
  actual.forEach((channel, index) =>
    expect(Math.abs(channel - expected[index]!)).toBeLessThan(tolerance)
  );
};

describe("conversión de oklch a sRGB", () => {
  it("el blanco en oklch es blanco en sRGB", () => {
    close(oklchToSrgb(1, 0, 0), [1, 1, 1], 0.001);
  });

  it("el negro en oklch es negro en sRGB", () => {
    close(oklchToSrgb(0, 0, 0), [0, 0, 0], 0.001);
  });

  it("el magenta del ejemplo de la especificación DTCG es magenta en sRGB", () => {
    close(oklchToSrgb(0.7016, 0.3225, 328.363), [1, 0, 1], 0.01);
  });
});

describe("valores de color DTCG", () => {
  it("lee un color srgb por sus componentes", () => {
    close(
      colorValueToSrgb({ colorSpace: "srgb", components: [1, 0.5, 0] }),
      [1, 0.5, 0],
      0.0001
    );
  });

  it("rechaza un espacio de color que los tests no saben convertir", () => {
    expect(() =>
      colorValueToSrgb({ colorSpace: "lab", components: [50, 0, 0] })
    ).toThrow(/lab/);
  });
});

describe("ratio de contraste WCAG", () => {
  it("blanco sobre negro es 21:1", () => {
    expect(contrastRatio([1, 1, 1], [0, 0, 0])).toBeCloseTo(21, 1);
  });

  it("#767676 sobre blanco es 4,54:1, el gris más claro que cumple AA", () => {
    const gray = 118 / 255;
    expect(contrastRatio([gray, gray, gray], [1, 1, 1])).toBeCloseTo(4.54, 1);
  });

  it("el ratio no depende del orden de los colores", () => {
    const a: Rgb = [0.2, 0.4, 0.6];
    const b: Rgb = [0.9, 0.8, 0.1];
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
  });
});
