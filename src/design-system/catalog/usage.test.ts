import { describe, expect, it } from "vitest";
import { jsxSnippet } from "./usage";

describe("ejemplo de uso en JSX", () => {
  it("sin props escribe solo la etiqueta con su contenido", () => {
    expect(jsxSnippet("Text", {}, "Hola")).toBe("<Text>Hola</Text>");
  });

  it("escribe cada prop entre comillas y respeta el orden", () => {
    expect(jsxSnippet("Text", { variant: "heading-2", as: "h3" }, "Hola")).toBe(
      '<Text variant="heading-2" as="h3">Hola</Text>'
    );
  });

  it("omite las props sin valor o vacías", () => {
    expect(
      jsxSnippet(
        "Text",
        { variant: undefined, size: "", color: "muted" },
        "Hola"
      )
    ).toBe('<Text color="muted">Hola</Text>');
  });
});
