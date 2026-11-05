import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Wordmark } from "./Wordmark";

describe("Wordmark", () => {
  it("es un enlace por defecto", () => {
    render(<Wordmark href="/">Sara Torres-Esquius</Wordmark>);
    expect(
      screen.getByRole("link", { name: "Sara Torres-Esquius" })
    ).toHaveAttribute("href", "/");
  });

  it("como strong es solo texto", () => {
    render(<Wordmark as="strong">Sara Torres-Esquius</Wordmark>);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Sara Torres-Esquius").tagName).toBe("STRONG");
  });

  it("usa la tipografía de titulares y no se subraya", () => {
    render(<Wordmark href="/">Sara</Wordmark>);
    const style = getComputedStyle(screen.getByRole("link"));
    expect(style.fontWeight).toBe("600");
    expect(style.textDecorationLine).toBe("none");
  });
});
