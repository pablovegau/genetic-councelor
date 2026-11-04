import type { ElementType } from "react";
import { Box, type BoxProps } from "../Box/Box";
import { cx } from "../cx";
import type { BoxStyleProps, TextStyleProps } from "../style-props";
import type { PolymorphicProps } from "../types";
import styles from "./Text.module.css";

interface TextOwnProps extends BoxStyleProps, TextStyleProps {
  align?: "start" | "center" | "end";
}

export type TextProps<T extends ElementType = "p"> = PolymorphicProps<
  T,
  TextOwnProps
>;

/** Un titular se renderiza con la etiqueta de su nivel; el resto, como párrafo. */
const defaultTag = (variant: TextOwnProps["variant"]): ElementType => {
  const level = /^heading-([1-5])$/.exec(variant ?? "")?.[1];
  return level ? (`h${level}` as ElementType) : "p";
};

export function Text<T extends ElementType = "p">({
  as,
  align,
  className,
  ...props
}: TextProps<T>) {
  return (
    <Box
      as={as ?? defaultTag(props.variant)}
      className={cx(styles.text, className)}
      data-align={align}
      {...(props as BoxProps)}
    />
  );
}
