import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { computed } from "../../testing/computed";
import { Button } from "./Button";

const styleOf = () => getComputedStyle(screen.getByTestId("button"));

describe("Button", () => {
  it("es un botón que no envía formularios por defecto", () => {
    render(<Button data-testid="button">Reservar cita</Button>);
    const button = screen.getByRole("button", { name: "Reservar cita" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
  });

  it("con href es un enlace", () => {
    render(
      <Button href="#cita" data-testid="button">
        Reservar cita
      </Button>
    );
    const link = screen.getByRole("link", { name: "Reservar cita" });
    expect(link).toHaveAttribute("href", "#cita");
  });

  it("en reposo usa los colores de acción", () => {
    render(<Button data-testid="button">Reservar cita</Button>);
    expect(styleOf().backgroundColor).toBe(
      computed("background-color", "var(--color-action-bg)")
    );
    expect(styleOf().color).toBe(computed("color", "var(--color-action-fg)"));
  });

  it("al pasar el ratón solo cambia de color: no se mueve ni lleva sombra", async () => {
    render(<Button data-testid="button">Reservar cita</Button>);
    const rest = computed("background-color", "var(--color-action-bg)");
    const hover = computed("background-color", "var(--color-action-bg-hover)");
    expect(hover).not.toBe(rest);

    await userEvent.hover(screen.getByTestId("button"));
    await expect.poll(() => styleOf().backgroundColor).toBe(hover);
    expect(styleOf().transform).toBe("none");
    expect(styleOf().boxShadow).toBe("none");
  });

  it("el tamaño sm tiene menos relleno que md", () => {
    render(
      <>
        <Button data-testid="button">md</Button>
        <Button data-testid="small" size="sm">
          sm
        </Button>
      </>
    );
    expect(styleOf().paddingTop).toBe(
      computed("padding-top", "var(--space-4)")
    );
    expect(getComputedStyle(screen.getByTestId("small")).paddingTop).toBe(
      computed("padding-top", "var(--space-2)")
    );
  });

  it("deshabilitado no responde al clic", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Reservar cita
      </Button>
    );
    await userEvent.click(screen.getByRole("button"), { force: true });
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
