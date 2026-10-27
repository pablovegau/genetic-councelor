import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";

// Solo los roles que cambian con el esquema se repiten en oscuro.
const schemeTokens = ["color.bg.*", "color.text.*", "color.border.*", "color.action.*", "color.focus.*"];

export default defineConfig({
  tokens: ["./src/design-system/tokens/tokens.resolver.json"],
  outDir: "./src/design-system/",
  plugins: [
    css({
      filename: "tokens.generated.css",
      permutations: [
        {
          // Esquema claro por defecto; el navegador elige según su preferencia.
          input: { scheme: "light" },
          prepare: (contents) =>
            `:root {\n  color-scheme: light dark;\n${contents}\n}\n:root[data-scheme="light"] {\n  color-scheme: light;\n}`,
        },
        {
          // Oscuro por preferencia del sistema, salvo que se fuerce claro con data-scheme.
          // Y oscuro forzado con data-scheme="dark".
          input: { scheme: "dark" },
          include: schemeTokens,
          prepare: (contents) =>
            [
              "@media (prefers-color-scheme: dark) {",
              '  :root:not([data-scheme="light"]) {',
              contents,
              "  }",
              "}",
              ':root[data-scheme="dark"] {',
              "  color-scheme: dark;",
              contents,
              "}",
            ].join("\n"),
        },
      ],
    }),
  ],
});
