import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PublicationList, type PublicationItem } from "./PublicationList";

const item = (n: number): PublicationItem => ({
  id: String(n),
  title: `Artículo ${n}`,
  journal: "Blood",
  year: String(2020 + n),
  authors: "A, B et al.",
  url: `https://pubmed.ncbi.nlm.nih.gov/${n}/`,
});
const items = [1, 2, 3, 4, 5, 6, 7].map(item);
const props = {
  moreLabel: "Ver las 2 restantes",
  newTabLabel: "se abre en otra pestaña",
};

describe("PublicationList", () => {
  it("las más recientes quedan a la vista y el resto tras el botón de ver más", () => {
    const { container } = render(<PublicationList items={items} {...props} />);
    const details = container.querySelector("details")!;
    expect(details).not.toHaveAttribute("open");
    expect(within(details).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Artículo 1\b/ })).toBeVisible();
    expect(screen.getByText("Ver las 2 restantes")).toBeVisible();
  });

  it("con pocas publicaciones no hay botón de ver más", () => {
    const { container } = render(
      <PublicationList items={items.slice(0, 3)} {...props} />
    );
    expect(container.querySelector("details")).toBeNull();
  });

  it("el enlace va a la publicación, abre otra pestaña y lo avisa a los lectores de pantalla", () => {
    render(<PublicationList items={items.slice(0, 1)} {...props} />);
    const link = screen.getByRole("link", { name: /Artículo 1/ });
    expect(link).toHaveAttribute("href", "https://pubmed.ncbi.nlm.nih.gov/1/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAccessibleName(/se abre en otra pestaña/);
  });

  it("cada entrada muestra año, revista y autores", () => {
    render(<PublicationList items={items.slice(0, 1)} {...props} />);
    expect(screen.getByText("2021 · Blood")).toBeVisible();
    expect(screen.getByText("A, B et al.")).toBeVisible();
  });

  it("el número visible se puede cambiar", () => {
    const { container } = render(
      <PublicationList items={items} visible={2} {...props} />
    );
    expect(
      container.querySelector("details")!.querySelectorAll("li")
    ).toHaveLength(5);
  });

  it("muestra el resumen de cada artículo si lo tiene", () => {
    render(
      <PublicationList
        items={[{ ...item(1), summary: "Qué cuenta el artículo." }, item(2)]}
        {...props}
      />
    );
    expect(screen.getByText("Qué cuenta el artículo.")).toBeVisible();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
