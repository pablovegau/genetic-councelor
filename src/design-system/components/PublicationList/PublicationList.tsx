import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../primitives/cx";
import { Text } from "../../primitives";
import { Link } from "../Link/Link";
import styles from "./PublicationList.module.css";

export interface PublicationItem {
  id: string;
  title: string;
  journal: string;
  year: string;
  /** Autores ya formateados ("A, B, C et al."). */
  authors: string;
  /** Página de la publicación (PubMed). */
  url: string;
}

export interface PublicationListProps extends ComponentPropsWithoutRef<"div"> {
  items: PublicationItem[];
  /** Cuántas se ven siempre; el resto queda tras el botón de ver más. */
  visible?: number;
  /** Texto del botón que despliega el resto ("Ver las 21 restantes"). */
  moreLabel: string;
  /** Aviso para lectores de pantalla: el enlace abre otra pestaña. */
  newTabLabel: string;
}

function Entry({
  item,
  newTabLabel,
}: {
  item: PublicationItem;
  newTabLabel: string;
}) {
  return (
    <li className={styles.entry}>
      <Text size="2" color="muted">
        {item.year} · {item.journal}
      </Text>
      <Link
        variant="emphasis"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.title}
      >
        {item.title}
        <span className={styles.hidden}> ({newTabLabel})</span>
      </Link>
      <Text size="2" color="muted">
        {item.authors}
      </Text>
    </li>
  );
}

/** Publicaciones con las más recientes a la vista y el resto en un desplegable nativo (sin JavaScript). */
export function PublicationList({
  items,
  visible = 5,
  moreLabel,
  newTabLabel,
  className,
  ...props
}: PublicationListProps) {
  const first = items.slice(0, visible);
  const rest = items.slice(visible);
  return (
    <div className={cx(styles.list, className)} {...props}>
      <ol className={styles.items}>
        {first.map((item) => (
          <Entry key={item.id} item={item} newTabLabel={newTabLabel} />
        ))}
      </ol>
      {rest.length > 0 && (
        <details className={styles.more}>
          <summary>{moreLabel}</summary>
          <ol className={styles.items}>
            {rest.map((item) => (
              <Entry key={item.id} item={item} newTabLabel={newTabLabel} />
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
