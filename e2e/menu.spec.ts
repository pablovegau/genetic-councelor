import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Los fallos del menú de la versión anterior, como pruebas de regresión (ADR 0005).
// El menú lateral solo existe en móvil: en escritorio la cabecera lleva los enlaces.
test.beforeEach(({ viewport }) => {
  test.skip((viewport?.width ?? 0) >= 768, "el menú lateral es solo de móvil");
});

const dialog = (page: Page) => page.getByRole("dialog");
/** Espera a que el panel acabe de entrar: un gesto durante la animación caería fuera de él. */
const settled = (page: Page) =>
  dialog(page).evaluate((popup) =>
    Promise.all(popup.getAnimations().map((animation) => animation.finished))
  );

/** Abre el menú y espera a que acabe de entrar. La isla se hidrata en `idle`: sin su atributo `ssr` ya responde. */
const open = async (page: Page) => {
  await expect(page.locator("astro-island")).not.toHaveAttribute("ssr");
  await page.getByRole("button", { name: "Abrir el menú" }).click();
  await expect(dialog(page)).toBeVisible();
  await settled(page);
};

test("se abre y se cierra con el botón y con Escape", async ({ page }) => {
  await page.goto("/");
  await open(page);
  await expect(dialog(page)).toBeVisible();
  await expect(
    dialog(page).getByRole("link", { name: "Sobre mí" })
  ).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog(page)).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Abrir el menú" })
  ).toBeFocused();

  await open(page);
  await page.getByRole("button", { name: "Cerrar el menú" }).click();
  await expect(dialog(page)).toBeHidden();
});

test("clicar fuera del panel no lo cierra: la cabecera sigue libre (p. ej. cambiar el esquema)", async ({
  page,
}) => {
  await page.goto("/");
  await open(page);
  const before = await page.evaluate(
    () => document.documentElement.dataset.scheme ?? "sistema"
  );

  await page.getByRole("button", { name: /Cambiar a modo/ }).click();
  await expect(dialog(page)).toBeVisible();
  const after = await page.evaluate(
    () => document.documentElement.dataset.scheme ?? "sistema"
  );
  expect(after).not.toBe(before);

  // Un clic en el hueco que rodea a la tarjeta tampoco lo cierra.
  await page.mouse.click(5, 400);
  await expect(dialog(page)).toBeVisible();
});

test("con el menú abierto el esquema cambia sin fundido de página: el desenfoque del panel no parpadea", async ({
  page,
}) => {
  await page.emulateMedia({
    colorScheme: "light",
    reducedMotion: "no-preference",
  });
  await page.addInitScript(() => {
    const w = window as unknown as { __transitions: number };
    w.__transitions = 0;
    const start = document.startViewTransition?.bind(document);
    if (!start) return;
    document.startViewTransition = (...args: Parameters<typeof start>) => {
      w.__transitions++;
      return start(...args);
    };
  });
  await page.goto("/");

  // Cerrado, el cambio sí hace el fundido (si el navegador lo soporta).
  const supported = await page.evaluate(
    () => "startViewTransition" in document
  );
  await open(page);
  await page.getByRole("button", { name: /Cambiar a modo/ }).click();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.scheme))
    .toBe("dark");
  expect(
    await page.evaluate(
      () => (window as unknown as { __transitions: number }).__transitions
    )
  ).toBe(0);

  await page.getByRole("button", { name: "Cerrar el menú" }).click();
  await expect(dialog(page)).toBeHidden();
  await page.getByRole("button", { name: /Cambiar a modo/ }).click();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.scheme))
    .toBe("light");
  if (supported)
    await expect
      .poll(() =>
        page.evaluate(
          () => (window as unknown as { __transitions: number }).__transitions
        )
      )
      .toBe(1);
});

test("la página de detrás queda inerte y la cabecera, no", async ({ page }) => {
  await page.goto("/");
  await open(page);
  await expect(page.locator("main")).toHaveJSProperty("inert", true);
  await expect(page.locator("footer")).toHaveJSProperty("inert", true);
  await expect(page.locator("header")).toHaveJSProperty("inert", false);

  await page.getByRole("button", { name: "Cerrar el menú" }).click();
  await expect(dialog(page)).toBeHidden();
  await expect(page.locator("main")).toHaveJSProperty("inert", false);
});

test("con el teclado se llega a la cabecera desde el panel", async ({
  page,
}) => {
  await page.goto("/");
  await open(page);
  // Mayús+Tab desde el primer enlace sube a la cabecera: el interruptor de esquema o el botón.
  await page.keyboard.press("Shift+Tab");
  await expect
    .poll(() =>
      page.evaluate(() => document.activeElement?.closest("header") !== null)
    )
    .toBe(true);
});

test("bloquea el scroll de la página mientras está abierto (la cabecera no se va)", async ({
  page,
}) => {
  await page.goto("/");
  await open(page);
  await page.mouse.wheel(0, 600);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
});

test("elegir un enlace o cambiar de idioma lleva a su sitio y cierra el panel", async ({
  page,
}) => {
  await page.goto("/");
  await open(page);
  await dialog(page).getByRole("link", { name: "Contacto" }).click();
  await expect(dialog(page)).toBeHidden();
  await expect(page).toHaveURL(/\/contacto\/$/);
});

test("desde el menú se cambia de idioma", async ({ page }) => {
  await page.goto("/");
  await open(page);
  await dialog(page).getByRole("link", { name: "CA", exact: true }).click();
  await expect(page).toHaveURL(/\/ca\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ca");
});

test("en una pantalla baja el panel hace scroll con la rueda y el botón de reservar queda a la vista", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 260 });
  await page.goto("/");
  await open(page);
  const book = dialog(page).getByRole("link", { name: "Reservar cita" });
  await expect(book).not.toBeInViewport();

  // Scroll de usuario (rueda) sobre el panel, no un desplazamiento programático.
  await page.mouse.move(190, 200);
  await page.mouse.wheel(0, 600);
  await expect(book).toBeInViewport();
});

test("al ensanchar la ventana a escritorio el panel se cierra de verdad: libera el scroll y no reaparece", async ({
  page,
}) => {
  await page.goto("/");
  await open(page);
  await page.setViewportSize({ width: 1000, height: 800 });
  await expect(dialog(page)).toBeHidden();

  // La rueda se repite en cada intento: el bloqueo se libera cuando acaba de cerrarse el panel.
  await expect
    .poll(async () => {
      await page.mouse.wheel(0, 600);
      return page.evaluate(() => window.scrollY);
    })
    .toBeGreaterThan(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(dialog(page)).toBeHidden();
});

test("con movimiento reducido no hay transiciones", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await open(page);
  const transition = await dialog(page).evaluate(
    (popup) => getComputedStyle(popup).transitionDuration
  );
  expect(transition).toBe("0s");
});

test("abierto tampoco tiene violaciones de accesibilidad WCAG 2.2 AA", async ({
  page,
}) => {
  await page.goto("/");
  await open(page);
  await expect(dialog(page)).toBeVisible();
  // Se espera a que acabe de entrar: axe mediría el contraste con el panel a medio camino.
  await page.waitForTimeout(500);
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    violations.map(
      ({ id, help, nodes }) =>
        `${id}: ${help} → ${nodes.map((node) => node.target.join(" ")).join(" | ")}`
    )
  ).toEqual([]);
});
