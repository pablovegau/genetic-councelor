import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Split } from "./Split";

describe("Split", () => {
  it("es una rejilla con sus dos bloques", () => {
    render(
      <Split data-testid="split">
        <p>Uno</p>
        <p>Dos</p>
      </Split>
    );
    expect(getComputedStyle(screen.getByTestId("split")).display).toBe("grid");
    expect(screen.getByText("Uno")).toBeVisible();
    expect(screen.getByText("Dos")).toBeVisible();
  });

  it("la proporción llega al CSS como la primera columna en fr", () => {
    render(<Split data-testid="split" ratio={1.25} />);
    expect(
      screen.getByTestId("split").style.getPropertyValue("--split-ratio")
    ).toBe("1.25fr");
  });
});
