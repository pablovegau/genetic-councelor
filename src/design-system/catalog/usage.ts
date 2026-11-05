// Ejemplos de uso para el catálogo: el JSX de un componente con las props que se hayan elegido.
export type PropValues = Record<string, string | undefined>;

/** Las props que no son cadenas: un número se escribe `{3}` y un booleano, suelto (solo si vale «true»). */
export type PropKinds = Record<string, "number" | "boolean">;

/** `<Text variant="heading-2" as="h3">Hola</Text>`; omite las props vacías, respeta el orden dado y, sin contenido, cierra la etiqueta. */
export function jsxSnippet(
  name: string,
  props: PropValues,
  children: string,
  kinds: PropKinds = {}
): string {
  const attributes = Object.entries(props)
    .filter(([, value]) => value !== undefined && value !== "")
    .flatMap(([key, value]) => {
      if (kinds[key] === "boolean") return value === "true" ? [` ${key}`] : [];
      if (kinds[key] === "number") return [` ${key}={${value}}`];
      return [` ${key}="${value}"`];
    })
    .join("");
  return children
    ? `<${name}${attributes}>${children}</${name}>`
    : `<${name}${attributes} />`;
}
