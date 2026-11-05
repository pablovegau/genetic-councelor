import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../primitives/cx";
import styles from "./Link.module.css";

/**
 * `emphasis`: enlace de texto en negrita y subrayado. `title`: el título de una entrada, grande.
 * `nav`: de navegación, sin subrayado hasta el hover. `muted`: apagado, para pies y listas de enlaces.
 */
export type LinkVariant = "emphasis" | "title" | "nav" | "muted";

export interface LinkProps extends ComponentPropsWithoutRef<"a"> {
  variant?: LinkVariant;
}

export function Link({
  variant = "emphasis",
  className,
  children,
  ...props
}: LinkProps) {
  return (
    <a className={cx(styles.link, className)} data-variant={variant} {...props}>
      {children}
    </a>
  );
}
