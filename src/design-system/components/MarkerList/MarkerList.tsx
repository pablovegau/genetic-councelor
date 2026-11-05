import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../primitives/cx";
import { Text } from "../../primitives";
import { Link } from "../Link/Link";
import styles from "./MarkerList.module.css";

export interface MarkerListItem {
  title: string;
  text: string;
  href: string;
  /** Símbolo del árbol genealógico: círculo o cuadrado. */
  marker: "circle" | "square";
  /** Rol de color del símbolo. */
  tone: "danger" | "accent" | "action";
}

export interface MarkerListProps extends ComponentPropsWithoutRef<"ul"> {
  items: MarkerListItem[];
}

/** Lista de entradas con un símbolo de color, un título que enlaza y una descripción. Dos columnas en pantallas anchas. */
export function MarkerList({ items, className, ...props }: MarkerListProps) {
  return (
    <ul className={cx(styles.list, className)} {...props}>
      {items.map(({ title, text, href, marker, tone }) => (
        <li key={title} className={styles.item}>
          <svg
            className={styles.marker}
            data-tone={tone}
            viewBox="0 0 20 20"
            strokeWidth={2}
            aria-hidden="true"
          >
            {marker === "circle" ? (
              <circle cx="10" cy="10" r="7" />
            ) : (
              <rect x="3" y="3" width="14" height="14" />
            )}
          </svg>
          <div>
            <Link variant="title" href={href}>
              {title}
            </Link>
            <Text color="muted" leading="snug" className={styles.text}>
              {text}
            </Text>
          </div>
        </li>
      ))}
    </ul>
  );
}
