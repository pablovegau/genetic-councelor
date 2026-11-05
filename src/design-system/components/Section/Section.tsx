import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../../primitives/cx";
import styles from "./Section.module.css";

export type SectionTone = "none" | "violet" | "orange" | "ink";
export type SectionBand = "none" | "action" | "accent";
/** `section`: ritmo vertical normal. `start`: menos aire arriba (la primera sección). `end`: menos aire abajo (el pie). `bar`: una barra, como la cabecera. */
export type ContainerPad = "section" | "start" | "end" | "bar";

export interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  pad?: ContainerPad;
}

/** Columna centrada con el ancho máximo del sitio y su margen lateral. */
export function Container({
  pad = "section",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cx(styles.container, className)}
      data-pad={pad}
      {...props}
    />
  );
}

export interface SectionProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> {
  as?: "section" | "div" | "footer";
  /** Fondo de la sección: sin color, un tinte, o tinta (oscuro con texto claro en los dos esquemas). */
  tone?: SectionTone;
  /** Franja de color en el borde superior. */
  band?: SectionBand;
  pad?: ContainerPad;
  children?: ReactNode;
}

/**
 * Banda de página de lado a lado con su contenido en un Container. Expone `--section-bg`,
 * `--section-band` y `--section-on-band` para que los hijos (p. ej. Steps) casen con ella.
 */
export function Section({
  as: Tag = "section",
  tone = "none",
  band = "none",
  pad,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cx(styles.section, className)}
      data-tone={tone}
      data-band={band}
      {...props}
    >
      <Container pad={pad}>{children}</Container>
    </Tag>
  );
}
