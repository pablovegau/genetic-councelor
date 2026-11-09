import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon, iconNames } from "./Icon";

describe("Icon", () => {
  it("sin título es decorativo: no aparece como imagen", () => {
    const { container } = render(<Icon name="mail" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("con título es una imagen con nombre accesible", () => {
    render(<Icon name="linkedin" title="LinkedIn" />);
    expect(screen.getByRole("img", { name: "LinkedIn" })).toBeInTheDocument();
  });

  it("el logo de LinkedIn es una silueta y el correo es de línea", () => {
    const { container: logo } = render(<Icon name="linkedin" />);
    expect(logo.querySelector("svg")).toHaveAttribute("fill", "currentColor");
    const { container: mail } = render(<Icon name="mail" />);
    expect(mail.querySelector("svg")).toHaveAttribute("stroke", "currentColor");
    expect(mail.querySelector("svg")).toHaveAttribute("fill", "none");
  });

  it("cada nombre dibuja al menos un trazo", () => {
    for (const name of iconNames) {
      const { container } = render(<Icon name={name} />);
      expect(container.querySelectorAll("path").length).toBeGreaterThan(0);
    }
  });
});
