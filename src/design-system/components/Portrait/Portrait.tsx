import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../primitives/cx";
import styles from "./Portrait.module.css";

export interface PortraitProps extends ComponentPropsWithoutRef<"figure"> {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Tamaños de la foto (`srcset`) y el ancho que ocupa (`sizes`), para no descargar de más. */
  srcSet?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
}

/** Foto en un marco de esquinas redondeadas, recortada a la persona. */
export function Portrait({
  src,
  width,
  height,
  alt,
  srcSet,
  sizes,
  loading,
  className,
  ...props
}: PortraitProps) {
  return (
    <figure className={cx(styles.portrait, className)} {...props}>
      <img
        src={src}
        width={width}
        height={height}
        alt={alt}
        srcSet={srcSet}
        sizes={sizes}
        loading={loading}
      />
    </figure>
  );
}
