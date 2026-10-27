import type { ElementType } from "react";
import { Box, type BoxProps } from "../Box/Box";
import { cx } from "../cx";
import type {
  BoxStyleProps,
  GapStyleProps,
  GridStyleProps,
} from "../style-props";
import type { PolymorphicProps } from "../types";
import styles from "./Grid.module.css";

interface GridOwnProps extends BoxStyleProps, GapStyleProps, GridStyleProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  align?: "start" | "center" | "end" | "stretch";
}

export type GridProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  GridOwnProps
>;

export function Grid<T extends ElementType = "div">({
  columns,
  align,
  className,
  ...props
}: GridProps<T>) {
  return (
    <Box
      className={cx(styles.grid, className)}
      data-columns={columns}
      data-align={align}
      {...(props as BoxProps)}
    />
  );
}
