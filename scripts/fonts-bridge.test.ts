import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Astro registra las fuentes con un nombre único y las expone en una variable CSS. Un puente en
// Base.astro conecta esa variable con el token de familia: si se desincronizan, la web caería a la
// fuente del sistema sin ningún error.
const read = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const config = read("astro.config.mjs");
const base = read("src/layouts/Base.astro");

const bridges = [
  { token: "--font-family-display", variable: "--font-funnel-display" },
  { token: "--font-family-sans", variable: "--font-funnel-sans" },
];

describe("fuentes servidas con la API de Astro", () => {
  it.each(bridges)(
    "$variable está registrada en la configuración de Astro",
    ({ variable }) => {
      expect(config).toContain(`cssVariable: "${variable}"`);
    }
  );

  it.each(bridges)(
    "Base.astro enlaza $token con $variable",
    ({ token, variable }) => {
      expect(base).toContain(`${token}: var(${variable});`);
    }
  );

  it.each(bridges)(
    "Base.astro carga $variable con el componente Font",
    ({ variable }) => {
      expect(base).toContain(`<Font cssVariable="${variable}"`);
    }
  );
});
