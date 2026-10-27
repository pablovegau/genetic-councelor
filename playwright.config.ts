import { defineConfig, devices } from "@playwright/test";

const port = 4173;
const baseURL = `http://127.0.0.1:${port}`;

const desktop = {
  ...devices["Desktop Chrome"],
  viewport: { width: 1280, height: 800 },
};
const mobile = {
  ...devices["Desktop Chrome"],
  viewport: { width: 390, height: 844 },
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"]],
  expect: {
    toHaveScreenshot: { animations: "disabled", maxDiffPixelRatio: 0.002 },
  },
  use: { baseURL, trace: "retain-on-failure" },
  // Se prueba el sitio compilado, no el servidor de desarrollo (pnpm test:e2e compila antes).
  webServer: {
    command: `pnpm preview --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // Astro 7 pasa `preview` a segundo plano si detecta un agente de IA; Playwright
    // necesita que se quede en primer plano. Se vacían las variables de Claude Code.
    env: { AI_AGENT: "", CLAUDECODE: "" },
  },
  projects: [
    // Las pruebas de humo no dependen del esquema ni del ancho: solo en uno.
    { name: "desktop-light", use: { ...desktop, colorScheme: "light" } },
    {
      name: "desktop-dark",
      use: { ...desktop, colorScheme: "dark" },
      testMatch: /(a11y|vrt)\.spec\.ts/,
    },
    {
      name: "mobile-light",
      use: { ...mobile, colorScheme: "light" },
      testMatch: /(a11y|vrt)\.spec\.ts/,
    },
    {
      name: "mobile-dark",
      use: { ...mobile, colorScheme: "dark" },
      testMatch: /(a11y|vrt)\.spec\.ts/,
    },
  ],
});
