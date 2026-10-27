// Soporte de los tests de tokens: conversión de color y contraste WCAG.
export type Rgb = [number, number, number];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const encodeSrgb = (linear: number) => {
  const value =
    linear <= 0.0031308 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - 0.055;
  return clamp01(value);
};

const decodeSrgb = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

/** oklch (L 0..1, C, H en grados) a sRGB (0..1), recortado al gamut sRGB. */
export function oklchToSrgb(l: number, c: number, h: number): Rgb {
  const hue = (h * Math.PI) / 180;
  const a = c * Math.cos(hue);
  const b = c * Math.sin(hue);
  const lCone = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mCone = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sCone = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    encodeSrgb(
      4.0767416621 * lCone - 3.3077115913 * mCone + 0.2309699292 * sCone
    ),
    encodeSrgb(
      -1.2684380046 * lCone + 2.6097574011 * mCone - 0.3413193965 * sCone
    ),
    encodeSrgb(
      -0.0041960863 * lCone - 0.7034186147 * mCone + 1.707614701 * sCone
    ),
  ];
}

export interface ColorValue {
  colorSpace: string;
  components: (number | "none")[];
}

const channel = (component: number | "none" | undefined) =>
  component === "none" || component === undefined ? 0 : component;

/** Convierte un valor de color DTCG a sRGB. Solo conoce los espacios que usan los tokens. */
export function colorValueToSrgb(value: ColorValue): Rgb {
  const [first, second, third] = value.components.map(channel) as [
    number,
    number,
    number,
  ];
  if (value.colorSpace === "srgb") return [first, second, third];
  if (value.colorSpace === "oklch") return oklchToSrgb(first, second, third);
  throw new Error(
    `Espacio de color sin conversión en los tests: ${value.colorSpace}`
  );
}

export function relativeLuminance([red, green, blue]: Rgb) {
  return (
    0.2126 * decodeSrgb(red) +
    0.7152 * decodeSrgb(green) +
    0.0722 * decodeSrgb(blue)
  );
}

export function contrastRatio(first: Rgb, second: Rgb) {
  const [lighter, darker] = [
    relativeLuminance(first),
    relativeLuminance(second),
  ].sort((x, y) => y - x) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
}
