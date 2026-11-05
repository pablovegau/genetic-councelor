import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageSwitch } from "./LanguageSwitch";

const items = [
  { code: "es", href: "/" },
  { code: "ca", href: "/ca/" },
  { code: "en", href: "/en/" },
];

describe("LanguageSwitch", () => {
  it("es un grupo con nombre accesible y un enlace por idioma", () => {
    render(<LanguageSwitch label="Idiomas" items={items} current="es" />);
    const group = screen.getByRole("group", { name: "Idiomas" });
    expect(group.querySelectorAll("a")).toHaveLength(3);
  });

  it("muestra el código en mayúsculas y marca el idioma en el enlace", () => {
    render(<LanguageSwitch label="Idiomas" items={items} current="es" />);
    const ca = screen.getByRole("link", { name: "CA" });
    expect(ca).toHaveAttribute("href", "/ca/");
    expect(ca).toHaveAttribute("lang", "ca");
    expect(ca).toHaveAttribute("hreflang", "ca");
  });

  it("solo el idioma actual lleva aria-current y va en negrita", () => {
    render(<LanguageSwitch label="Idiomas" items={items} current="ca" />);
    expect(screen.getByRole("link", { name: "CA" })).toHaveAttribute(
      "aria-current",
      "true"
    );
    expect(screen.getByRole("link", { name: "ES" })).not.toHaveAttribute(
      "aria-current"
    );
    expect(
      getComputedStyle(screen.getByRole("link", { name: "CA" })).fontWeight
    ).toBe("700");
  });
});
