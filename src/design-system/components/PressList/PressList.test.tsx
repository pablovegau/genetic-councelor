import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PressList, type PressItem } from "./PressList";

const item = (overrides: Partial<PressItem> = {}): PressItem => ({
  id: "1",
  outlet: "La Vanguardia",
  date: "4 sept 2025",
  title: "Vall d'Hebron crea una unidad pionera",
  url: "https://example.com/noticia",
  lang: "es",
  ...overrides,
});
const props = { newTabLabel: "se abre en otra pestaña" };

describe("PressList", () => {
  it("cada noticia muestra medio y fecha, y el titular enlaza a la noticia en otra pestaña", () => {
    render(<PressList items={[item()]} {...props} />);
    expect(screen.getByText("La Vanguardia · 4 sept 2025")).toBeVisible();
    const link = screen.getByRole("link", { name: /unidad pionera/ });
    expect(link).toHaveAttribute("href", "https://example.com/noticia");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAccessibleName(/se abre en otra pestaña/);
  });

  it("el titular lleva el idioma en que se publicó", () => {
    render(<PressList items={[item({ lang: "ca" })]} {...props} />);
    expect(
      screen.getByRole("link", { name: /unidad pionera/ })
    ).toHaveAttribute("lang", "ca");
  });

  it("sin fecha solo se ve el medio, y con etiqueta se añade al lado", () => {
    render(
      <PressList
        items={[item({ date: undefined, label: "Entrevista" })]}
        {...props}
      />
    );
    expect(screen.getByText("La Vanguardia")).toBeVisible();
    expect(screen.getByText("Entrevista")).toBeVisible();
  });

  it("sin enlace el titular es solo texto", () => {
    render(<PressList items={[item({ url: undefined })]} {...props} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText(/unidad pionera/)).toBeVisible();
  });
});
