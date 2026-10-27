import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "dist/",
    "coverage/",
    "playwright-report/",
    "test-results/",
    ".vitest/",
    ".pnpm-store/",
    ".astro/",
    ".agents/",
    ".claude/",
    "docs/",
    "node_modules/",
    "src/design-system/*.generated.*",
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs["flat/recommended"],
  astro.configs["flat/jsx-a11y-recommended"],
  { files: ["**/*.{ts,tsx}"], ...jsxA11y.flatConfigs.recommended },
  { files: ["**/*.tsx"], ...reactHooks.configs.flat.recommended },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  // TypeScript ya comprueba los identificadores; no-undef da falsos positivos con tipos globales.
  { files: ["**/*.{ts,tsx,astro}"], rules: { "no-undef": "off" } },
]);
