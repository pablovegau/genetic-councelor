import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Portrait } from "./Portrait";

describe("Portrait", () => {
  it("la imagen lleva su texto alternativo", () => {
    render(
      <Portrait src="/s.webp" width={800} height={600} alt="Sara sonriendo" />
    );
    expect(screen.getByRole("img", { name: "Sara sonriendo" })).toHaveAttribute(
      "src",
      "/s.webp"
    );
  });

  it("recorta la foto en un marco redondeado", () => {
    render(
      <Portrait
        data-testid="frame"
        src="/s.webp"
        width={800}
        height={600}
        alt="Sara"
      />
    );
    const style = getComputedStyle(screen.getByTestId("frame"));
    expect(style.overflow).toBe("hidden");
    expect(parseFloat(style.borderTopLeftRadius)).toBeGreaterThan(0);
  });
});
