import { Dialog } from "@base-ui/react/dialog";
import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./MobileMenu.module.css";

export interface MobileMenuProps {
  /** Nombre accesible del menú de navegación. */
  label: string;
  openLabel: string;
  closeLabel: string;
  links: { label: string; href: string }[];
  /** Lo que va bajo los enlaces: selector de idioma, botón de reservar… */
  children?: ReactNode;
}

// Debe coincidir con el breakpoint de la media query del CSS (48rem, como el resto del sitio).
const desktop = "(min-width: 48rem)";

/**
 * Menú de móvil: un botón de hamburguesa que pasa a X y un panel lateral con cristal esmerilado.
 * Base UI Dialog pone el foco, el Escape, el bloqueo del scroll y el `inert` del resto de la página.
 * Es una isla: hidratar con `client:idle`.
 */
export function MobileMenu({
  label,
  openLabel,
  closeLabel,
  links,
  children,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Al pasar a escritorio el panel deja de tener sentido: se cierra solo.
  useEffect(() => {
    const query = matchMedia(desktop);
    const close = (event: MediaQueryListEvent) =>
      event.matches && setOpen(false);
    query.addEventListener("change", close);
    return () => query.removeEventListener("change", close);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={styles.trigger}
        aria-label={open ? closeLabel : openLabel}
      >
        <span className={styles.bars} aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup
          className={styles.popup}
          initialFocus={firstLink}
          // Elegir cualquier enlace (también los del contenido extra) cierra el panel.
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          <Dialog.Title className={styles.title}>{label}</Dialog.Title>
          {/* Transparente y encima del botón de abrir, que es el que se ve hecho X. */}
          <Dialog.Close className={styles.close} aria-label={closeLabel} />
          <div className={styles.scroll}>
            <nav aria-label={label} className={styles.nav}>
              <ul className={styles.list}>
                {links.map(({ label: text, href }, index) => (
                  <li key={href}>
                    <a
                      className={styles.link}
                      href={href}
                      ref={index === 0 ? firstLink : undefined}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
              <div className={styles.extra}>{children}</div>
            </nav>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
