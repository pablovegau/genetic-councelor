// Lee los tokens y escribe los style props generados. Se ejecuta con `pnpm tokens`.
import { readFileSync, writeFileSync } from "node:fs";
import { buildStyleProps, type TokenSources } from "./style-props.ts";

const root = new URL("../src/design-system/", import.meta.url);
const read = (path: string) =>
  JSON.parse(readFileSync(new URL(path, root), "utf8"));

const sources: TokenSources = {
  space: read("tokens/primitive/space.tokens.json"),
  font: read("tokens/primitive/font.tokens.json"),
  shape: read("tokens/primitive/shape.tokens.json"),
  colorPrimitive: read("tokens/primitive/color.tokens.json"),
  colorLight: read("tokens/semantic/color.light.tokens.json"),
  base: read("tokens/semantic/base.tokens.json"),
};

const { css, ts } = buildStyleProps(sources);
writeFileSync(new URL("style-props.generated.css", root), css);
writeFileSync(new URL("style-props.generated.ts", root), ts);
console.log(`style props: ${css.match(/\[data-/g)?.length} reglas`);
