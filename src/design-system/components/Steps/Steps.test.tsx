import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Steps, type StepItem } from "./Steps";

const item = (n: number): StepItem => ({
  when: `Momento ${n}`,
  title: `Paso ${n}`,
  text: `Texto ${n}`,
  detailLabel: "Duración",
  detail: `${n} minutos`,
  icon: { paths: ["M0 0h1"], accent: ["M1 1h1"] },
});

describe("Steps", () => {
  it("es una lista ordenada con un título por paso", () => {
    render(<Steps items={[item(1), item(2), item(3)]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "Paso 2" })).toBeVisible();
  });

  it("numera los pasos desde 1", () => {
    render(<Steps items={[item(1), item(2)]} />);
    const [first, second] = screen.getAllByRole("listitem");
    expect(within(first!).getByText("1")).toBeVisible();
    expect(within(second!).getByText("2")).toBeVisible();
  });

  it("cada paso muestra su dato destacado como término y definición", () => {
    render(<Steps items={[item(1)]} />);
    expect(screen.getByText("Duración").tagName).toBe("DT");
    expect(screen.getByText("1 minutos").tagName).toBe("DD");
  });

  it("el icono es decorativo y el trazo de acento tiene su propia clase", () => {
    const { container } = render(<Steps items={[item(1)]} />);
    const svg = container.querySelector("svg")!;
    expect(svg.parentElement).toHaveAttribute("aria-hidden", "true");
    const [normal, accent] = [...svg.querySelectorAll("path")];
    expect(normal!.getAttribute("class")).toBeNull();
    expect(accent!.getAttribute("class")).not.toBeNull();
  });
});
