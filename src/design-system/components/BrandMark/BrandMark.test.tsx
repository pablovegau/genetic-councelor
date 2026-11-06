import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandMark } from "./BrandMark";

describe("BrandMark", () => {
  it("sin título es decorativo: no aparece como imagen", () => {
    const { container } = render(<BrandMark />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("con título es una imagen con nombre accesible", () => {
    render(<BrandMark title="Sara Torres-Esquius" />);
    expect(
      screen.getByRole("img", { name: "Sara Torres-Esquius" })
    ).toBeInTheDocument();
  });

  it("dibuja una persona (círculo) y una flecha", () => {
    const { container } = render(<BrandMark />);
    expect(container.querySelectorAll("circle")).toHaveLength(1);
    expect(container.querySelectorAll("path")).toHaveLength(1);
  });
});
