import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import postcss, { type AtRule, type Root, type Rule } from "postcss";
import { beforeAll, describe, expect, it } from "vitest";
import { loadScheme, type ResolvedToken } from "./testing/load";

const cssPath = fileURLToPath(
  new URL("../tokens.generated.css", import.meta.url)
);

// Convención de nombres: la ruta del token con los puntos convertidos en guiones.
const customProperty = (path: string) => `--${path.replaceAll(".", "-")}`;
const reference = (token: ResolvedToken) =>
  `var(${customProperty(token.chain[0]!)})`;

const declarations = (rule: Rule | undefined) => {
  const found = new Map<string, string>();
  rule?.walkDecls((declaration) => {
    found.set(declaration.prop, declaration.value.replace(/\s+/g, " ").trim());
  });
  return found;
};

const topLevelRule = (root: Root, selector: string) =>
  root.nodes.find(
    (node): node is Rule => node.type === "rule" && node.selector === selector
  );

const ruleInMedia = (root: Root, media: string, selector: string) => {
  const atRule = root.nodes.find(
    (node): node is AtRule =>
      node.type === "atrule" && node.name === "media" && node.params === media
  );
  return atRule?.nodes?.find(
    (node): node is Rule => node.type === "rule" && node.selector === selector
  );
};

const light = loadScheme("light");
const dark = loadScheme("dark");

// Los roles que cambian con el esquema: su alias (o valor) difiere entre claro y oscuro.
const schemeDependent = [...light.values()].filter(
  (token) =>
    JSON.stringify(token.raw) !== JSON.stringify(dark.get(token.path)?.raw)
);

describe("variables CSS generadas a partir de los tokens", () => {
  let root: Root;

  beforeAll(() => {
    if (!existsSync(cssPath))
      throw new Error("Falta tokens.generated.css: ejecuta `pnpm tokens`.");
    root = postcss.parse(readFileSync(cssPath, "utf8"));
  });

  it("declara en :root una variable por cada token, y ninguna más", () => {
    const declared = [...declarations(topLevelRule(root, ":root")).keys()]
      .filter((property) => property.startsWith("--"))
      .sort();
    const expected = [...light.keys()].map(customProperty).sort();
    expect(declared).toEqual(expected);
  });

  it("cada token con alias se declara como una referencia var() a su destino", () => {
    const rule = declarations(topLevelRule(root, ":root"));
    const wrong = [...light.values()]
      .filter((token) => token.alias !== undefined)
      .filter(
        (token) => rule.get(customProperty(token.path)) !== reference(token)
      )
      .map((token) => token.path);
    expect(wrong).toEqual([]);
  });

  it("hay roles que cambian entre esquemas (si no, el oscuro no hace nada)", () => {
    expect(schemeDependent.length).toBeGreaterThan(0);
  });

  describe.each([
    {
      name: "por preferencia del sistema",
      find: (root: Root) =>
        ruleInMedia(
          root,
          "(prefers-color-scheme: dark)",
          ':root:not([data-scheme="light"])'
        ),
    },
    {
      name: 'forzado con data-scheme="dark"',
      find: (root: Root) => topLevelRule(root, ':root[data-scheme="dark"]'),
    },
  ])("el esquema oscuro $name", ({ find }) => {
    const overridden = () =>
      [...declarations(find(root)).keys()].filter((property) =>
        property.startsWith("--")
      );

    it("redefine todos los roles que cambian con el esquema", () => {
      const missing = schemeDependent
        .map((token) => customProperty(token.path))
        .filter((property) => !overridden().includes(property));
      expect(missing).toEqual([]);
    });

    it("solo redefine roles de color del esquema, nunca primitivos", () => {
      const roles = [...dark.values()]
        .filter((token) => token.file.startsWith("semantic/color."))
        .map((token) => customProperty(token.path));
      expect(overridden().filter((p) => !roles.includes(p))).toEqual([]);
    });

    it("cada rol apunta al primitivo que declara el fichero oscuro", () => {
      const rule = declarations(find(root));
      const wrong = schemeDependent
        .filter(
          (token) =>
            rule.get(customProperty(token.path)) !==
            reference(dark.get(token.path)!)
        )
        .map((token) => token.path);
      expect(wrong).toEqual([]);
    });
  });

  it("indica el color-scheme del navegador en cada caso", () => {
    expect(declarations(topLevelRule(root, ":root")).get("color-scheme")).toBe(
      "light dark"
    );
    expect(
      declarations(topLevelRule(root, ':root[data-scheme="light"]')).get(
        "color-scheme"
      )
    ).toBe("light");
    expect(
      declarations(topLevelRule(root, ':root[data-scheme="dark"]')).get(
        "color-scheme"
      )
    ).toBe("dark");
  });
});
