import { expect, test } from "@playwright/test";

// Las capturas se generan y se comparan solo en Linux, dentro de la imagen de Playwright
// que también usa la CI: el renderizado cambia con el sistema. En local, `pnpm test:e2e:docker`.
test.skip(
  process.platform !== "linux",
  "VRT solo en Linux: ejecuta pnpm test:e2e:docker"
);

// Una captura por sección del catálogo: si algo cambia, el fallo señala dónde.
const sections = [
  "tokens-color",
  "tokens-space",
  "tokens-radius",
  "tokens-type",
  "prim-box",
  "prim-flex",
  "prim-grid",
  "prim-text",
  "prim-icon",
];

for (const id of sections) {
  test(`catálogo: ${id}`, async ({ page }) => {
    await page.goto("/design-system/");
    await expect(
      page.locator(`section[aria-labelledby="${id}"]`)
    ).toHaveScreenshot(`${id}.png`);
  });
}
