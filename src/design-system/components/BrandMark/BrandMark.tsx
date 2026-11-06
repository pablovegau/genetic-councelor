import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../primitives/cx";
import styles from "./BrandMark.module.css";

export interface BrandMarkProps extends ComponentPropsWithoutRef<"svg"> {
  /** Nombre accesible. Sin él, el símbolo es decorativo (acompaña al nombre escrito). */
  title?: string;
}

/**
 * El símbolo de la marca: una persona (círculo, según la NSGC) y la flecha que señala a quien
 * consulta, el probando. Es el mismo gesto del árbol genealógico de la portada.
 */
export function BrandMark({ title, className, ...props }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cx(styles.mark, className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle className={styles.person} cx="20" cy="20" r="8" />
      <path className={styles.arrow} d="M4 4L12 12M12 12H6M12 12V6" />
    </svg>
  );
}
