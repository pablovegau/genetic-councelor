import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { computed } from "../../testing/computed";
import { Link } from "./Link";

const link = () => screen.getByRole("link");

describe("Link", () => {
  it("es un enlace", () => {
    render(<Link href="#cita">Reservar</Link>);
    expect(link()).toHaveAttribute("href", "#cita");
  });

  it("emphasis va en negrita y subrayado", () => {
    render(<Link href="#a">Más</Link>);
    expect(getComputedStyle(link()).fontWeight).toBe("600");
    expect(getComputedStyle(link()).textDecorationLine).toBe("underline");
  });

  it("nav no se subraya hasta el hover", async () => {
    render(
      <Link href="#a" variant="nav">
        Inicio
      </Link>
    );
    expect(getComputedStyle(link()).textDecorationLine).toBe("none");
    await userEvent.hover(link());
    await expect
      .poll(() => getComputedStyle(link()).textDecorationLine)
      .toBe("underline");
  });

  it("muted es gris y pasa al color de texto con el hover", async () => {
    render(
      <Link href="#a" variant="muted">
        Aviso legal
      </Link>
    );
    expect(getComputedStyle(link()).color).toBe(
      computed("color", "var(--color-text-muted)")
    );
    await userEvent.hover(link());
    await expect
      .poll(() => getComputedStyle(link()).color)
      .toBe(computed("color", "var(--color-text-default)"));
  });

  it("title usa el estilo de titular pequeño", () => {
    render(
      <Link href="#a" variant="title">
        Tengo antecedentes
      </Link>
    );
    expect(getComputedStyle(link()).fontSize).toBe(
      computed("font-size", "var(--typography-heading-5-font-size)")
    );
  });
});
