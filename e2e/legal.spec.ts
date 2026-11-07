import { expect, test } from "@playwright/test";
import { catalogPages } from "../src/design-system/catalog/sections";
import { sitePages } from "./pages";

const locales = [
  {
    prefix: "",
    lang: "es",
    links: [
      "Aviso legal",
      "Política de privacidad",
      "Política de cookies",
      "Condiciones de reserva",
    ],
  },
  {
    prefix: "/ca",
    lang: "ca",
    links: [
      "Avís legal",
      "Política de privacitat",
      "Política de cookies",
      "Condicions de reserva",
    ],
  },
  {
    prefix: "/en",
    lang: "en",
    links: ["Legal notice", "Privacy policy", "Cookie policy", "Booking terms"],
  },
];
const slugs = [
  "aviso-legal",
  "politica-de-privacidad",
  "politica-de-cookies",
  "condiciones-de-reserva",
];

for (const { prefix, links } of locales) {
  test(`${prefix || "/"} enlaza las cuatro páginas legales desde el pie`, async ({
    page,
  }) => {
    await page.goto(`${prefix}/`);
    const footer = page.getByRole("contentinfo");
    for (const [i, name] of links.entries()) {
      await expect(footer.getByRole("link", { name })).toHaveAttribute(
        "href",
        `${prefix}/${slugs[i]}/`
      );
    }
  });
}

test("el aviso legal da los datos del titular y marca los que faltan", async ({
  page,
}) => {
  await page.goto("/aviso-legal/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Aviso legal"
  );
  await expect(
    page.getByText("Sara Torres-Esquius, persona física")
  ).toBeVisible();
  await expect(
    page
      .getByRole("main")
      .getByRole("link", { name: "contact@saratorresesquius.com" })
      .first()
  ).toHaveAttribute("href", "mailto:contact@saratorresesquius.com");
  // Sin PUBLIC_LEGAL_NIF ni PUBLIC_LEGAL_ADDRESS (CI) se ven como pendientes, no vacíos.
  await expect(page.getByText("Pendiente de completar")).toHaveCount(2);
});

test("en catalán y en inglés el texto legal se avisa de que es en castellano", async ({
  page,
}) => {
  await page.goto("/ca/aviso-legal/");
  await expect(
    page.getByText("només està disponible en castellà")
  ).toBeVisible();
  await expect(page.locator("main [lang='es']").first()).toBeVisible();
  await page.goto("/en/politica-de-cookies/");
  await expect(page.getByText("only available in Spanish")).toBeVisible();
});

test("la política de privacidad nombra los proveedores que intervienen", async ({
  page,
}) => {
  await page.goto("/politica-de-privacidad/");
  for (const provider of [
    "Cal.com",
    "Stripe",
    "Google",
    "Cloudflare",
    "Resend",
    "Vercel",
  ]) {
    await expect(page.getByText(provider).first()).toBeVisible();
  }
});

// La política de cookies afirma que el sitio no usa cookies propias: se comprueba.
for (const path of ["/", "/reservar/", "/sobre-mi/", "/politica-de-cookies/"]) {
  test(`${path} no guarda ninguna cookie al cargar`, async ({
    page,
    context,
  }) => {
    await page.goto(path);
    expect(await context.cookies()).toEqual([]);
  });
}

test("el aspecto solo se guarda en el navegador al pulsar el botón", async ({
  page,
}) => {
  await page.goto("/");
  expect(await page.evaluate(() => localStorage.getItem("scheme"))).toBeNull();
  await page.getByRole("button", { name: /Cambiar a modo/ }).click();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("scheme")))
    .not.toBeNull();
});

test("las condiciones de reserva dicen lo acordado y nada que no esté decidido", async ({
  page,
}) => {
  await page.goto("/condiciones-de-reserva/");
  // Intl pone un espacio duro entre la cifra y el euro: se normaliza para comparar.
  const text = (await page.getByRole("main").innerText()).replace(
    /\u00a0/g,
    " "
  );
  expect(text).toContain("120 €");
  expect(text).toContain("90 €");
  expect(text).toContain("48 horas");
  expect(text).toContain("100 %");
  expect(text).toContain("5 días hábiles");
  expect(text).toContain("14 días naturales");
  // El descuento y los marcadores pendientes no se publican.
  expect(text).not.toMatch(/COMPLETAR|descuent|descont/i);
  expect(text).toContain("Los precios incluyen el IVA");
});

for (const { prefix, lang } of locales) {
  test(`${prefix || "/"} /reservar/ enlaza las condiciones junto a los precios`, async ({
    page,
  }) => {
    await page.goto(`${prefix}/reservar/`);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(
      page.getByRole("main").getByRole("link", { name: /condici|terms/i })
    ).toHaveAttribute("href", `${prefix}/condiciones-de-reserva/`);
    await expect(page.getByRole("main")).toContainText(/IVA|VAT/);
  });
}

test("el aviso legal enlaza las condiciones de reserva", async ({ page }) => {
  await page.goto("/aviso-legal/");
  await expect(
    page.getByRole("main").getByRole("link", { name: "condiciones de reserva" })
  ).toHaveAttribute("href", "/condiciones-de-reserva/");
});

// Mientras el descuento no tenga condiciones publicadas, no puede aparecer en ninguna página
// (tampoco en el catálogo del design system, que se despliega con la web).
for (const path of [
  "/",
  "/ca/",
  "/en/",
  ...sitePages.map(({ path }) => path),
  ...catalogPages.map(({ path }) => path),
]) {
  test(`${path} no anuncia ningún descuento`, async ({ page }) => {
    await page.goto(path);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(
      /descontable|descuent|descomptable|discount|deducted/i
    );
  });
}

// Las condiciones de reserva están traducidas: mismas cifras y reglas, en el idioma de la página.
const termsByLocale = [
  {
    path: "/ca/condiciones-de-reserva/",
    lang: "ca",
    title: "Condicions de reserva",
    contains: [
      "120 €",
      "90 €",
      "48 hores",
      "100 %",
      "5 dies hàbils",
      "14 dies naturals",
      "Els preus inclouen l'IVA",
    ],
    absent: ["48 horas", "días hábiles", "només està disponible en castellà"],
  },
  {
    path: "/en/condiciones-de-reserva/",
    lang: "en",
    title: "Booking terms",
    contains: [
      "€120",
      "€90",
      "48 hours",
      "100 %",
      "5 working days",
      "14 calendar days",
      "Prices include VAT",
    ],
    absent: ["48 horas", "días hábiles", "only available in Spanish"],
  },
];

for (const { path, lang, title, contains, absent } of termsByLocale) {
  test(`${path} está traducida y dice lo mismo que la versión en castellano`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator("main [lang]").first()).toHaveAttribute(
      "lang",
      lang
    );
    const text = (await page.getByRole("main").innerText()).replace(
      /\u00a0/g,
      " "
    );
    for (const phrase of contains) expect(text).toContain(phrase);
    for (const phrase of absent) expect(text).not.toContain(phrase);
    expect(text).not.toMatch(/COMPLETAR/);
  });
}
