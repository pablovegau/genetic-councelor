import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { computed } from "../../testing/computed";
import { Flex } from "./Flex";

const styleOf = () => getComputedStyle(screen.getByTestId("flex"));

describe("Flex", () => {
  it("es un contenedor flex y renderiza un div por defecto", () => {
    render(<Flex data-testid="flex" />);
    expect(screen.getByTestId("flex").tagName).toBe("DIV");
    expect(styleOf().display).toBe("flex");
  });

  it("inline lo convierte en inline-flex", () => {
    render(<Flex data-testid="flex" inline />);
    expect(styleOf().display).toBe("inline-flex");
  });

  it("cambia de etiqueta con as", () => {
    render(<Flex data-testid="flex" as="nav" />);
    expect(screen.getByTestId("flex").tagName).toBe("NAV");
  });

  it.each([
    ["row", "row"],
    ["column", "column"],
    ["row-reverse", "row-reverse"],
    ["column-reverse", "column-reverse"],
  ] as const)("direction=%s fija flex-direction %s", (direction, expected) => {
    render(<Flex data-testid="flex" direction={direction} />);
    expect(styleOf().flexDirection).toBe(expected);
  });

  it.each([
    ["start", "flex-start"],
    ["center", "center"],
    ["end", "flex-end"],
    ["stretch", "stretch"],
    ["baseline", "baseline"],
  ] as const)("align=%s fija align-items %s", (align, expected) => {
    render(<Flex data-testid="flex" align={align} />);
    expect(styleOf().alignItems).toBe(expected);
  });

  it.each([
    ["start", "flex-start"],
    ["center", "center"],
    ["end", "flex-end"],
    ["between", "space-between"],
    ["around", "space-around"],
  ] as const)("justify=%s fija justify-content %s", (justify, expected) => {
    render(<Flex data-testid="flex" justify={justify} />);
    expect(styleOf().justifyContent).toBe(expected);
  });

  it("wrap permite que los hijos pasen a otra línea", () => {
    render(<Flex data-testid="flex" wrap />);
    expect(styleOf().flexWrap).toBe("wrap");
  });

  it("gap usa el token de espaciado en ambos ejes", () => {
    render(<Flex data-testid="flex" gap="3" />);
    const expected = computed("gap", "var(--space-3)");
    expect(expected).not.toBe("normal");
    expect(styleOf().columnGap).toBe(expected);
    expect(styleOf().rowGap).toBe(expected);
  });

  it("gapX y gapY separan cada eje por su cuenta", () => {
    render(<Flex data-testid="flex" gapX="2" gapY="6" />);
    expect(styleOf().columnGap).toBe(computed("column-gap", "var(--space-2)"));
    expect(styleOf().rowGap).toBe(computed("row-gap", "var(--space-6)"));
  });

  it("coloca los hijos en fila por defecto y en columna con direction=column", () => {
    const children = [
      <div key="a" data-testid="a" style={{ width: 10, height: 10 }} />,
      <div key="b" data-testid="b" style={{ width: 10, height: 10 }} />,
    ];
    const { unmount } = render(<Flex>{children}</Flex>);
    expect(
      screen.getByTestId("b").getBoundingClientRect().left
    ).toBeGreaterThan(screen.getByTestId("a").getBoundingClientRect().left);
    unmount();
    render(<Flex direction="column">{children}</Flex>);
    expect(screen.getByTestId("b").getBoundingClientRect().top).toBeGreaterThan(
      screen.getByTestId("a").getBoundingClientRect().top
    );
  });

  it("también acepta los style props de Box, porque es un Box", () => {
    render(<Flex data-testid="flex" p="4" bg="surface" />);
    expect(styleOf().paddingTop).toBe(
      computed("padding-top", "var(--space-4)")
    );
    expect(styleOf().backgroundColor).toBe(
      computed("background-color", "var(--color-bg-surface)")
    );
  });

  it("suma su clase a la que pasa quien lo usa", () => {
    render(<Flex data-testid="flex" className="mia" />);
    expect(screen.getByTestId("flex").classList.contains("mia")).toBe(true);
  });
});
