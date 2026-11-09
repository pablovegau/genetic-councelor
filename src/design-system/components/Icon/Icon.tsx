import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../primitives/cx";
import styles from "./Icon.module.css";

/** Línea (`stroke`) o silueta rellena (`fill`): los logos de marca son siluetas. */
const icons = {
  mail: {
    kind: "stroke",
    paths: [
      "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
      "M3 7l9 6.5L21 7",
    ],
  },
  linkedin: {
    kind: "fill",
    paths: [
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    ],
  },
} as const;

export type IconName = keyof typeof icons;
export const iconNames = Object.keys(icons) as IconName[];

export interface IconProps extends Omit<
  ComponentPropsWithoutRef<"svg">,
  "children"
> {
  name: IconName;
  /** Nombre accesible. Sin él, el icono es decorativo (acompaña a un texto). */
  title?: string;
}

/** Icono de 1,25 em que hereda el color del texto. Los logos de redes sociales se añaden aquí. */
export function Icon({ name, title, className, ...props }: IconProps) {
  const { kind, paths } = icons[name];
  return (
    <svg
      viewBox="0 0 24 24"
      className={cx(styles.icon, className)}
      data-icon={name}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      fill={kind === "fill" ? "currentColor" : "none"}
      stroke={kind === "stroke" ? "currentColor" : undefined}
      strokeWidth={kind === "stroke" ? 1.75 : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
