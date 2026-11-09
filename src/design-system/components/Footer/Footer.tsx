import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../primitives/cx";
import { Text } from "../../primitives";
import { Icon, type IconName } from "../Icon/Icon";
import { Link } from "../Link/Link";
import { Section } from "../Section/Section";
import { Wordmark } from "../Wordmark/Wordmark";
import styles from "./Footer.module.css";

/** Un enlace, o un texto sin enlace (p. ej. un dato aún pendiente) si no lleva `href`. */
export interface FooterLink {
  label: string;
  href?: string;
  /** Icono delante del texto (decorativo: el texto ya dice qué es). */
  icon?: IconName;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps extends Omit<
  ComponentPropsWithoutRef<"footer">,
  "children"
> {
  brand: string;
  tagline: string;
  columns: FooterColumn[];
  /** Línea de la base: copyright. */
  base: string;
}

/** Pie de página sobre fondo de tinta: marca y frase, columnas de enlaces y una línea final. */
export function Footer({
  brand,
  tagline,
  columns,
  base,
  className,
  ...props
}: FooterProps) {
  return (
    <Section
      as="footer"
      tone="ink"
      pad="end"
      className={cx(styles.footer, className)}
      {...props}
    >
      <div className={styles.grid}>
        <div className={styles.about}>
          <Wordmark as="strong">{brand}</Wordmark>
          <Text color="muted" className={styles.tagline}>
            {tagline}
          </Text>
        </div>
        {columns.map(({ title, links }) => (
          <div key={title}>
            <Text as="h2" className={styles.title}>
              {title}
            </Text>
            <ul className={styles.links}>
              {links.map(({ label, href, icon }) => (
                <li key={label} data-pending={href ? undefined : ""}>
                  {href ? (
                    <Link
                      variant="muted"
                      href={href}
                      className={icon ? styles.withIcon : undefined}
                    >
                      {icon && <Icon name={icon} />}
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.base}>
        <span>{base}</span>
      </div>
    </Section>
  );
}
