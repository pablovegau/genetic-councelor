import { expect, test } from "@playwright/test";

const locales = [
  {
    prefix: "",
    lang: "es",
    links: ["Aviso legal", "Política de privacidad", "Política de cookies"],
  },
  {
    prefix: "/ca",
    lang: "ca",
    links: ["Avís legal", "Política de privacitat", "Política de cookies"],
  },
  {
    prefix: "/en",
    lang: "en",
    links: ["Legal notice", "Privacy policy", "Cookie policy"],
  },
];
const slugs = ["aviso-legal", "politica-de-privacidad", "politica-de-cookies"];

for (const { prefix, links } of locales) {
  test(`${prefix || "/"} enlaza las tres páginas legales desde el pie`, async ({
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
