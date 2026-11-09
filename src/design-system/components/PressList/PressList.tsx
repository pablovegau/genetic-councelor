import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../primitives/cx";
import { Text } from "../../primitives";
import { Link } from "../Link/Link";
import styles from "./PressList.module.css";

export interface PressItem {
  id: string;
  /** Medio: «La Vanguardia», «RTVE». */
  outlet: string;
  /** Fecha ya formateada; sin ella solo se ve el medio. */
  date?: string;
  /** Titular tal como se publicó, en su idioma. */
  title: string;
  /** Idioma del titular (`ca`, `es`…), para lectores de pantalla y correctores. */
  lang?: string;
  /** Enlace a la noticia. Sin él, el titular es solo texto. */
  url?: string;
  /** Etiqueta breve: «Entrevista». */
  label?: string;
}

export interface PressListProps extends ComponentPropsWithoutRef<"ul"> {
  items: PressItem[];
  /** Aviso para lectores de pantalla: el enlace abre otra pestaña. */
  newTabLabel: string;
}

/** Noticias y entrevistas: medio y fecha arriba, titular enlazado debajo (se abre en otra pestaña). */
export function PressList({
  items,
  newTabLabel,
  className,
  ...props
}: PressListProps) {
  return (
    <ul className={cx(styles.items, className)} {...props}>
      {items.map(({ id, outlet, date, title, lang, url, label }) => (
        <li key={id} className={styles.entry}>
          <Text size="2" color="muted">
            {[outlet, date].filter(Boolean).join(" · ")}
            {label && <span className={styles.label}>{label}</span>}
          </Text>
          {url ? (
            <Link
              variant="emphasis"
              href={url}
              lang={lang}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.title}
            >
              {title}
              <span className={styles.hidden}> ({newTabLabel})</span>
            </Link>
          ) : (
            <Text lang={lang} className={styles.title}>
              {title}
            </Text>
          )}
        </li>
      ))}
    </ul>
  );
}
