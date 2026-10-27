import type { SVGProps } from "react";
import type { Space, TextColor } from "../../style-props.generated";
import { cx } from "../cx";
import styles from "./Icon.module.css";
import { icons, type IconName } from "./icons";

export interface IconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "name" | "color" | "children"
> {
  name: IconName;
  /** Si se indica, el icono es informativo; si no, es decorativo y se oculta a los lectores de pantalla. */
  label?: string;
  iconSize?: Space;
  color?: TextColor;
}

export function Icon({
  name,
  label,
  iconSize = "5",
  color,
  className,
  ...rest
}: IconProps) {
  return (
    <svg
      className={cx(styles.icon, className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-icon-size={iconSize}
      data-color={color}
      {...rest}
    >
      {icons[name].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
