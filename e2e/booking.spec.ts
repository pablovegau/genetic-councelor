import { expect, test } from "@playwright/test";
import publications from "../src/data/publications.json" with { type: "json" };

// Reserva con Cal.com: un script de terceros que solo debe cargarse cuando la persona elige una visita.
const embed = "https://app.cal.com/embed/embed.js";

test("los precios están a la vista, sin pedirlos", async ({ page }) => {
  await page.goto("/reservar/");
  await expect(page.getByText("120 €", { exact: true })).toBeVisible();
  await expect(page.getByText("90 €", { exact: true })).toBeVisible();
  // El descuento no se anuncia hasta que haya condiciones publicadas.
  await expect(page.getByText(/descontable/i)).toHaveCount(0);
});

test("en inglés el precio sigue el formato del idioma", async ({ page }) => {
  await page.goto("/en/reservar/");
  await expect(page.getByText("€120", { exact: true })).toBeVisible();
});

test("la página de reserva no carga nada de Cal.com hasta que se elige una visita", async ({
  page,
}) => {
  const requested: string[] = [];
  // Solo se interceptan las peticiones a Cal.com; el resto del sitio carga con normalidad.
  await page.route(/cal\.(eu|com)/, (route) => {
    requested.push(route.request().url());
    return route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: "",
    });
  });
  await page.goto("/reservar/");
  await page.waitForLoadState("networkidle");
  expect(requested).toEqual([]);
});

test("al elegir una visita se carga el calendario de esa visita y queda un enlace directo por si falla", async ({
  page,
}) => {
  await page.route(embed, (route) =>
    route.fulfill({ status: 200, contentType: "text/javascript", body: "" })
  );
  await page.goto("/reservar/");
  await page.getByRole("link", { name: "Ver horarios" }).first().click();

  const script = page.locator(`script[src="${embed}"]`);
  await expect(script).toHaveCount(1);
  const calls = await page.evaluate(
    () => (window as unknown as { Cal: { q: unknown[][] } }).Cal.q
  );
  expect(calls.map(([command]) => command)).toEqual([
    "init",
    "on",
    "on",
    "inline",
    "ui",
  ]);
  expect(JSON.stringify(calls[3])).toContain(
    "saratorresesquius/primera-visita"
  );
  expect(JSON.stringify(calls[0])).toContain("https://cal.com");

  await expect(
    page.getByText("Elige una de las visitas de arriba")
  ).toBeHidden();
  await expect(
    page.getByRole("link", { name: /Ábrelo en una página nueva/ })
  ).toHaveAttribute("href", "https://cal.com/saratorresesquius/primera-visita");
});

test("elegir la otra visita cambia el calendario sin cargar el script dos veces", async ({
  page,
}) => {
  await page.route(embed, (route) =>
    route.fulfill({ status: 200, contentType: "text/javascript", body: "" })
  );
  await page.goto("/reservar/");
  const buttons = page.getByRole("link", { name: "Ver horarios" });
  await buttons.nth(0).click();
  await buttons.nth(1).click();
  await expect(page.locator(`script[src="${embed}"]`)).toHaveCount(1);
  const calls = await page.evaluate(
    () => (window as unknown as { Cal: { q: unknown[][] } }).Cal.q
  );
  expect(calls.map(([command]) => command)).toEqual([
    "init",
    "on",
    "on",
    "inline",
    "ui",
    "on",
    "on",
    "inline",
    "ui",
  ]);
  expect(JSON.stringify(calls[7])).toContain("saratorresesquius/seguimiento");
  await expect(
    page.getByRole("link", { name: /Ábrelo en una página nueva/ })
  ).toHaveAttribute("href", "https://cal.com/saratorresesquius/seguimiento");
});

test("sin JavaScript cada visita es un enlace directo a su página de Cal.com", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/reservar/");
  await expect(page.getByRole("link", { name: "Ver horarios" })).toHaveCount(2);
  await expect(
    page.getByRole("link", { name: "Ver horarios" }).first()
  ).toHaveAttribute("href", "https://cal.com/saratorresesquius/primera-visita");
  await context.close();
});

