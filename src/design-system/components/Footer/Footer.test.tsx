import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

const props = {
  brand: "Sara Torres-Esquius",
  tagline: "Asesoramiento genético.",
  base: "© 2026",
  columns: [
    {
      title: "Páginas",
      links: [{ label: "Inicio", href: "/" }],
    },
    {
      title: "Contacto",
      links: [
        { label: "Correo: pendiente" },
        { label: "LinkedIn", href: "#in" },
      ],
    },
  ],
};

describe("Footer", () => {
  it("es el pie de la página con la marca, la frase y la línea final", () => {
    render(<Footer {...props} />);
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText("Sara Torres-Esquius")).toBeVisible();
    expect(within(footer).getByText("Asesoramiento genético.")).toBeVisible();
    expect(within(footer).getByText("© 2026")).toBeVisible();
  });

  it("cada columna lleva su título y sus enlaces", () => {
    render(<Footer {...props} />);
    expect(screen.getByRole("heading", { name: "Páginas" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "#in"
    );
  });

  it("un elemento sin href es solo texto, no un enlace", () => {
    render(<Footer {...props} />);
    expect(
      screen.queryByRole("link", { name: "Correo: pendiente" })
    ).toBeNull();
    expect(screen.getByText("Correo: pendiente")).toBeVisible();
    expect(screen.getByText("Correo: pendiente").closest("a")).toBeNull();
  });

  it("sus enlaces se leen con el texto claro de la tinta", () => {
    render(<Footer {...props} />);
    expect(getComputedStyle(screen.getByRole("contentinfo")).color).toBe(
      "rgb(243, 243, 246)"
    );
  });
});
