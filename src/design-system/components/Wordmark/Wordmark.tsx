import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../primitives/cx";
import styles from "./Wordmark.module.css";

export interface WordmarkProps extends ComponentPropsWithoutRef<"a"> {
  /** Un enlace (cabecera) o un texto (pie). */
  as?: "a" | "strong";
  /** En pantallas muy estrechas baja un poco el tamaño y no parte el nombre en dos líneas. */
  fit?: boolean;
  /** El hijo incluye el símbolo (BrandMark) junto al nombre: los pone en fila. */
  mark?: boolean;
}

/** El nombre del sitio en la tipografía de titulares. */
export function Wordmark({
  as: Tag = "a",
  fit,
  mark,
  className,
  ...props
}: WordmarkProps) {
  return (
    <Tag
      className={cx(styles.wordmark, className)}
      data-fit={fit ? "" : undefined}
      data-mark={mark ? "" : undefined}
      {...props}
    />
  );
}
