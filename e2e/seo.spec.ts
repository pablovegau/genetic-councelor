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

for (const path of paths) {
  test(`${path} tiene Open Graph y Twitter Card con la imagen de 1200×630`, async ({
    page,
    request,
  }) => {
    await page.goto(path);
    const meta = (selector: string) =>
      page.locator(selector).getAttribute("content");
    const title = await page.title();
    expect(await meta('meta[property="og:title"]')).toBe(title);
    expect(await meta('meta[name="twitter:title"]')).toBe(title);
    expect(await meta('meta[property="og:url"]')).toBe(`${origin}${path}`);
    expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
    expect(await meta('meta[property="og:image:width"]')).toBe("1200");
    expect(await meta('meta[property="og:image:height"]')).toBe("630");
    const locale = path.startsWith("/ca/")
      ? "ca_ES"
      : path.startsWith("/en/")
        ? "en_GB"
        : "es_ES";
    expect(await meta('meta[property="og:locale"]')).toBe(locale);
    const description = await meta('meta[name="description"]');
    expect(await meta('meta[property="og:description"]')).toBe(description);
    const image = (await meta('meta[property="og:image"]'))!;
    expect(image.startsWith(origin)).toBe(true);
    expect((await request.get(local(image))).status()).toBe(200);
  });
}

const structured = [
  { path: "/", job: "Asesora genética", first: "Primera visita" },
  { path: "/ca/", job: "Assessora genètica", first: "Primera visita" },
  { path: "/en/", job: "Genetic counsellor", first: "First visit" },
];
for (const { path, job, first } of structured) {
  test(`${path} declara a Sara (Person) y el servicio con el precio de las dos visitas`, async ({
    page,
  }) => {
    await page.goto(path);
    const raw = await page
      .locator('script[type="application/ld+json"]')
      .innerText();
    const graph = JSON.parse(raw)["@graph"];
    const person = graph.find(
      (n: { "@type": string }) => n["@type"] === "Person"
    );
    expect(person).toMatchObject({
      name: "Sara Torres-Esquius",
      jobTitle: job,
      address: { addressLocality: "Barcelona" },
      sameAs: ["https://www.linkedin.com/in/saratorresesquius/"],
    });
    const service = graph.find(
      (n: { "@type": string }) => n["@type"] === "ProfessionalService"
    );
    expect(service.contactPoint.availableLanguage).toEqual(["es", "ca", "en"]);
    const offers = service.hasOfferCatalog.itemListElement;
    expect(offers.map((o: { price: number }) => o.price)).toEqual([120, 90]);
    expect(offers[0].itemOffered.name).toBe(first);
    for (const offer of offers) {
      expect(offer.priceSpecification.valueAddedTaxIncluded).toBe(true);
      expect(offer.priceCurrency).toBe("EUR");
    }
    // Sin teléfono en ningún sitio.
    expect(raw).not.toMatch(/telephone/i);
  });
}

test("las fotos de la portada se sirven en varios tamaños y la pequeña pesa poco", async ({
  page,
  request,
}) => {
  await page.goto("/");
  for (const img of await page.locator("main img[srcset]").all()) {
    const srcset = (await img.getAttribute("srcset"))!;
    const candidates = srcset
      .split(",")
      .map((entry) => entry.trim().split(/\s+/));
    expect(candidates.length).toBeGreaterThanOrEqual(3);
    const [smallest] = candidates;
    const response = await request.get(smallest![0]!);
    expect(response.status()).toBe(200);
    expect((await response.body()).length).toBeLessThan(30_000);
    await expect(img).toHaveAttribute("sizes", /\S/);
  }
  // Ninguna foto se pide en su tamaño original de 2400 px.
  const widths = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .filter((entry) => /\.(webp|jpe?g)$/.test(entry.name))
      .map((entry) => (entry as PerformanceResourceTiming).encodedBodySize)
  );
  for (const bytes of widths) expect(bytes).toBeLessThan(50_000);
});

test("el CSS va en el propio HTML: sin hojas de estilo que bloqueen el primer pintado", async ({
  request,
}) => {
  const html = await (await request.get("/")).text();
  expect(html).not.toMatch(/<link[^>]+rel="stylesheet"/);
  expect(html).toMatch(/<style[^>]*>[^<]{5000,}/);
});

test("el icono de hamburguesa se anima con transform, no con top", async ({
  page,
}) => {
  await page.goto("/");
  test.skip((page.viewportSize()?.width ?? 0) >= 768, "Solo en móvil.");
  const trigger = page.getByRole("button", { name: /Abrir/ });
  const props = await trigger.locator("span").evaluate((bar) => {
    const style = getComputedStyle(bar, "::before");
    return { transition: style.transitionProperty, top: style.top };
  });
  expect(props.transition).toContain("transform");
  expect(props.transition).not.toContain("top");
  expect(props.top).toBe("0px");
});
