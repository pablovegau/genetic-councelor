import { expect, test, type Page } from "@playwright/test";

/** Los idiomas viven en la barra en escritorio y dentro del menú en móvil. */
async function langLink(page: Page, code: string) {
  const width = page.viewportSize()?.width ?? 0;
  if (width < 768 && !(await page.getByRole("dialog").isVisible()))
    await page
      .getByRole("button", { name: /Abrir el menú|Obre el menú|Open the menu/ })
      .click();
  return page.getByRole("link", { name: code, exact: true });
}

const versions = [
  { path: "/", lang: "es", h1: /árbol familiar/ },
  { path: "/ca/", lang: "ca", h1: /arbre familiar/ },
  { path: "/en/", lang: "en", h1: /family tree/ },
];

for (const { path, lang, h1 } of versions) {
  test(`${path} responde, declara su idioma y todavía no se indexa`, async ({
    page,
  }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow"
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(h1);
    expect(await page.title()).not.toBe("");
  });
}

test("el selector de idioma navega entre las tres versiones", async ({
  page,
}) => {
  await page.goto("/");
  await (await langLink(page, "CA")).click();
  await expect(page).toHaveURL(/\/ca\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ca");

  await (await langLink(page, "EN")).click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await (await langLink(page, "ES")).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("la versión actual del selector de idioma se marca como actual", async ({
  page,
}) => {
  await page.goto("/ca/");
  await expect(await langLink(page, "CA")).toHaveAttribute(
    "aria-current",
    "true"
  );
  await expect(await langLink(page, "EN")).not.toHaveAttribute("aria-current");
});

test("la página interna del catálogo nunca se indexa", async ({ page }) => {
  await page.goto("/design-system/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow"
  );
});

test("un idioma que no existe da 404", async ({ page }) => {
  const response = await page.goto("/fr/");
  expect(response?.status()).toBe(404);
});

test("el interruptor de esquema cambia el tema y se recuerda al recargar", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: "Cambiar a modo oscuro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-scheme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-scheme", "dark");
  await expect(
    page.getByRole("button", { name: "Cambiar a modo claro" })
  ).toBeVisible();
});

test("el árbol explica cada símbolo al enfocarlo", async ({ page }) => {
  await page.goto("/en/");
  await page
    .getByRole("button", {
      name: "Unaffected woman, generation II",
      exact: true,
    })
    .first()
    .focus();
  await expect(page.locator(".tree-caption")).toHaveText(
    "Generation II. Empty circle: an unaffected woman."
  );
});

// Una sola isla en la home: el menú móvil, y diferida (ADR 0003).
for (const { path } of versions) {
  test(`${path} solo hidrata el menú móvil, y cuando el navegador está libre`, async ({
    page,
  }) => {
    await page.goto(path);
    const islands = page.locator("astro-island");
    await expect(islands).toHaveCount(1);
    await expect(islands).toHaveAttribute("client", "idle");
    await expect(islands).toHaveAttribute("component-export", "MobileMenu");
  });
}

test("la línea de los pasos atraviesa el centro de los números", async ({
  page,
}) => {
  await page.goto("/");
  const steps = page.locator("ol[class*='steps']");
  const marker = steps.locator("[class*='marker']").first();
  await marker.scrollIntoViewIfNeeded();
  const lineCenter = await steps.evaluate((el) => {
    const style = getComputedStyle(el, "::before");
    return parseFloat(style.top) + parseFloat(style.marginTop) + 1;
  });
  const [box, stepsBox] = await Promise.all([
    marker.boundingBox(),
    steps.boundingBox(),
  ]);
  const markerCenter = box!.y + box!.height / 2 - stepsBox!.y;
  expect(Math.abs(markerCenter - lineCenter)).toBeLessThan(1);
});
