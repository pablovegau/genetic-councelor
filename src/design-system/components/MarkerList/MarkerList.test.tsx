import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { computed } from "../../testing/computed";
import { MarkerList } from "./MarkerList";

const items = [
  {
    title: "Tengo antecedentes",
    text: "Cáncer.",
    href: "#a",
    marker: "circle",
    tone: "danger",
  },
  {
    title: "Estudio genético",
    text: "Qué sirve.",
    href: "#b",
    marker: "square",
    tone: "accent",
  },
] as const;

describe("MarkerList", () => {
  it("es una lista con un enlace por entrada", () => {
    render(<MarkerList items={[...items]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: "Tengo antecedentes" })
    ).toHaveAttribute("href", "#a");
    expect(screen.getByText("Qué sirve.")).toBeVisible();
  });

  it("cada entrada lleva su símbolo, decorativo, en el color de su rol", () => {
    const { container } = render(<MarkerList items={[...items]} />);
    const [first, second] = [...container.querySelectorAll("svg")];
    expect(first!.querySelector("circle")).not.toBeNull();
    expect(second!.querySelector("rect")).not.toBeNull();
    expect(first).toHaveAttribute("aria-hidden", "true");
    expect(getComputedStyle(first!).fill).toBe(
      computed("fill", "var(--color-danger-bg)")
    );
    expect(getComputedStyle(second!).fill).toBe(
      computed("fill", "var(--color-accent-bg)")
    );
  });
});
