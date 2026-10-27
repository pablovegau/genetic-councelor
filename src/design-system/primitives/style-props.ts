import type {
  BgRole,
  BorderRole,
  FontSize,
  FontWeight,
  LineHeight,
  Radius,
  Space,
  TextColor,
} from "../style-props.generated";

export interface BoxStyleProps {
  p?: Space;
  px?: Space;
  py?: Space;
  pt?: Space;
  pr?: Space;
  pb?: Space;
  pl?: Space;
  bg?: BgRole;
  border?: BorderRole;
  radius?: Radius;
}

export interface GapStyleProps {
  gap?: Space;
  gapX?: Space;
  gapY?: Space;
}

export interface GridStyleProps {
  /** Rejilla responsiva: tantas columnas como quepan con al menos este ancho. */
  minColumn?: Space;
}

export interface TextStyleProps {
  size?: FontSize;
  weight?: FontWeight;
  color?: TextColor;
  leading?: LineHeight;
}

export const styleKeys = new Set([
  "p",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "gap",
  "gapX",
  "gapY",
  "minColumn",
  "bg",
  "border",
  "radius",
  "size",
  "weight",
  "color",
  "leading",
]);

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

/** Separa los style props (que pasan a atributos data-*) del resto de atributos HTML. */
export function splitStyleProps(props: Record<string, unknown>) {
  const data: Record<string, string> = {};
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!styleKeys.has(key)) rest[key] = value;
    else if (value !== undefined) data[`data-${kebab(key)}`] = String(value);
  }
  return { data, rest };
}
