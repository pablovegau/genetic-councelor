import { expect, test } from "@playwright/test";

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
  await page.getByRole("link", { name: "CA", exact: true }).click();
  await expect(page).toHaveURL(/\/ca\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ca");

  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.getByRole("link", { name: "ES", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("la versión actual del selector de idioma se marca como actual", async ({
  page,
}) => {
  await page.goto("/ca/");
  await expect(
    page.getByRole("link", { name: "CA", exact: true })
  ).toHaveAttribute("aria-current", "true");
  await expect(
    page.getByRole("link", { name: "EN", exact: true })
  ).not.toHaveAttribute("aria-current");
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
    .getByRole("button", { name: "Woman", exact: true })
    .first()
    .focus();
  await expect(page.locator(".tree-caption")).toHaveText("Circle: a woman.");
});

for (const { path } of versions) {
  test(`${path} no envía JavaScript de React: la home no tiene islas`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.locator("astro-island")).toHaveCount(0);
  });
}
