import { expect, test, type Page } from "@playwright/test";

// El icono pasa de sol a luna con transformaciones CSS. Safari y Firefox no aplican a círculos y
// máscaras las propiedades `r`, `cx` y `cy` (la primera versión del icono se quedaba en sol), así que
// esta prueba corre también en WebKit y Firefox. Mide la geometría real, no una captura.
const toggle = (page: Page) => page.locator("[data-scheme-toggle]");

/** Ancho del círculo central respecto al del icono: ~0,4 con el sol y ~0,8 con la luna. */
const disc = (page: Page) =>
  page.locator(".disc").evaluate((circle) => {
    const svg = circle.closest("svg") as SVGSVGElement;
    return (
      circle.getBoundingClientRect().width / svg.getBoundingClientRect().width
    );
  });

const opacityOf = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((element) => Number(getComputedStyle(element).opacity));

test("pasa de sol a luna y vuelve, con rayos y estrellas", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  expect(await disc(page)).toBeLessThan(0.5);
  expect(await opacityOf(page, ".rays line")).toBe(1);
  expect(await opacityOf(page, ".stars circle")).toBe(0);

  await toggle(page).click();
  await expect.poll(() => disc(page), { timeout: 4000 }).toBeGreaterThan(0.7);
  await expect
    .poll(() => opacityOf(page, ".rays line"), { timeout: 4000 })
    .toBe(0);
  await expect
    .poll(() => opacityOf(page, ".stars circle"), { timeout: 4000 })
    .toBe(1);

  await toggle(page).click();
  await expect.poll(() => disc(page), { timeout: 4000 }).toBeLessThan(0.5);
  await expect
    .poll(() => opacityOf(page, ".rays line"), { timeout: 4000 })
    .toBe(1);
  await expect
    .poll(() => opacityOf(page, ".stars circle"), { timeout: 4000 })
    .toBe(0);
});

test("si el sistema ya es oscuro, la luna está desde el primer pintado, sin animar", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  expect(await disc(page)).toBeGreaterThan(0.7);
  expect(await opacityOf(page, ".rays line")).toBe(0);
  expect(await opacityOf(page, ".stars circle")).toBe(1);
});

test("con movimiento reducido el cambio es instantáneo", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/");
  await toggle(page).click();
  await expect.poll(() => disc(page), { timeout: 500 }).toBeGreaterThan(0.7);
  expect(await opacityOf(page, ".stars circle")).toBe(1);
});

// El cambio de esquema se hace con una View Transition: un fundido corto de toda la página.
// Se envuelve `startViewTransition` para contar las llamadas y leer la duración de su animación.
const watchTransitions = (page: Page) =>
  page.addInitScript(() => {
    const w = window as unknown as {
      __transitions: number;
      __durations: number[];
    };
    w.__transitions = 0;
    w.__durations = [];
    const original = document.startViewTransition?.bind(document);
    if (!original) return;
    document.startViewTransition = (callback) => {
      w.__transitions++;
      const transition = original(callback);
      transition.ready
        .then(() => {
          w.__durations = document
            .getAnimations()
            .filter((animation) =>
              String(
                (animation.effect as KeyframeEffect | null)?.pseudoElement
              ).includes("view-transition")
            )
            .map(
              (animation) =>
                animation.effect?.getComputedTiming().duration as number
            );
        })
        .catch(() => undefined);
      return transition;
    };
  });

const readTransitions = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as {
      __transitions: number;
      __durations: number[];
    };
    return { count: w.__transitions, durations: w.__durations };
  });

const scheme = (page: Page) =>
  page.evaluate(() => document.documentElement.dataset.scheme);

test("cambiar de esquema hace un fundido corto de toda la página", async ({
  page,
}) => {
  await page.emulateMedia({
    colorScheme: "light",
    reducedMotion: "no-preference",
  });
  await watchTransitions(page);
  await page.goto("/");
  test.skip(
    !(await page.evaluate(() => "startViewTransition" in document)),
    "este navegador no tiene View Transitions"
  );

  await toggle(page).click();
  await expect.poll(() => scheme(page)).toBe("dark");
  await expect.poll(async () => (await readTransitions(page)).count).toBe(1);
  // 200 ms: rápido, pero no brusco.
  await expect
    .poll(async () => (await readTransitions(page)).durations)
    .toContain(200);
});

test("con movimiento reducido el esquema cambia sin fundido", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await watchTransitions(page);
  await page.goto("/");

  await toggle(page).click();
  await expect.poll(() => scheme(page)).toBe("dark");
  expect((await readTransitions(page)).count).toBe(0);
});

test("sin View Transitions el esquema cambia igual, de golpe", async ({
  page,
}) => {
  await page.emulateMedia({
    colorScheme: "light",
    reducedMotion: "no-preference",
  });
  await page.addInitScript(() => {
    (
      document as unknown as { startViewTransition?: unknown }
    ).startViewTransition = undefined;
  });
  await page.goto("/");

  await toggle(page).click();
  await expect.poll(() => scheme(page)).toBe("dark");
  await expect(toggle(page)).toHaveAttribute(
    "aria-label",
    "Cambiar a modo claro"
  );
});
