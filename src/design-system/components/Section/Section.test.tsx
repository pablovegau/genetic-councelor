import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { computed } from "../../testing/computed";
import { Container, Section } from "./Section";

const section = () => screen.getByTestId("section");
const style = () => getComputedStyle(section());

describe("Section", () => {
  it("es una sección con su contenido dentro de un Container", () => {
    render(
      <Section data-testid="section">
        <p>Contenido</p>
      </Section>
    );
    expect(section().tagName).toBe("SECTION");
    expect(section().firstElementChild?.nextElementSibling).toBeNull();
    expect(section().firstElementChild).toContainElement(
      screen.getByText("Contenido")
    );
  });

  it("sin tono no lleva fondo", () => {
    render(<Section data-testid="section" />);
    expect(style().backgroundColor).toBe("rgba(0, 0, 0, 0)");
  });

  it.each([
    ["violet", "--color-tint-violet"],
    ["orange", "--color-tint-orange"],
  ] as const)("el tono %s usa su tinte", (tone, token) => {
    render(<Section data-testid="section" tone={tone} />);
    expect(style().backgroundColor).toBe(
      computed("background-color", `var(${token})`)
    );
  });

  it("el tono tinta lleva texto claro: redefine los roles de texto para sus hijos", () => {
    render(
      <Section data-testid="section" tone="ink">
        <p data-testid="muted">Texto</p>
      </Section>
    );
    expect(style().getPropertyValue("--color-text-default")).toBe("#f3f3f6");
    expect(style().color).toBe("rgb(243, 243, 246)");
    expect(style().backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  });

  it("la franja es una línea de color en el borde superior", () => {
    render(<Section data-testid="section" band="action" />);
    expect(style().boxShadow).toContain(
      computed("color", "var(--color-action-bg)")
    );
    expect(style().boxShadow).toMatch(/inset/);
  });

  it("la franja de acento usa el color de acento", () => {
    render(<Section data-testid="section" band="accent" />);
    expect(style().boxShadow).toContain(
      computed("color", "var(--color-accent-bg)")
    );
  });

  it("puede ser otra etiqueta (footer)", () => {
    render(<Section data-testid="section" as="footer" />);
    expect(section().tagName).toBe("FOOTER");
  });
});

describe("Container", () => {
  it("centra el contenido y limita su ancho", () => {
    render(<Container data-testid="container" />);
    const style = getComputedStyle(screen.getByTestId("container"));
    expect(style.marginLeft).toBe(style.marginRight);
    expect(style.maxWidth).not.toBe("none");
  });

  it("la barra tiene menos relleno vertical que una sección", () => {
    render(
      <>
        <Container data-testid="a" />
        <Container data-testid="b" pad="bar" />
      </>
    );
    const top = (id: string) =>
      parseFloat(getComputedStyle(screen.getByTestId(id)).paddingTop);
    expect(top("b")).toBeLessThan(top("a"));
  });
});
