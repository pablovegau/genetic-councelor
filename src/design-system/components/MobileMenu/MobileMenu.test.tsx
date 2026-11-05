import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { MobileMenu } from "./MobileMenu";

const links = [
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Contacto", href: "#contacto" },
];

const renderMenu = () =>
  render(
    <MobileMenu
      label="Principal"
      openLabel="Abrir el menú"
      closeLabel="Cerrar el menú"
      links={links}
    >
      <a href="#cita">Reservar cita</a>
    </MobileMenu>
  );

const trigger = () => screen.getByRole("button", { name: "Abrir el menú" });

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

  it("el botón de cerrar tiene nombre accesible y cierra el menú", async () => {
    renderMenu();
    await userEvent.click(trigger());
    await userEvent.click(
      await screen.findByRole("button", { name: "Cerrar el menú" })
    );

    await waitFor(() =>
      expect(screen.queryByRole("link", { name: "Sobre mí" })).toBeNull()
    );
  });

  it("el foco no sale del panel con el tabulador", async () => {
    renderMenu();
    await userEvent.click(trigger());
    await screen.findByRole("link", { name: "Sobre mí" });

    for (let i = 0; i < 6; i++) await userEvent.tab();

    const dialog = screen.getByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("el adorno se pinta dentro del panel pero no se anuncia ni intercepta clics", async () => {
    render(
      <MobileMenu
        label="Principal"
        openLabel="Abrir el menú"
        closeLabel="Cerrar el menú"
        links={links}
        decoration={
          <svg data-testid="decoration" role="img" aria-label="Árbol" />
        }
      />
    );
    await userEvent.click(trigger());
    await screen.findByRole("link", { name: "Sobre mí" });

    const decoration = screen.getByTestId("decoration");
    expect(screen.getByRole("dialog")).toContainElement(decoration);
    // Oculto a lectores de pantalla aunque el contenido pasado tenga rol.
    expect(screen.queryByRole("img", { name: "Árbol" })).toBeNull();
    expect(
      getComputedStyle(decoration.parentElement as HTMLElement).pointerEvents
    ).toBe("none");
  });

  it("sin adorno no pinta la capa", async () => {
    renderMenu();
    await userEvent.click(trigger());
    await screen.findByRole("link", { name: "Sobre mí" });
    expect(
      screen.getByRole("dialog").querySelector("[aria-hidden]")
    ).toBeNull();
  });
});
