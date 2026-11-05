import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { MobileMenu } from "./MobileMenu";

const links = [
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Contacto", href: "#contacto" },
];

const renderMenu = (extra?: { onOutside?: () => void }) =>
  render(
    <>
      <header>
        <button type="button" onClick={extra?.onOutside}>
          Cambiar esquema
        </button>
        <MobileMenu
          label="Principal"
          openLabel="Abrir el menú"
          closeLabel="Cerrar el menú"
          links={links}
          inertSelector="[data-page]"
        >
          <a href="#cita">Reservar cita</a>
        </MobileMenu>
      </header>
      <main data-page>
        <a href="#detras">Contenido de la página</a>
      </main>
    </>
  );

const trigger = () => screen.getByRole("button", { name: "Abrir el menú" });
const closeButton = () =>
  screen.getByRole("button", { name: "Cerrar el menú" });

describe("MobileMenu", () => {
  it("cerrado solo muestra el botón: el panel no está en el documento", () => {
    renderMenu();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Sobre mí" })).toBeNull();
  });

  it("al abrir muestra los enlaces y el contenido extra, y enfoca el primer enlace", async () => {
    renderMenu();
    await userEvent.click(trigger());

    expect(await screen.findByRole("link", { name: "Sobre mí" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Contacto" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Reservar cita" })).toBeVisible();
    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Sobre mí" })).toHaveFocus()
    );
  });

  it("el mismo botón, ya hecho X, lo cierra", async () => {
    renderMenu();
    await userEvent.click(trigger());
    await screen.findByRole("link", { name: "Sobre mí" });
    expect(closeButton()).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(closeButton());

    await waitFor(() =>
      expect(screen.queryByRole("link", { name: "Sobre mí" })).toBeNull()
    );
    expect(trigger()).toBeVisible();
  });

  it("Escape lo cierra y devuelve el foco al botón", async () => {
    renderMenu();
    await userEvent.click(trigger());
    await screen.findByRole("link", { name: "Sobre mí" });

    await userEvent.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("link", { name: "Sobre mí" })).toBeNull()
    );
    expect(trigger()).toHaveFocus();
  });

  it("elegir un enlace cierra el menú", async () => {
    renderMenu();
    await userEvent.click(trigger());
    await userEvent.click(
      await screen.findByRole("link", { name: "Contacto" })
    );

    await waitFor(() =>
      expect(screen.queryByRole("link", { name: "Contacto" })).toBeNull()
    );
  });

  it("clicar fuera del panel no lo cierra y deja usar el resto de la cabecera", async () => {
    const onOutside = vi.fn();
    renderMenu({ onOutside });
    await userEvent.click(trigger());
    await screen.findByRole("link", { name: "Sobre mí" });

    await userEvent.click(
      screen.getByRole("button", { name: "Cambiar esquema" })
    );

    expect(onOutside).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "Sobre mí" })).toBeVisible();
  });

  it("mientras está abierto la página de detrás queda inerte y el scroll bloqueado, y se libera al cerrar", async () => {
    renderMenu();
    const page = () => document.querySelector("[data-page]") as HTMLElement;
    expect(page().inert).toBe(false);

    await userEvent.click(trigger());
    await screen.findByRole("link", { name: "Sobre mí" });
    expect(page().inert).toBe(true);
    expect(getComputedStyle(document.documentElement).overflow).toBe("hidden");

    await userEvent.click(closeButton());
    await waitFor(() => expect(page().inert).toBe(false));
    expect(getComputedStyle(document.documentElement).overflow).not.toBe(
      "hidden"
    );
  });
});
