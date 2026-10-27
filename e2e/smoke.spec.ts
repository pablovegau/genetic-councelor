import { expect, test } from "@playwright/test";

const versions = [
  { path: "/", lang: "es" },
  { path: "/ca/", lang: "ca" },
  { path: "/en/", lang: "en" },
];

for (const { path, lang } of versions) {
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
    expect(await page.title()).not.toBe("");
  });
}

test("el selector de idioma navega entre las tres versiones", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Català" }).click();
  await expect(page).toHaveURL(/\/ca\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ca");

  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.getByRole("link", { name: "Español" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("la versión actual del selector de idioma se marca como actual", async ({
  page,
}) => {
  await page.goto("/ca/");
  await expect(page.getByRole("link", { name: "Català" })).toHaveAttribute(
    "aria-current",
    "true"
  );
  await expect(page.getByRole("link", { name: "English" })).not.toHaveAttribute(
    "aria-current"
  );
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
