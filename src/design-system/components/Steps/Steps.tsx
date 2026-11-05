import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../primitives/cx";
import { Text } from "../../primitives";
import styles from "./Steps.module.css";

/** Trazos de un icono de 24×24: los normales y los de acento (con el color de la franja de la sección). */
export interface StepIcon {
  paths: string[];
  accent: string[];
}

export interface StepItem {
  /** Cuándo ocurre el paso ("Antes de la cita"). */
  when: string;
  title: string;
  text: string;
  /** Un dato destacado al pie: su nombre y su valor. */
  detailLabel: string;
  detail: string;
  icon: StepIcon;
}

export interface StepsProps extends ComponentPropsWithoutRef<"ol"> {
  items: StepItem[];
}

/**
 * Pasos numerados unidos por una línea, como la línea de hermanos de un árbol genealógico. En móvil
 * la línea es vertical, a la izquierda; desde 48 rem es horizontal y los pasos cuelgan de ella. Usa
 * `--section-band` y `--section-bg` de la Section que lo contiene.
 */
export function Steps({ items, className, ...props }: StepsProps) {
  return (
    <ol className={cx(styles.steps, className)} {...props}>
      {items.map((item, index) => (
        <li key={item.title} className={styles.step}>
          <span className={styles.marker}>{index + 1}</span>
          <span className={styles.icon} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              {item.icon.paths.map((d) => (
                <path key={d} d={d} />
              ))}
              {item.icon.accent.map((d) => (
                <path key={d} d={d} className={styles.accent} />
              ))}
            </svg>
          </span>
          <Text as="small" variant="text-sm" color="muted">
            {item.when}
          </Text>
          <Text as="h3" variant="heading-4">
            {item.title}
          </Text>
          <Text color="muted" leading="normal" className={styles.text}>
            {item.text}
          </Text>
          <dl className={styles.detail}>
            <Text as="dt" size="2" color="muted">
              {item.detailLabel}
            </Text>
            <Text as="dd" weight="semibold">
              {item.detail}
            </Text>
          </dl>
        </li>
      ))}
    </ol>
  );
}
