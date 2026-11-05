import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../primitives/cx";
import styles from "./Portrait.module.css";

export interface PortraitProps extends ComponentPropsWithoutRef<"figure"> {
  src: string;
  width: number;
  height: number;
  alt: string;
  loading?: "lazy" | "eager";
}

/** Foto en un marco de esquinas redondeadas, recortada a la persona. */
export function Portrait({
  src,
  width,
  height,
  alt,
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
        loading={loading}
      />
    </figure>
  );
}
