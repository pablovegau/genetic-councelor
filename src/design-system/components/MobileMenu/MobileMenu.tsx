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
  /**
   * Partes de la página que quedan inertes mientras el menú está abierto. La cabecera no va aquí:
   * sigue usable (cambiar de esquema, etc.) y solo se cierra con la X, Escape o eligiendo un enlace.
   */
  inertSelector?: string;
}

// Debe coincidir con el breakpoint de la media query del CSS (48rem, como el resto del sitio).
const desktop = "(min-width: 48rem)";

/**
 * Menú de móvil: un botón de hamburguesa que pasa a X y un panel lateral con cristal esmerilado.
 * Es un diálogo no modal de Base UI: pone el foco y gestiona Escape, pero no cierra al clicar fuera ni
 * bloquea la cabecera. Solo se cierra con la X (el propio botón), Escape o eligiendo un enlace.
 * Es una isla: hidratar con `client:idle`.
 */
export function MobileMenu({
  label,
  openLabel,
  closeLabel,
  links,
  children,
  inertSelector = "main, footer",
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

  // Abierto: la página de detrás queda inerte y sin scroll, pero la cabecera sigue libre.
  useEffect(() => {
    if (!open) return;
    const inerted = [...document.querySelectorAll<HTMLElement>(inertSelector)];
    inerted.forEach((element) => (element.inert = true));
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      inerted.forEach((element) => (element.inert = false));
      root.style.overflow = overflow;
    };
  }, [open, inertSelector]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}
      modal={false}
      disablePointerDismissal
    >
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
