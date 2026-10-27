import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  colorValueToSrgb,
  contrastRatio,
  type ColorValue,
} from "./testing/color";
import {
  allSourceFiles,
  loadScheme,
  readResolver,
  readSource,
  tokensRoot,
  type ResolvedToken,
  type Scheme,
} from "./testing/load";

const schemes: Scheme[] = ["light", "dark"];

// Constantes de la especificación Design Tokens 2025.10 (fuente externa, no del código).
const DOLLAR_PROPERTIES = [
  "$value",
  "$type",
  "$description",
  "$deprecated",
  "$extensions",
  "$extends",
  "$root",
];
const COLOR_SPACES = [
  "srgb",
  "srgb-linear",
  "hsl",
  "hwb",
  "lab",
  "lch",
  "oklab",
  "oklch",
  "display-p3",
  "a98-rgb",
  "prophoto-rgb",
  "rec2020",
  "xyz-d65",
  "xyz-d50",
];

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Devuelve el motivo si el valor literal no tiene la forma de su tipo DTCG. */
function literalProblem(type: string, value: unknown): string | undefined {
  switch (type) {
    case "color": {
      if (!isRecord(value)) return "un color debe ser un objeto, no una cadena";
      if (!COLOR_SPACES.includes(String(value.colorSpace)))
        return `espacio de color desconocido: ${String(value.colorSpace)}`;
      const components = value.components;
      if (
        !Array.isArray(components) ||
        components.length !== 3 ||
        !components.every((item) => isNumber(item) || item === "none")
      )
        return "components debe ser un array de 3 números o 'none'";
      if (
        value.alpha !== undefined &&
        !(isNumber(value.alpha) && value.alpha >= 0 && value.alpha <= 1)
      )
        return "alpha debe estar entre 0 y 1";
      if (value.hex !== undefined && !/^#[0-9a-f]{6}$/i.test(String(value.hex)))
        return "hex debe ser #rrggbb";
      return undefined;
    }
    case "dimension":
      return isRecord(value) &&
        isNumber(value.value) &&
        ["px", "rem"].includes(String(value.unit))
        ? undefined
        : "una dimensión es { value: número, unit: 'px' | 'rem' }";
    case "duration":
      return isRecord(value) &&
        isNumber(value.value) &&
        ["ms", "s"].includes(String(value.unit))
        ? undefined
        : "una duración es { value: número, unit: 'ms' | 's' }";
    case "fontFamily":
      return typeof value === "string" ||
        (Array.isArray(value) &&
          value.length > 0 &&
          value.every((item) => typeof item === "string"))
        ? undefined
        : "una familia es una cadena o un array de cadenas";
    case "fontWeight":
      // La especificación admite también alias de texto; aquí exigimos número por convención.
      return isNumber(value) && value >= 1 && value <= 1000
        ? undefined
        : "el peso debe ser un número entre 1 y 1000";
    case "number":
      return isNumber(value) ? undefined : "debe ser un número";
    case "cubicBezier":
      return Array.isArray(value) &&
        value.length === 4 &&
        value.every(isNumber) &&
        value[0]! >= 0 &&
        value[0]! <= 1 &&
        value[2]! >= 0 &&
        value[2]! <= 1
        ? undefined
        : "cubicBezier son 4 números con x1 y x2 entre 0 y 1";
    default:
      return `tipo sin validador en los tests: ${type}`;
  }
}

/** Propiedades `$` y nombres de token o grupo de un fichero, sin entrar en `$value`. */
function keysOf(node: Record<string, unknown>) {
  const found = { dollar: [] as string[], names: [] as string[] };
  const visit = (current: Record<string, unknown>) => {
    for (const [key, child] of Object.entries(current)) {
      if (key.startsWith("$")) {
        found.dollar.push(key);
      } else {
        found.names.push(key);
        if (isRecord(child)) visit(child);
      }
    }
  };
  visit(node);
  return found;
}

const literalTokens = (scheme: Scheme) =>
  [...loadScheme(scheme).values()].filter((token) => token.alias === undefined);

describe.each(allSourceFiles())(
  "fichero de tokens %s cumple DTCG 2025.10",
  (file) => {
    const { dollar, names } = keysOf(readSource(file));

    it("solo usa propiedades $ de la especificación", () => {
      expect(
        [...new Set(dollar)].filter((key) => !DOLLAR_PROPERTIES.includes(key))
      ).toEqual([]);
    });

    it("ningún nombre de token o grupo contiene llaves ni puntos", () => {
      expect(names.filter((name) => /[{}.]/.test(name))).toEqual([]);
    });
  }
);

describe.each(schemes)("tokens del esquema %s", (scheme) => {
  const tokens = loadScheme(scheme);

  it("todos los tokens tienen un tipo determinable", () => {
    expect(
      [...tokens.values()].filter((token) => !token.type).map((t) => t.path)
    ).toEqual([]);
  });

  it("todos los alias apuntan a un token existente", () => {
    expect(
      [...tokens.values()]
        .filter((token) => token.problem === "missing")
        .map((token) => `${token.path} → {${token.alias}}`)
    ).toEqual([]);
  });

  it("ningún alias forma un ciclo", () => {
    expect(
      [...tokens.values()]
        .filter((token) => token.problem === "cycle")
        .map((token) => token.path)
    ).toEqual([]);
  });

  it("un alias tiene el mismo tipo que el token al que apunta", () => {
    const mismatches = [...tokens.values()]
      .filter((token) => token.alias !== undefined && !token.problem)
      .filter((token) => token.type !== tokens.get(token.chain.at(-1)!)?.type)
      .map((token) => token.path);
    expect(mismatches).toEqual([]);
  });

  it("los valores literales tienen la forma de su tipo", () => {
    const problems = literalTokens(scheme)
      .map((token) => ({
        path: token.path,
        problem: literalProblem(token.type ?? "", token.value),
      }))
      .filter(({ problem }) => problem !== undefined)
      .map(({ path, problem }) => `${path}: ${problem}`);
    expect(problems).toEqual([]);
  });

  it("los tokens primitivos son valores, no alias", () => {
    expect(
      [...tokens.values()]
        .filter((t) => t.file.startsWith("primitive/") && t.alias)
        .map((t) => t.path)
    ).toEqual([]);
  });

  it("los tokens semánticos son solo alias, nunca valores sueltos", () => {
    expect(
      [...tokens.values()]
        .filter((t) => t.file.startsWith("semantic/") && !t.alias)
        .map((t) => t.path)
    ).toEqual([]);
  });
});

describe("esquemas claro y oscuro", () => {
  const colorRoles = (scheme: Scheme) =>
    [...loadScheme(scheme).values()]
      .filter((token) => token.file.startsWith("semantic/color."))
      .map((token) => token.path)
      .sort();

  it("definen exactamente los mismos roles de color", () => {
    expect(colorRoles("dark")).toEqual(colorRoles("light"));
  });

  it("hay roles de color definidos en cada esquema", () => {
    expect(colorRoles("light").length).toBeGreaterThan(0);
  });
});

describe("resolver del tema default", () => {
  const resolver = readResolver();

  it("declara la versión 2025.10", () => {
    expect(resolver.version).toBe("2025.10");
  });

  it("todos los ficheros que referencia existen", () => {
    const missing = allSourceFiles().filter(
      (file) => !existsSync(join(tokensRoot, file))
    );
    expect(missing).toEqual([]);
  });

  it("cada entrada de resolutionOrder apunta a un conjunto o modificador existente", () => {
    const unknown = resolver.resolutionOrder
      .map(({ $ref }) => $ref)
      .filter((ref) => {
        const [, kind, name] = ref.split("/");
        const group = kind === "sets" ? resolver.sets : resolver.modifiers;
        return !(name && group && name in group);
      });
    expect(unknown).toEqual([]);
  });

  it("define los esquemas claro y oscuro con claro por defecto", () => {
    const scheme = resolver.modifiers?.scheme;
    expect(Object.keys(scheme?.contexts ?? {}).sort()).toEqual([
      "dark",
      "light",
    ]);
    expect(scheme?.default).toBe("light");
  });
});

// Política de contraste del proyecto (WCAG 2.x): ver ADR 0005.
//  - texto: 4,5:1 (AA); el texto principal, 7:1 (AAA)
//  - componentes de interfaz (borde fuerte, foco): 3:1 (1.4.11); el borde decorativo está exento
const surfaces = ["bg.page", "bg.surface", "bg.subtle"];
const contrastPairs = [
  ...surfaces.flatMap((surface) => [
    { fg: "text.default", bg: surface, min: 7 },
    { fg: "text.muted", bg: surface, min: 4.5 },
    { fg: "border.strong", bg: surface, min: 3 },
    { fg: "focus.ring", bg: surface, min: 3 },
  ]),
  { fg: "action.fg", bg: "action.bg", min: 4.5 },
  { fg: "text.inverse", bg: "action.bg", min: 4.5 },
];

describe.each(schemes)("contraste WCAG en el esquema %s", (scheme) => {
  const tokens = loadScheme(scheme);
  const srgb = (role: string) =>
    colorValueToSrgb(
      (tokens.get(`color.${role}`) as ResolvedToken).value as ColorValue
    );

  it.each(contrastPairs)(
    "color.$fg sobre color.$bg alcanza $min:1",
    ({ fg, bg, min }) => {
      expect(contrastRatio(srgb(fg), srgb(bg))).toBeGreaterThanOrEqual(min);
    }
  );
});