test("al reservar solo se pide el motivo, que se rellena en el calendario: la página no tiene campos", async ({
  page,
}) => {
  await page.goto("/reservar/");
  await expect(page.locator("input, textarea, select")).toHaveCount(0);
  await expect(
    page.getByText("Al reservar solo te pedimos el motivo de tu consulta", {
      exact: false,
    })
  ).toBeVisible();
});

test("los botones de reservar (cabecera, portada, situaciones y cierre) llevan a la reserva de su idioma", async ({
  page,
}) => {
  await page.goto("/ca/");
  // Cabecera (escritorio), hero y cierre; en móvil el de la cabecera está dentro del menú.
  await expect(page.locator('a[href="/ca/reservar/"]')).not.toHaveCount(0);
  // Portada, las cuatro situaciones y el cierre.
  await expect(page.locator('main a[href="/ca/reservar/"]')).toHaveCount(6);
  await expect(page.locator('a[href="#cita"]')).toHaveCount(0);
});

test("el selector de idioma mantiene la página: de la reserva en español a la de catalán", async ({
  page,
}) => {
  await page.goto("/reservar/");
  const width = page.viewportSize()?.width ?? 0;
  if (width < 768)
    await page.getByRole("button", { name: "Abrir el menú" }).click();
  await page.getByRole("link", { name: "CA", exact: true }).click();
  await expect(page).toHaveURL(/\/ca\/reservar\/$/);
  await expect(page.locator("h1")).toHaveText("Reserva la teva primera visita");
});

test.describe("publicaciones", () => {
  test("se ven las 5 más recientes y el total sale de los datos", async ({
    page,
  }) => {
    await page.goto("/sobre-mi/");
    const visible = page.locator("ol").first().getByRole("listitem");
    await expect(visible).toHaveCount(5);
    await expect(
      page.getByText(`${publications.length} publicaciones en PubMed.`, {
        exact: false,
      })
    ).toBeVisible();
  });

  test("el resto queda tras «Ver las N restantes» y se despliega con el teclado", async ({
    page,
  }) => {
    await page.goto("/sobre-mi/");
    const rest = publications.length - 5;
    const summary = page.getByText(`Ver las ${rest} restantes`);
    await expect(summary).toBeVisible();
    const last = page.getByRole("link", {
      name: new RegExp(
        publications
          .at(-1)!
          .title.slice(0, 30)
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      ),
    });
    await expect(last).toBeHidden();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(last).toBeVisible();
  });

  test("cada publicación enlaza a PubMed en otra pestaña", async ({ page }) => {
    await page.goto("/sobre-mi/");
    const first = page.locator("ol").first().getByRole("link").first();
    await expect(first).toHaveAttribute(
      "href",
      /^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/\d+\/$/
    );
    await expect(first).toHaveAttribute("target", "_blank");
    await expect(first).toHaveAttribute("rel", /noopener/);
  });

  test("los datos están ordenados de la más reciente a la más antigua y sin duplicados", () => {
    const years = publications.map(({ year }) => Number(year));
    expect([...years].sort((a, b) => b - a)).toEqual(years);
    const ids = publications.map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(publications.length).toBeGreaterThan(0);
  });
});

// ---- Calendario de Cal.com: preselección, estados y tema (el build de pruebas tiene las reservas activas) ----
type CalCall = [string, Record<string, unknown>];
const queue = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () => (window as unknown as { Cal: { q: CalCall[] } }).Cal.q as CalCall[]
  );
const stubEmbed = (page: import("@playwright/test").Page) =>
  page.route(embed, (route) =>
    route.fulfill({ status: 200, contentType: "text/javascript", body: "" })
  );

test("?visita=seguimiento abre ese calendario sin pulsar nada", async ({
  page,
}) => {
  await stubEmbed(page);
  await page.goto("/reservar/?visita=seguimiento");
  await expect(page.locator(`script[src="${embed}"]`)).toHaveCount(1);
  const inline = (await queue(page)).find(([command]) => command === "inline");
  expect(inline![1].calLink).toBe("saratorresesquius/seguimiento");
  await expect(
    page.getByRole("link", { name: /Ábrelo en una página nueva/ })
  ).toHaveAttribute("href", "https://cal.com/saratorresesquius/seguimiento");
});

