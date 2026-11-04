import { expect, test } from "@playwright/test";
import { catalogPages } from "../src/design-system/catalog/sections";

// Las capturas se generan y se comparan solo en Linux, dentro de la imagen de Playwright
// que también usa la CI: el renderizado cambia con el sistema. En local, `pnpm test:e2e:docker`.
test.skip(
  process.platform !== "linux",
  "VRT solo en Linux: ejecuta pnpm test:e2e:docker"
);

// Una captura por página del catálogo (el contenido, sin el menú): si algo cambia, el fallo señala dónde.
for (const { name, path } of catalogPages) {
  test(`catálogo: ${name}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("[data-catalog-content]")).toHaveScreenshot(
      `${name}.png`
    );
  });
}
