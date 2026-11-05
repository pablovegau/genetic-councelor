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

// La home en cada idioma, entera. Antes de capturar se cargan las imágenes diferidas y las fuentes;
// las animaciones (el árbol se dibuja al cargar) las lleva Playwright a su estado final.
const homes = [
  { name: "home-es", path: "/" },
  { name: "home-ca", path: "/ca/" },
  { name: "home-en", path: "/en/" },
];

for (const { name, path } of homes) {
  test(`home: ${name}`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(async () => {
      const images = [...document.images];
      for (const image of images) image.loading = "eager";
      await Promise.all(images.map((image) => image.decode()));
      await document.fonts.ready;
    });
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
