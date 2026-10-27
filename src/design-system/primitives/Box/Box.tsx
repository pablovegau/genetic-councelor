import type { ElementType } from "react";
import { cx } from "../cx";
import { splitStyleProps, type BoxStyleProps } from "../style-props";
import type { PolymorphicProps } from "../types";
import styles from "./Box.module.css";

export type BoxProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  BoxStyleProps
>;

export function Box<T extends ElementType = "div">({
  as,
  className,
  ...props
}: BoxProps<T>) {
  const Tag: ElementType = as ?? "div";
  const { data, rest } = splitStyleProps(props as Record<string, unknown>);
  return <Tag className={cx(styles.box, className)} {...data} {...rest} />;
}
