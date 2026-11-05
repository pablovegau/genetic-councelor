import { expect, test, type Page } from "@playwright/test";

// El icono pasa de sol a luna con transformaciones CSS. Safari y Firefox no aplican a círculos y
// máscaras las propiedades `r`, `cx` y `cy` (la primera versión del icono se quedaba en sol), así que
// esta prueba corre también en WebKit y Firefox. Mide la geometría real, no una captura.
const toggle = (page: Page) => page.locator("[data-scheme-toggle]");

/** Ancho del círculo central respecto al del icono: ~0,4 con el sol y ~0,8 con la luna. */
const disc = (page: Page) =>
  page.locator(".disc").evaluate((circle) => {
    const svg = circle.closest("svg") as SVGSVGElement;
    return (
      circle.getBoundingClientRect().width / svg.getBoundingClientRect().width
    );
  });

const opacityOf = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((element) => Number(getComputedStyle(element).opacity));

test("pasa de sol a luna y vuelve, con rayos y estrellas", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  expect(await disc(page)).toBeLessThan(0.5);
  expect(await opacityOf(page, ".rays line")).toBe(1);
  expect(await opacityOf(page, ".stars circle")).toBe(0);

  await toggle(page).click();
  await expect.poll(() => disc(page), { timeout: 4000 }).toBeGreaterThan(0.7);
  await expect
    .poll(() => opacityOf(page, ".rays line"), { timeout: 4000 })
    .toBe(0);
  await expect
    .poll(() => opacityOf(page, ".stars circle"), { timeout: 4000 })
    .toBe(1);

  await toggle(page).click();
  await expect.poll(() => disc(page), { timeout: 4000 }).toBeLessThan(0.5);
  await expect
    .poll(() => opacityOf(page, ".rays line"), { timeout: 4000 })
    .toBe(1);
  await expect
    .poll(() => opacityOf(page, ".stars circle"), { timeout: 4000 })
    .toBe(0);
});

test("si el sistema ya es oscuro, la luna está desde el primer pintado, sin animar", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  expect(await disc(page)).toBeGreaterThan(0.7);
  expect(await opacityOf(page, ".rays line")).toBe(0);
  expect(await opacityOf(page, ".stars circle")).toBe(1);
});

test("con movimiento reducido el cambio es instantáneo", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/");
  await toggle(page).click();
  await expect.poll(() => disc(page), { timeout: 500 }).toBeGreaterThan(0.7);
  expect(await opacityOf(page, ".stars circle")).toBe(1);
});
