import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// La imagen de Playwright y @playwright/test deben ser la misma versión: si no, el navegador
// de la imagen no coincide con el que espera la librería y el VRT falla de forma confusa.
const read = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const { devDependencies } = JSON.parse(read("package.json")) as {
  devDependencies: Record<string, string>;
};
const installed = devDependencies["@playwright/test"];

const imageVersions = (file: string) =>
  [
    ...read(file).matchAll(
      /mcr\.microsoft\.com\/playwright:v(\d+\.\d+\.\d+)-/g
    ),
  ].map((match) => match[1]);

describe("versión de Playwright", () => {
  it("@playwright/test está fijado a una versión exacta", () => {
    expect(installed).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("playwright usa la misma versión exacta que @playwright/test", () => {
    expect(devDependencies["playwright"]).toBe(installed);
  });

  it.each([
    ".github/workflows/ci.yml",
    ".github/workflows/update-vrt.yml",
    "scripts/e2e-docker.sh",
  ])("%s usa la imagen de Playwright de esa misma versión", (file) => {
    const versions = imageVersions(file);
    expect(versions.length).toBeGreaterThan(0);
    expect(new Set(versions)).toEqual(new Set([installed]));
  });
});
