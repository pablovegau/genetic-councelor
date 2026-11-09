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

for (const { path, lang } of versions) {
  test(`${path} enlaza el correo y el LinkedIn en el pie`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(
      page
        .getByRole("contentinfo")
        .getByRole("link", { name: "contact@saratorresesquius.com" })
    ).toHaveAttribute("href", "mailto:contact@saratorresesquius.com");
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: "LinkedIn" })
    ).toHaveAttribute("href", "https://www.linkedin.com/in/saratorresesquius/");
  });
}

// En tablet el titular y el árbol comparten fila: no se pueden pisar en ningún idioma.
for (const { path } of versions) {
  for (const width of [768, 820, 900, 1024, 1100]) {
    test(`${path} el titular no se solapa con el árbol a ${width} px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const [title, tree] = await Promise.all([
        page.locator("h1").boundingBox(),
        page.locator("[data-family-tree]").boundingBox(),
      ]);
      expect(title!.x + title!.width).toBeLessThanOrEqual(tree!.x);
      // Y ninguna palabra desborda la caja del titular.
      const overflow = await page
        .locator("h1")
        .evaluate((h1) => h1.scrollWidth - h1.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
}

for (const path of ["/", "/ca/", "/en/"]) {
  test(`${path}: el hero no repite el precio ni la cancelación junto al botón`, async ({
    page,
  }) => {
    await page.goto(path);
    const hero = page.locator("main > div > section").first();
    await expect(hero.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(hero).not.toContainText(/120|IVA|VAT|48 ?h/);
  });
}

for (const { path, prefix, names } of [
  { path: "/", prefix: "", names: ["Primera visita", "Seguimiento"] },
  { path: "/ca/", prefix: "/ca", names: ["Primera visita", "Seguiment"] },
  { path: "/en/", prefix: "/en", names: ["First visit", "Follow-up"] },
]) {
  test(`${path}: las dos visitas con su precio llevan a reservar con la visita elegida`, async ({
    page,
  }) => {
    await page.goto(path);
    const section = page.locator("#visitas");
    for (const name of names) await expect(section).toContainText(name);
    const links = section.locator(`a[href^="${prefix}/reservar/?visita="]`);
    await expect(links).toHaveCount(2);
    await expect(links.nth(0)).toHaveAttribute(
      "href",
      `${prefix}/reservar/?visita=primera-visita`
    );
    await expect(links.nth(1)).toHaveAttribute(
      "href",
      `${prefix}/reservar/?visita=seguimiento`
    );
  });
}

test("en escritorio el menú está centrado entre la marca y el selector de idioma", async ({
  page,
}) => {
  await page.goto("/");
  test.skip(
    (page.viewportSize()?.width ?? 0) < 768,
    "En móvil el menú va en el panel."
  );
  const box = async (selector: string) =>
    (await page.locator(selector).first().boundingBox())!;
  const brand = await box("header .brand");
  const nav = await box("header nav");
  const langs = await box("header .langs");
  const left = nav.x - (brand.x + brand.width);
  const right = langs.x - (nav.x + nav.width);
  expect(Math.abs(left - right)).toBeLessThanOrEqual(2);
});

for (const { path, linkedin } of [
  { path: "/", linkedin: "LinkedIn" },
  { path: "/ca/", linkedin: "LinkedIn" },
  { path: "/en/", linkedin: "LinkedIn" },
]) {
  test(`${path}: LinkedIn con su logo entre el selector de idioma y el botón de reservar, y los iconos del pie`, async ({
    page,
  }) => {
    await page.goto(path);
    const width = page.viewportSize()?.width ?? 0;
    if (width >= 768) {
      const link = page.locator("header .social a");
      await expect(link).toHaveAccessibleName(linkedin);
      await expect(link).toHaveAttribute(
        "href",
        "https://www.linkedin.com/in/saratorresesquius/"
      );
      await expect(link.locator('svg[data-icon="linkedin"]')).toBeVisible();
      const langs = (await page.locator("header .langs").boundingBox())!;
      const social = (await link.boundingBox())!;
      const book = (await page.locator("header .book").boundingBox())!;
      expect(social.x).toBeGreaterThan(langs.x + langs.width - 1);
      expect(social.x + social.width).toBeLessThan(book.x + 1);
    }
    const footer = page.locator("footer");
    await expect(
      footer.locator('a[href^="mailto:"] svg[data-icon="mail"]')
    ).toBeVisible();
    await expect(
      footer.locator('a[href*="linkedin.com"] svg[data-icon="linkedin"]')
    ).toBeVisible();
  });
}

for (const { path, nav, status } of [
  { path: "/blog/", nav: "Blog", status: "Estamos preparando el blog" },
  { path: "/ca/blog/", nav: "Blog", status: "Estem preparant el blog" },
  { path: "/en/blog/", nav: "Blog", status: "We are getting the blog ready" },
]) {
  test(`${path}: el blog está en construcción y aparece en el menú y en el pie`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Blog");
    await expect(page.getByRole("main")).toContainText(status);
    await expect(page.locator(`footer a[href="${path}"]`)).toHaveText(nav);
    await expect(page.locator(`header a[href="${path}"]`)).not.toHaveCount(0);
  });
}

for (const width of [768, 820, 1024]) {
  test(`la cabecera cabe a ${width} px sin desbordar ni solaparse`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/ca/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
    const rects = await page.evaluate(() =>
      [".brand", "nav", ".langs", ".social", ".actions"].map((selector) => {
        const { left, right } = document
          .querySelector(`header ${selector}`)!
          .getBoundingClientRect();
        return { left, right };
      })
    );
    rects.slice(1).forEach((rect, i) => {
      expect(rect.left).toBeGreaterThanOrEqual(rects[i]!.right - 0.5);
    });
  });
}

for (const path of [
  "/",
  "/ca/",
  "/en/",
  "/contacto/",
  "/blog/",
  "/sobre-mi/",
  "/ca/sobre-mi/",
  "/en/sobre-mi/",
]) {
  for (const width of [320, 360, 390, 768, 820]) {
    test(`${path} no desborda en horizontal a ${width} px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

for (const { path, group, other, interview } of [
  {
    path: "/sobre-mi/",
    group: "Unidad de Telómeros del Adulto, Vall d'Hebron",
    other: "Otras apariciones",
    interview: "Entrevista",
  },
  {
    path: "/ca/sobre-mi/",
    group: "Unitat de Telòmers de l'Adult, Vall d'Hebron",
    other: "Altres aparicions",
    interview: "Entrevista",
  },
  {
    path: "/en/sobre-mi/",
    group: "Adult Telomere Unit, Vall d'Hebron",
    other: "Other appearances",
    interview: "Interview",
  },
]) {
  test(`${path}: la prensa se agrupa por la unidad de telómeros y el resto, con la entrevista primero`, async ({
    page,
  }) => {
    await page.goto(path);
    const press = page.locator("#prensa");
    await expect(press.getByRole("heading", { name: group })).toBeVisible();
    await expect(press.getByRole("heading", { name: other })).toBeVisible();
    const lists = press.locator("ul");
    await expect(lists).toHaveCount(2);
    const first = lists.nth(0).getByRole("listitem");
    expect(await first.count()).toBe(11);
    await expect(first.nth(0)).toContainText("RTVE");
    await expect(first.nth(0)).toContainText(interview);
    await expect(first.nth(1)).toContainText("La Vanguardia");
    await expect(lists.nth(1).getByRole("listitem")).toHaveCount(2);
    // Todos los enlaces abren otra pestaña y los titulares conservan su idioma.
    for (const link of await press.getByRole("link").all()) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("href", /^https:\/\//);
      await expect(link).toHaveAttribute("lang", /^(es|ca)$/);
    }
  });
}

for (const { path, first, last, degree, fact } of [
  {
    path: "/sobre-mi/",
    first: "Desde 2025",
    last: "Además",
    degree: "Máster en Genética Asistencial (UAB)",
    fact: "Atiende en español, catalán e inglés.",
  },
  {
    path: "/ca/sobre-mi/",
    first: "Des del 2025",
    last: "A més",
    degree: "Màster en Genètica Assistencial (UAB)",
    fact: "Atén en castellà, català i anglès.",
  },
  {
    path: "/en/sobre-mi/",
    first: "Since 2025",
    last: "Also",
    degree: "Master's in Clinical Genetics (UAB)",
    fact: "Sees patients in Spanish, Catalan and English.",
  },
]) {
  test(`${path}: la trayectoria es una línea de tiempo con formación y tres datos clave`, async ({
    page,
  }) => {
    await page.goto(path);
    const steps = page.locator("ol").first().getByRole("listitem");
    await expect(steps).toHaveCount(4);
    await expect(steps.first()).toContainText(first);
    await expect(steps.first()).toContainText("Corachan-IDOC");
    await expect(steps.nth(2)).toContainText("Vall d'Hebron");
    await expect(steps.nth(2)).toContainText("2024");
    await expect(steps.last()).toContainText(last);
    await expect(steps.last()).toContainText("SEAGen");
    await expect(page.getByText(degree)).toBeVisible();
    await expect(page.getByText(fact)).toBeVisible();
    await expect(
      page.locator("main ul").first().getByRole("listitem")
    ).toHaveCount(3);
  });
}
