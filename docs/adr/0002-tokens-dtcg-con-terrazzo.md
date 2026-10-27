# Tokens de diseño en formato DTCG 2025.10, generados con Terrazzo

El design system se apoya en tokens en JSON según la especificación W3C Design Tokens 2025.10 (módulos Format, Color y Resolver), en `src/design-system/tokens/`: `primitive/` (valores), `semantic/` (solo alias a primitivos; `base` más `color.light` y `color.dark`) y un `tokens.resolver.json` que define el tema `default` con un modificador `scheme` (claro/oscuro). Terrazzo los compila a `tokens.generated.css` (no versionado, se regenera con `pnpm tokens`): conserva los alias como `var()`, mantiene `oklch`, y emite el claro por defecto, el oscuro por `prefers-color-scheme` y ambos forzables con `data-scheme`.

Reglas: colores en `oklch` con objetos DTCG (nunca hex como cadena); nombres sin puntos ni `$` y escalas con pasos enteros; los tokens semánticos solo referencian primitivos; los tokens de componente no existen hasta que exista el componente, y entonces se añaden aquí mismo.

## Considered Options

- **Style Dictionary 5.7.1:** lee los ficheros 2025.10 (colores, dimensiones y alias), pero aplana los alias y convierte `oklch` a hex sRGB. Probado: al recibirle un `.resolver.json` genera un `:root {}` vacío y termina sin error, así que los temas obligarían a un build por tema. Descartado porque el resolver es la forma que fija la especificación para claro y oscuro.

## Consequences

- Terrazzo es una herramienta más joven (2.10.0); la comprobación hecha fue con un conjunto pequeño de tokens.
- pnpm no ejecuta scripts `pre*`: `pnpm dev` y `pnpm build` generan los tokens, pero `pnpm astro dev` a secas no. Hay que lanzar `pnpm tokens` antes.
- Los valores actuales son neutros a propósito: la dirección visual los sustituirá sin tocar la estructura.
