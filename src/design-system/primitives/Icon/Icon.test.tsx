import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { computed } from "../../testing/computed";
import { Text } from "../Text/Text";
import { Icon } from "./Icon";

const icon = () => screen.getByTestId("icon");

describe("Icon", () => {
  it("es decorativo por defecto: oculto a los lectores de pantalla", () => {
    render(<Icon name="check" data-testid="icon" />);
    expect(icon()).toHaveAttribute("aria-hidden", "true");
    expect(icon()).not.toHaveAttribute("role");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("con label es informativo y tiene nombre accesible", () => {
    render(<Icon name="close" label="Cerrar" data-testid="icon" />);
    expect(screen.getByRole("img", { name: "Cerrar" })).toBe(icon());
    expect(icon()).not.toHaveAttribute("aria-hidden");
  });

  it("no recibe el foco del teclado", () => {
    render(<Icon name="check" data-testid="icon" />);
    expect(icon()).toHaveAttribute("focusable", "false");
  });

  it("mide por defecto el paso 5 de la escala de espaciado", () => {
    render(<Icon name="check" data-testid="icon" />);
    expect(getComputedStyle(icon()).width).toBe(
      computed("width", "var(--space-5)")
    );
    expect(getComputedStyle(icon()).height).toBe(
      computed("height", "var(--space-5)")
    );
  });

  it("iconSize elige otro paso de la escala", () => {
    render(<Icon name="check" iconSize="8" data-testid="icon" />);
    expect(getComputedStyle(icon()).width).toBe(
      computed("width", "var(--space-8)")
    );
    expect(getComputedStyle(icon()).width).not.toBe(
      computed("width", "var(--space-5)")
    );
  });

  it.each([
    ["close", 2],
    ["menu", 3],
    ["arrow-right", 2],
    ["check", 1],
  ] as const)("el icono %s dibuja %i trazos", (name, strokes) => {
    render(<Icon name={name} data-testid="icon" />);
    expect(icon().querySelectorAll("path")).toHaveLength(strokes);
  });

  it("dibuja con el color del texto que lo rodea", () => {
    render(
      <Text as="span" color="muted" data-testid="parent">
        <Icon name="check" data-testid="icon" />
      </Text>
    );
    expect(getComputedStyle(icon()).stroke).toBe(
      getComputedStyle(screen.getByTestId("parent")).color
    );
  });

  it("color usa el rol de color de texto", () => {
    render(<Icon name="check" color="muted" data-testid="icon" />);
    expect(getComputedStyle(icon()).color).toBe(
      computed("color", "var(--color-text-muted)")
    );
  });

  it("suma su clase a la que pasa quien lo usa y deja pasar atributos", () => {
    render(<Icon name="check" className="mia" data-testid="icon" id="uno" />);
    expect(icon().classList.contains("mia")).toBe(true);
    expect(icon()).toHaveAttribute("id", "uno");
  });
});
