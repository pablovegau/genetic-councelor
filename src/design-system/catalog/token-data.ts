// Datos de tokens para las páginas del catálogo: los ficheros DTCG leídos en el build.
import font from "../tokens/primitive/font.tokens.json";
import motion from "../tokens/primitive/motion.tokens.json";
import shape from "../tokens/primitive/shape.tokens.json";
import space from "../tokens/primitive/space.tokens.json";
import semanticBase from "../tokens/semantic/base.tokens.json";
import { flattenTokens, type FlatToken } from "./tokens";

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
export { font, motion, shape, space };