test("#primera-visita también preselecciona, y una visita que no existe no carga nada", async ({
  page,
}) => {
  await stubEmbed(page);
  await page.goto("/reservar/#primera-visita");
  const inline = (await queue(page)).find(([command]) => command === "inline");
  expect(inline![1].calLink).toBe("saratorresesquius/primera-visita");

  const requested: string[] = [];
  await page.route(/cal\.(eu|com)/, (route) => {
    requested.push(route.request().url());
    return route.fulfill({ status: 200, body: "" });
  });
  await page.goto("/ca/reservar/?visita=otra-cosa");
  await page.waitForLoadState("networkidle");
  expect(requested).toEqual([]);
});

test("mientras carga se ve «Cargando el calendario…» y desaparece cuando Cal.com avisa", async ({
  page,
}) => {
  await stubEmbed(page);
  await page.goto("/reservar/");
  await page.getByRole("link", { name: "Ver horarios" }).first().click();
  const loading = page.getByText("Cargando el calendario…");
  await expect(loading).toBeVisible();
  // Cal.com avisa con linkReady: se ejecuta el callback que la página dejó en su cola.
  await page.evaluate(() => {
    const q = (window as unknown as { Cal: { q: unknown[][] } }).Cal.q;
    const ready = q.find(
      ([command, options]) =>
        command === "on" &&
        (options as { action: string }).action === "linkReady"
    )!;
    (ready[1] as { callback: () => void }).callback();
  });
  await expect(loading).toBeHidden();
});

test("si el calendario no carga se explica y queda el enlace a una página nueva", async ({
  page,
}) => {
  await page.route(embed, (route) => route.abort());
  await page.goto("/reservar/");
  await page.getByRole("link", { name: "Ver horarios" }).first().click();
  await expect(page.getByRole("alert")).toHaveText(
    "No hemos podido cargar el calendario. Prueba a abrirlo en una página nueva."
  );
  await expect(page.getByText("Cargando el calendario…")).toBeHidden();
  const fallback = page.getByRole("link", {
    name: /Ábrelo en una página nueva/,
  });
  await expect(fallback).toHaveAttribute(
    "href",
    "https://cal.com/saratorresesquius/primera-visita"
  );
  await expect(fallback).toHaveAttribute("target", "_blank");
  await expect(fallback).toHaveAttribute("rel", "noopener noreferrer");
});

test("si Cal.com no responde en 15 s también se muestra el error", async ({
  page,
}) => {
  await page.clock.install();
  await stubEmbed(page);
  await page.goto("/reservar/");
  await page.getByRole("link", { name: "Ver horarios" }).first().click();
  await expect(page.getByText("Cargando el calendario…")).toBeVisible();
  await page.clock.fastForward(16_000);
  await expect(page.getByRole("alert")).toBeVisible();
});

for (const scheme of ["light", "dark"] as const) {
  test(`el calendario recibe el tema ${scheme} y el color de acción del sitio`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await stubEmbed(page);
    await page.goto("/reservar/");
    await page.getByRole("link", { name: "Ver horarios" }).first().click();
    const ui = (await queue(page)).find(
      ([command]) => command === "ui"
    )![1] as {
      theme: string;
      layout: string;
      styles: { branding: { brandColor: string } };
    };
    expect(ui.theme).toBe(scheme);
    expect(ui.layout).toBe("month_view");
    expect(ui.styles.branding.brandColor).toMatch(/^#[0-9a-f]{6}$/);
  });
}

for (const [path, locale] of [
  ["/reservar/", "es"],
  ["/ca/reservar/", "ca"],
  ["/en/reservar/", "en"],
] as const) {
  test(`${path} pide el calendario en su idioma`, async ({ page }) => {
    await stubEmbed(page);
    await page.goto(`${path}?visita=primera-visita`);
    const inline = (await queue(page)).find(
      ([command]) => command === "inline"
    );
    expect(JSON.stringify(inline![1].config)).toContain(`"locale":"${locale}"`);
  });
}
