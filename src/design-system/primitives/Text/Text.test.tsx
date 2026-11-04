import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { textVariants } from "../../style-props.generated";
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

describe("Text · variant", () => {
  const desktop = () => page.viewport(1024, 800);
  const compact = () => page.viewport(390, 800);
  const headingLevels = ["1", "2", "3", "4", "5"] as const;

  it.each(headingLevels)(
    "heading-%s se renderiza como un encabezado de su nivel por defecto",
    (level) => {
      render(<Text variant={`heading-${level}`}>título</Text>);
      expect(
        screen.getByRole("heading", { level: Number(level) })
      ).toBeTruthy();
    }
  );

  it.each(["text-lg", "text", "text-sm", "caption"] as const)(
    "%s se renderiza como un párrafo por defecto",
    (variant) => {
      render(
        <Text variant={variant} data-testid="text">
          texto
        </Text>
      );
      expect(screen.getByTestId("text").tagName).toBe("P");
    }
  );

  it("as manda sobre la etiqueta por defecto de la variante", () => {
    render(
      <Text variant="heading-2" as="h3">
        título
      </Text>
    );
    expect(screen.getByRole("heading", { level: 3 })).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
  });

  it.each(textVariants)(
    "%s aplica en escritorio los valores de sus tokens",
    async (variant) => {
      await desktop();
      render(<Text variant={variant} data-testid="text" />);
      const token = (property: string) =>
        `var(--typography-${variant}-${property})`;
      const context = { "font-size": token("font-size") };
      expect(styleOf().fontFamily).toBe(
        computed("font-family", token("font-family"))
      );
      expect(styleOf().fontSize).toBe(
        computed("font-size", token("font-size"))
      );
      expect(styleOf().fontWeight).toBe(
        computed("font-weight", token("font-weight"))
      );
      expect(styleOf().lineHeight).toBe(
        computed("line-height", token("line-height"), context)
      );
      expect(styleOf().letterSpacing).toBe(
        computed(
          "letter-spacing",
          `calc(${token("letter-spacing")} * 1em)`,
          context
        )
      );
    }
  );

  it("las variantes se distinguen entre sí (el test no es vacío)", async () => {
    await desktop();
    render(
      <>
        <Text variant="heading-1" data-testid="a" />
        <Text variant="caption" data-testid="b" />
      </>
    );
    expect(getComputedStyle(screen.getByTestId("a")).fontSize).not.toBe(
      getComputedStyle(screen.getByTestId("b")).fontSize
    );
  });

  it("en pantallas pequeñas un titular usa su tamaño compacto", async () => {
    await compact();
    render(<Text variant="heading-1" data-testid="text" />);
    const small = computed(
      "font-size",
      "var(--typography-heading-1-font-size-compact)"
    );
    expect(small).not.toBe(
      computed("font-size", "var(--typography-heading-1-font-size)")
    );
    expect(styleOf().fontSize).toBe(small);
  });

  it("en pantallas pequeñas el texto conserva su tamaño", async () => {
    await compact();
    render(<Text variant="text" data-testid="text" />);
    expect(styleOf().fontSize).toBe(
      computed("font-size", "var(--typography-text-font-size)")
    );
  });

  it.each([
    ["escritorio", desktop],
    ["pantalla pequeña", compact],
  ])("size sobrescribe la variante en %s", async (_name, setViewport) => {
    await setViewport();
    render(<Text variant="heading-1" size="3" data-testid="text" />);
    expect(styleOf().fontSize).toBe(
      computed("font-size", "var(--font-size-3)")
    );
  });

  it("weight sobrescribe el peso de la variante", async () => {
    await desktop();
    render(<Text variant="heading-1" weight="regular" data-testid="text" />);
    expect(styleOf().fontWeight).toBe(
      computed("font-weight", "var(--font-weight-regular)")
    );
    expect(styleOf().fontWeight).not.toBe(
      computed("font-weight", "var(--typography-heading-1-font-weight)")
    );
  });
});
