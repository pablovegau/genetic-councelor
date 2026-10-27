import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    // Umbral solo sobre la lógica (ADR 0005); la presentación se protege con tests de contrato y VRT.
    coverage: {
      provider: "v8",
      include: [
        "scripts/style-props.ts",
        "src/design-system/primitives/style-props.ts",
        "src/design-system/primitives/cx.ts",
      ],
      thresholds: { statements: 90, branches: 90, functions: 90, lines: 90 },
    },
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
        },
      },
      {
        // Componentes en un Chromium real, con el CSS verdadero (tokens, capas, style props).
        test: {
          name: "components",
          include: ["src/**/*.test.tsx"],
          setupFiles: ["./src/design-system/testing/setup.ts"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
