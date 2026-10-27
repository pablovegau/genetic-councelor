import type { ElementType } from "react";
import { Box, type BoxProps } from "../Box/Box";
import { cx } from "../cx";
import type { BoxStyleProps, GapStyleProps } from "../style-props";
import type { PolymorphicProps } from "../types";
import styles from "./Flex.module.css";

interface FlexOwnProps extends BoxStyleProps, GapStyleProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  inline?: boolean;
}

export type FlexProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  FlexOwnProps
>;

export function Flex<T extends ElementType = "div">({
  direction,
  align,
  justify,
  wrap,
  inline,
  className,
  ...props
}: FlexProps<T>) {
  return (
    <Box
      className={cx(styles.flex, className)}
      data-direction={direction}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap ? "" : undefined}
      data-inline={inline ? "" : undefined}
      {...(props as BoxProps)}
    />
  );
}
