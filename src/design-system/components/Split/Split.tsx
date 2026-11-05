import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cx } from "../../primitives/cx";
import styles from "./Split.module.css";

export interface SplitProps extends ComponentPropsWithoutRef<"div"> {
  /** Cuánto más ancha es la primera columna que la segunda en pantallas anchas (1 = iguales). */
  ratio?: number;
  /** `head`: separación de una cabecera de sección. `wide`: más aire entre columnas en pantallas anchas. */
  gap?: "head" | "wide";
  /** Alineación vertical de las columnas en pantallas anchas. */
  align?: "center" | "start";
}

/** Dos bloques apilados en móvil y en dos columnas, centrados en vertical, desde 48 rem. */
export function Split({
  ratio = 1,
  gap = "head",
  align = "center",
  className,
  style,
  ...props
}: SplitProps) {
  return (
    <div
      className={cx(styles.split, className)}
      data-gap={gap}
      data-align={align}
      style={{ "--split-ratio": `${ratio}fr`, ...style } as CSSProperties}
      {...props}
    />
  );
}
