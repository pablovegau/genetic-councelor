import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../primitives/cx";
import { Text } from "../../primitives";
import styles from "./Byline.module.css";

export interface BylineImage {
  src: string;
  width: number;
  height: number;
  /** Tamaños de la foto (`srcset`) y el ancho que ocupa (`sizes`), para no descargar de más. */
  srcSet?: string;
  sizes?: string;
}

export interface BylineProps extends ComponentPropsWithoutRef<"div"> {
  /** Foto de la persona; se recorta a la cara en un círculo. Es decorativa: el nombre va al lado. */
  avatar: BylineImage;
  name: string;
  description: string;
}

/** Firma: foto redonda con el nombre y el cargo. */
export function Byline({
  avatar,
  name,
  description,
  className,
  ...props
}: BylineProps) {
  return (
    <div className={cx(styles.byline, className)} {...props}>
      <span className={styles.avatar}>
        <img
          src={avatar.src}
          alt=""
          width={avatar.width}
          height={avatar.height}
          srcSet={avatar.srcSet}
          sizes={avatar.sizes}
        />
      </span>
      <span>
        <Text as="strong" className={styles.name}>
          {name}
        </Text>
        <Text
          as="small"
          variant="text-sm"
          color="muted"
          className={styles.role}
        >
          {description}
        </Text>
      </span>
    </div>
  );
}
