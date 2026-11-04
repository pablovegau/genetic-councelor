// Ejemplos de uso para el catálogo: el JSX de un componente con las props que se hayan elegido.
export type PropValues = Record<string, string | undefined>;

/** `<Text variant="heading-2" as="h3">Hola</Text>`; omite las props vacías y respeta el orden dado. */
export function jsxSnippet(
  name: string,
  props: PropValues,
  children: string
): string {
  const attributes = Object.entries(props)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => ` ${key}="${value}"`)
    .join("");
  return `<${name}${attributes}>${children}</${name}>`;
}
