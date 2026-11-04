// Datos de tokens para las páginas del catálogo: los ficheros DTCG leídos en el build.
import font from "../tokens/primitive/font.tokens.json";
import motion from "../tokens/primitive/motion.tokens.json";
import shape from "../tokens/primitive/shape.tokens.json";
import space from "../tokens/primitive/space.tokens.json";
import semanticBase from "../tokens/semantic/base.tokens.json";
import typography from "../tokens/semantic/typography.tokens.json";
import { flattenTokens, resolveValue, type FlatToken } from "./tokens";

/** Todos los primitivos por su ruta, para resolver los alias de los semánticos. */
export const primitiveLookup = new Map<string, unknown>(
  [space, shape, font, motion].flatMap((tree) =>
    flattenTokens(tree).map(({ path, value }) => [path, value] as const)
  )
);

/** Tokens de un grupo (por prefijo de ruta, por ejemplo `font.size.`). */
export const tokensOf = (tree: Record<string, unknown>, prefix: string) =>
  flattenTokens(tree).filter(({ path }) => path.startsWith(prefix));

export const semantic: FlatToken[] = flattenTokens(semanticBase);
export const typographyTokens: FlatToken[] = flattenTokens(typography);

/** Valores finales de un estilo de texto: tamaño en px, peso, interlineado y tracking. */
export function typographySpec(style: string) {
  const resolved = (property: string) =>
    resolveValue(
      typographyTokens.find(
        ({ path }) => path === `typography.${style}.${property}`
      )?.value,
      primitiveLookup
    );
  const size = resolved("font-size") as { value: number };
  return {
    px: size.value * 16,
    weight: resolved("font-weight"),
    lineHeight: resolved("line-height"),
    tracking: resolved("letter-spacing"),
  };
}
export { font, motion, shape, space };
