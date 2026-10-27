# Stack: Astro para las páginas, design system en React con TypeScript estricto y Base UI

Astro 7 se ocupa de páginas, layouts, rutas, i18n, SEO y contenido. El design system y todo componente con lógica se escriben en **React 19 con TypeScript estricto**, con una única implementación: los componentes (Box, Flex, Grid, Text, Icon, Button…) son TSX, Astro los renderiza a HTML en el build y no envía JavaScript salvo que se use una directiva `client:*`. Las partes interactivas son islas React completas (`<SiteHeader client:load />`): Astro compone páginas, no árboles interactivos, porque un componente React no puede importar `.astro` y los hijos que Astro le pasa llegan como HTML y no como nodos React (salvo con `experimentalReactChildren`).

Comportamiento y accesibilidad: HTML nativo primero (`<details>`, `<dialog>`, `popover`) y, para widgets complejos, **Base UI** (`@base-ui/react`, MIT, estable desde la 1.0 de diciembre de 2025, sin estilos y compatible con CSS Modules). Los estilos no cambian: CSS Modules, tokens y style props como atributos `data-*`.

Herramientas: ESLint (typescript-eslint, jsx-a11y, eslint-plugin-astro) y Prettier con `prettier-plugin-astro`. TypeScript se fija en la 6 mientras `astro check` no soporte la 7, y el build falla si hay errores de tipos.

Notas de Base UI: los popups usan portales, así que la raíz de la aplicación lleva `isolation: isolate`; y en Safari de iOS 26 los fondos de los popups requieren `body { position: relative }`.

## Considered Options

- **Primitivos en Astro y React a la vez:** descartado. Obligaba a duplicarlos y a mantenerlos sincronizados.
- **React Aria Components y Radix:** descartados por decisión del proyecto en favor de Base UI.
- **Biome en lugar de ESLint más Prettier:** descartado. Su documentación marca el soporte de `.astro` como experimental (el formateador hay que activarlo explícitamente y el linter puede dar falsos positivos).

## Consequences

- Los primitivos hechos en Astro (ADR 0003) se portan a TSX. Se conservan los tokens, el generador de style props, el CSS y la lógica del catálogo; cambia solo la envoltura.
- El generador de style props pasa a exportar las escalas como listas `as const`, para que el catálogo no necesite casts.
- React solo añade JavaScript a las páginas que tengan islas. Comprobado: con los primitivos en React y sin directivas `client:*`, el HTML no lleva envoltorios `astro-slot` ni scripts; `dist` conserva un `client.*.js` (runtime de React) que ninguna página carga.
- Los tipos polimórficos (`as` más los atributos del elemento elegido) hacen que un nombre de prop mal escrito sea un error de tipos.
- El hook de pre-commit (Husky) ejecuta lint-staged (Prettier y ESLint) y `astro check`; los tests se añadirán cuando existan.
