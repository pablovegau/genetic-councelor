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
  await expect(page.getByRole("link", { name: "Sobre mí" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog(page)).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Abrir el menú" })
  ).toBeFocused();

  await open(page);
  await page.getByRole("button", { name: "Cerrar el menú" }).click();
  await expect(dialog(page)).toBeHidden();
});

test("el foco queda atrapado en el panel y el resto de la página está inerte", async ({
  page,
}) => {
  await page.goto("/");
  await open(page);

  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    // Base UI redirige el foco con unas guardas invisibles: se espera a que vuelva dentro.
    await expect
      .poll(() =>
        page.evaluate(() =>
          document
            .querySelector('[role="dialog"]')
            ?.contains(document.activeElement)
        )
      )
      .toBe(true);
  }
  // Nada de la página de detrás se puede leer con un lector de pantalla.
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(0);
});

test("bloquea el scroll de la página mientras está abierto", async ({
  page,
}) => {
  await page.goto("/");
  await open(page);
  await page.mouse.wheel(0, 600);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("elegir un enlace o cambiar de idioma lleva a su sitio y cierra el panel", async ({
  page,
}) => {
  await page.goto("/");
  await open(page);
  await page.getByRole("link", { name: "Contacto" }).click();
  await expect(dialog(page)).toBeHidden();
  await expect(page).toHaveURL(/#contacto$/);
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
