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

  it("sin contenido cierra la etiqueta sobre sí misma", () => {
    expect(jsxSnippet("Icon", { name: "check" }, "")).toBe(
      '<Icon name="check" />'
    );
  });

  it("escribe los números como expresión y los booleanos como atributo suelto", () => {
    expect(
      jsxSnippet("Grid", { columns: "3", wrap: "true", gap: "4" }, "…", {
        columns: "number",
        wrap: "boolean",
      })
    ).toBe('<Grid columns={3} wrap gap="4">…</Grid>');
  });

  it("un booleano distinto de true no se escribe", () => {
    expect(
      jsxSnippet("Flex", { wrap: "false" }, "…", { wrap: "boolean" })
    ).toBe("<Flex>…</Flex>");
  });
});
