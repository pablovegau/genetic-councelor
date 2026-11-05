import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../primitives/cx";
import styles from "./LanguageSwitch.module.css";

export interface LanguageSwitchItem {
  /** Código del idioma ("es"); se muestra en mayúsculas y va en `lang` y `hreflang`. */
  code: string;
  href: string;
}

export interface LanguageSwitchProps extends ComponentPropsWithoutRef<"div"> {
  /** Nombre accesible del grupo ("Idiomas"). */
  label: string;
  items: LanguageSwitchItem[];
  /** Código del idioma actual. */
  current: string;
}

/** Enlaces ES / CA / EN: el idioma actual en negrita y marcado con `aria-current`. */
export function LanguageSwitch({
  label,
  items,
  current,
  className,
  ...props
}: LanguageSwitchProps) {
  return (
    <div
      className={cx(styles.langs, className)}
      role="group"
      aria-label={label}
      {...props}
    >
      {items.map(({ code, href }) => (
        <a
          key={code}
          href={href}
          lang={code}
          hrefLang={code}
          aria-current={code === current ? "true" : undefined}
        >
          {code.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
