import { Button as BaseButton } from "@base-ui/react/button";
import type { AnchorHTMLAttributes } from "react";
import { cx } from "../../primitives/cx";
import styles from "./Button.module.css";

interface ButtonOwnProps {
  size?: "md" | "sm";
  className?: string;
}

type ButtonAsButton = ButtonOwnProps &
  Omit<BaseButton.Props, "size" | "className"> & { href?: undefined };
type ButtonAsLink = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Botón de acción. Un `<button>` con la ayuda de Base UI (deshabilitado, teclado) o, con `href`,
 * un enlace con el mismo aspecto: una acción que navega sigue siendo un enlace.
 */
export function Button({ size = "md", className, ...props }: ButtonProps) {
  const classes = cx(styles.button, className);
  if (props.href !== undefined)
    return (
      <a className={classes} data-size={size} {...props}>
        {props.children}
      </a>
    );
  return <BaseButton className={classes} data-size={size} {...props} />;
}
