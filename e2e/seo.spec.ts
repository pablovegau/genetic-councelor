import { expect, test } from "@playwright/test";
import { sitePages } from "./pages";

const origin = "https://www.saratorresesquius.com";
const homes = ["/", "/ca/", "/en/"];
const paths = [...homes, ...sitePages.map(({ path }) => path)];
const local = (url: string) => new URL(url).pathname;

test("el sitemap lista todas las páginas del sitio en los tres idiomas y no el catálogo", async ({
  request,
}) => {
  const index = await (await request.get("/sitemap-index.xml")).text();
  expect(index).toContain(`${origin}/sitemap-0.xml`);
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  for (const path of paths) {
    expect(sitemap).toContain(`<loc>${origin}${path}</loc>`);
  }
  expect(sitemap).not.toContain("design-system");
});

test("robots.txt apunta al sitemap", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(`Sitemap: ${origin}/sitemap-index.xml`);
});

for (const path of paths) {
  test(`${path} tiene canonical y las versiones por idioma, y todas existen`, async ({
    page,
    request,
  }) => {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${origin}${path}`
    );
    const alternates = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((links) =>
        links.map((link) => [
          link.getAttribute("hreflang"),
          link.getAttribute("href"),
        ])
      );
    expect(alternates.map(([lang]) => lang)).toEqual([
      "es",
      "ca",
      "en",
      "x-default",
    ]);
    // Cada versión apunta a una página que existe (sin enlaces rotos entre idiomas).
    for (const [, href] of alternates) {
      expect((await request.get(local(href!))).status()).toBe(200);
    }
  });
}

test("el catálogo del design system no declara versiones por idioma", async ({
  page,
}) => {
  await page.goto("/design-system/components/button/");
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
