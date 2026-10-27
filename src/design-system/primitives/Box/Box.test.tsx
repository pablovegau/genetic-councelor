import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { computed } from "../../testing/computed";
import { Box } from "./Box";

const styleOf = () => getComputedStyle(screen.getByTestId("box"));

describe("Box", () => {
  it("renderiza un div por defecto", () => {
    render(<Box data-testid="box" />);
    expect(screen.getByTestId("box").tagName).toBe("DIV");
  });

  it("cambia de etiqueta con as", () => {
    render(<Box as="section" data-testid="box" />);
    expect(screen.getByTestId("box").tagName).toBe("SECTION");
  });

  it("pasa los style props como atributos data-*", () => {
    render(<Box data-testid="box" p="4" px="6" bg="surface" />);
    expect(screen.getByTestId("box")).toHaveAttribute("data-p", "4");
    expect(screen.getByTestId("box")).toHaveAttribute("data-px", "6");
    expect(screen.getByTestId("box")).toHaveAttribute("data-bg", "surface");
  });

  it("no pinta atributos para los style props sin valor", () => {
    render(<Box data-testid="box" p={undefined} />);
    expect(screen.getByTestId("box")).not.toHaveAttribute("data-p");
  });

  it("p aplica el padding del token de espaciado en los cuatro lados", () => {
    render(<Box data-testid="box" p="4" />);
    const expected = computed("padding-top", "var(--space-4)");
    expect(expected).not.toBe("0px");
    for (const side of ["Top", "Right", "Bottom", "Left"] as const)
      expect(styleOf()[`padding${side}`]).toBe(expected);
  });

  it("px y py aplican su eje y no el contrario", () => {
    render(<Box data-testid="box" px="6" py="2" />);
    expect(styleOf().paddingLeft).toBe(
      computed("padding-left", "var(--space-6)")
    );
    expect(styleOf().paddingRight).toBe(
      computed("padding-right", "var(--space-6)")
    );
    expect(styleOf().paddingTop).toBe(
      computed("padding-top", "var(--space-2)")
    );
    expect(styleOf().paddingBottom).toBe(
      computed("padding-bottom", "var(--space-2)")
    );
  });

  it("pt, pr, pb y pl aplican cada lado por separado", () => {
    render(<Box data-testid="box" pt="1" pr="2" pb="3" pl="4" />);
    expect(styleOf().paddingTop).toBe(
      computed("padding-top", "var(--space-1)")
    );
    expect(styleOf().paddingRight).toBe(
      computed("padding-right", "var(--space-2)")
    );
    expect(styleOf().paddingBottom).toBe(
      computed("padding-bottom", "var(--space-3)")
    );
    expect(styleOf().paddingLeft).toBe(
      computed("padding-left", "var(--space-4)")
    );
  });

  it("bg usa el rol de fondo semántico", () => {
    render(<Box data-testid="box" bg="surface" />);
    const expected = computed("background-color", "var(--color-bg-surface)");
    expect(expected).not.toBe("rgba(0, 0, 0, 0)");
    expect(styleOf().backgroundColor).toBe(expected);
  });

  it("border dibuja el borde con el rol de color y el ancho del token", () => {
    render(<Box data-testid="box" border="strong" />);
    // Sin border-style el navegador calcula el ancho como 0, así que la sonda lo lleva.
    expect(styleOf().borderTopWidth).toBe(
      computed("border-top-width", "var(--border-width-1)", {
        "border-top-style": "solid",
      })
    );
    expect(styleOf().borderTopStyle).toBe("solid");
    expect(styleOf().borderTopColor).toBe(
      computed("border-top-color", "var(--color-border-strong)", {
        "border-top-style": "solid",
      })
    );
  });

  it("radius usa el radio semántico", () => {
    render(<Box data-testid="box" radius="surface" />);
    const expected = computed(
      "border-top-left-radius",
      "var(--radius-surface)"
    );
    expect(expected).not.toBe("0px");
    expect(styleOf().borderTopLeftRadius).toBe(expected);
  });

  it("suma su clase a la que pasa quien lo usa", () => {
    render(<Box data-testid="box" className="mia" />);
    const { classList } = screen.getByTestId("box");
    expect(classList.contains("mia")).toBe(true);
    expect(classList.length).toBeGreaterThan(1);
  });

  it("deja pasar atributos HTML y de accesibilidad", () => {
    render(<Box data-testid="box" id="caja" aria-label="Contenedor" />);
    expect(screen.getByTestId("box")).toHaveAttribute("id", "caja");
    expect(screen.getByTestId("box")).toHaveAttribute(
      "aria-label",
      "Contenedor"
    );
  });

  it("reenvía la ref al elemento del DOM", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Box data-testid="box" ref={ref} />);
    expect(ref.current).toBe(screen.getByTestId("box"));
  });

  it("renderiza sus hijos", () => {
    render(
      <Box data-testid="box">
        <span>dentro</span>
      </Box>
    );
    expect(screen.getByTestId("box")).toHaveTextContent("dentro");
  });
});
