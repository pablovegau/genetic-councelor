import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Byline } from "./Byline";

const avatar = { src: "/foto.webp", width: 100, height: 100 };

describe("Byline", () => {
  it("muestra el nombre y el cargo", () => {
    render(
      <Byline avatar={avatar} name="Sara" description="Asesora genética" />
    );
    expect(screen.getByText("Sara")).toBeVisible();
    expect(screen.getByText("Asesora genética")).toBeVisible();
  });

  it("la foto es decorativa: el nombre ya va al lado", () => {
    const { container } = render(
      <Byline avatar={avatar} name="Sara" description="Asesora" />
    );
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("src", "/foto.webp");
  });

  it("la foto es redonda", () => {
    const { container } = render(
      <Byline avatar={avatar} name="Sara" description="Asesora" />
    );
    const frame = container.querySelector("img")!.parentElement!;
    expect(getComputedStyle(frame).borderRadius).toBe("50%");
    expect(getComputedStyle(frame).overflow).toBe("hidden");
  });
});
