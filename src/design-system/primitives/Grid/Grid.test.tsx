import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { computed } from "../../testing/computed";
import { Grid } from "./Grid";

const styleOf = () => getComputedStyle(screen.getByTestId("grid"));
const tracks = () => styleOf().gridTemplateColumns.split(" ").length;
const inWidth = (width: number, children: ReactNode) => (
  <div style={{ width }}>{children}</div>
);

describe("Grid", () => {
  it("es una rejilla y renderiza un div por defecto", () => {
    render(<Grid data-testid="grid" />);
    expect(screen.getByTestId("grid").tagName).toBe("DIV");
    expect(styleOf().display).toBe("grid");
  });

  it.each([1, 2, 3, 4, 5, 6, 12] as const)(
    "columns=%i reparte el ancho en ese número de columnas",
    (columns) => {
      render(inWidth(600, <Grid data-testid="grid" columns={columns} />));
      expect(tracks()).toBe(columns);
    }
  );

  it("gap usa el token de espaciado", () => {
    render(<Grid data-testid="grid" gap="4" />);
    expect(styleOf().columnGap).toBe(computed("column-gap", "var(--space-4)"));
    expect(styleOf().rowGap).toBe(computed("row-gap", "var(--space-4)"));
  });

  it("minColumn cabe tantas columnas como permita el ancho mínimo", () => {
    // space.24 son 96 px: caben 3 en 300 px y 2 en 200 px.
    render(inWidth(300, <Grid data-testid="grid" minColumn="24" />));
    expect(tracks()).toBe(3);
  });

  it("minColumn pasa a menos columnas cuando el contenedor se estrecha", () => {
    render(inWidth(200, <Grid data-testid="grid" minColumn="24" />));
    expect(tracks()).toBe(2);
  });

  it("minColumn nunca desborda un contenedor más estrecho que el mínimo", () => {
    render(inWidth(60, <Grid data-testid="grid" minColumn="24" />));
    expect(tracks()).toBe(1);
    expect(screen.getByTestId("grid").scrollWidth).toBeLessThanOrEqual(60);
  });

  it("los style props mandan sobre el CSS por defecto del componente", () => {
    // columns=2 vive en la capa components; minColumn, en props, y debe ganar.
    render(
      inWidth(400, <Grid data-testid="grid" columns={2} minColumn="24" />)
    );
    expect(tracks()).toBe(4);
  });

  it.each([
    ["start", "start"],
    ["center", "center"],
    ["end", "end"],
    ["stretch", "stretch"],
  ] as const)("align=%s fija align-items %s", (align, expected) => {
    render(<Grid data-testid="grid" align={align} />);
    expect(styleOf().alignItems).toBe(expected);
  });

  it("también acepta los style props de Box, porque es un Box", () => {
    render(<Grid data-testid="grid" p="2" radius="control" />);
    expect(styleOf().paddingTop).toBe(
      computed("padding-top", "var(--space-2)")
    );
    expect(styleOf().borderTopLeftRadius).toBe(
      computed("border-top-left-radius", "var(--radius-control)")
    );
  });
});
