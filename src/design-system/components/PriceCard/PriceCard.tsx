import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../../primitives/cx";
import { Text } from "../../primitives";
import styles from "./PriceCard.module.css";

export interface PriceCardProps extends Omit<
  ComponentPropsWithoutRef<"article">,
  "title"
> {
  /** Nombre de la visita ("Primera visita"). */
  name: string;
  /** Precio ya formateado ("120 €"). */
  price: string;
  /** Una aclaración corta bajo el precio, por ejemplo la duración. */
  note?: string;
  description: string;
  /** La acción de la tarjeta: normalmente un Button o un enlace. */
  children?: ReactNode;
}

/** Tarjeta de una visita con su precio a la vista y una acción. */
export function PriceCard({
  name,
  price,
  note,
  description,
  children,
  className,
  ...props
}: PriceCardProps) {
  return (
    <article className={cx(styles.card, className)} {...props}>
      <Text as="h3" variant="heading-4">
        {name}
      </Text>
      <Text as="p" variant="heading-2" className={styles.price}>
        {price}
      </Text>
      {note && (
        <Text size="2" color="muted" className={styles.note}>
          {note}
        </Text>
      )}
      <Text color="muted" className={styles.description}>
        {description}
      </Text>
      {children && <div className={styles.action}>{children}</div>}
    </article>
  );
}
