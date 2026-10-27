import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { computed } from "../../testing/computed";
import { Text } from "./Text";

const styleOf = () => getComputedStyle(screen.getByTestId("text"));

describe("Text", () => {
  it("renderiza un párrafo por defecto y sin margen", () => {
    render(<Text data-testid="text">hola</Text>);
    expect(screen.getByTestId("text").tagName).toBe("P");
    expect(styleOf().marginTop).toBe("0px");
    expect(styleOf().marginBottom).toBe("0px");
  });

  it("cambia de etiqueta con as", () => {
    render(
      <Text as="h2" data-testid="text">
        título
      </Text>
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "título"
    );
  });

  it("size usa el tamaño de la escala tipográfica", () => {
    render(<Text data-testid="text" size="8" />);
    const expected = computed("font-size", "var(--font-size-8)");
    expect(expected).not.toBe(computed("font-size", "var(--font-size-3)"));
    expect(styleOf().fontSize).toBe(expected);
  });

  it("weight usa el peso de la escala", () => {
    render(<Text data-testid="text" weight="bold" />);
    expect(styleOf().fontWeight).toBe(
      computed("font-weight", "var(--font-weight-bold)")
    );
    expect(styleOf().fontWeight).not.toBe(
      computed("font-weight", "var(--font-weight-regular)")
    );
  });

  it("leading usa el interlineado de la escala, proporcional al cuerpo", () => {
    render(<Text data-testid="text" size="5" leading="tight" />);
    // Un interlineado sin unidad se calcula en px a partir del font-size.
    const context = { "font-size": "var(--font-size-5)" };
    const expected = computed(
      "line-height",
      "var(--font-line-height-tight)",
      context
    );
    expect(styleOf().lineHeight).toBe(expected);
    expect(expected).not.toBe(
      computed("line-height", "var(--font-line-height-relaxed)", context)
    );
  });

  it("color usa el rol de color de texto", () => {
    render(<Text data-testid="text" color="muted" />);
    const expected = computed("color", "var(--color-text-muted)");
    expect(expected).not.toBe(computed("color", "var(--color-text-default)"));
    expect(styleOf().color).toBe(expected);
  });

  it.each(["start", "center", "end"] as const)(
    "align=%s alinea el texto a %s",
    (align) => {
      render(<Text data-testid="text" align={align} />);
      expect(screen.getByTestId("text")).toHaveAttribute("data-align", align);
      expect(styleOf().textAlign).toBe(align);
    }
  );

  it("también acepta los style props de Box, porque es un Box", () => {
    render(<Text data-testid="text" p="4" border="default" />);
    expect(styleOf().paddingTop).toBe(
      computed("padding-top", "var(--space-4)")
    );
    expect(styleOf().borderTopStyle).toBe("solid");
  });

  it("deja pasar atributos propios del elemento elegido", () => {
    render(
      <Text as="a" href="/contacto">
        ir
      </Text>
    );
    expect(screen.getByRole("link", { name: "ir" })).toHaveAttribute(
      "href",
      "/contacto"
    );
  });
});
