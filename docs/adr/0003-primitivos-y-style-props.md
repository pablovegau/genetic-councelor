# Primitivos de UI con CSS Modules y style props como atributos `data-*`

> **Actualización:** el mecanismo (CSS Modules, capas, style props generados desde los tokens) sigue vigente. La implementación pasa de componentes Astro a **React** (ADR 0004): donde este texto dice "componentes Astro", léase TSX.

Los componentes del design system son componentes Astro sin JavaScript en cliente. Box, Flex, Grid, Text e Icon son los primitivos, y se componen entre sí: Flex, Grid y Text son un Box con props propios. Su estilo estructural vive en CSS Modules dentro de la capa de cascada `components`. Los *style props* (`p`, `gap`, `bg`, `size`, `minColumn`…) se renderizan como atributos `data-*` y los resuelven reglas CSS generadas desde los tokens por `scripts/build-style-props.mjs` (se ejecuta con `pnpm tokens`) en la capa `props`. El orden de capas es `base` < `components` < `props`, de modo que lo que pasa quien usa el componente gana a los valores por defecto del componente.

Cada prop acepta exactamente los pasos de su escala de tokens, y los tipos de TypeScript se generan de la misma fuente, así que una escala nueva en los tokens aparece sola en las reglas y en los tipos. Los componentes no usan estilos en línea ni valores sueltos.

Fuera de alcance por ahora: props responsivos (para rejillas se usa `minColumn`, que reparte columnas según un ancho mínimo sin media queries), márgenes, variantes semánticas de Text y sombras.

El catálogo es una página interna de Astro (`/design-system/`), siempre con `noindex`. Si en el futuro hiciera falta Storybook, se añade entonces.

## Considered Options

- **Utilidades de Terrazzo (`utility`):** probadas. Generan clases con nombres como `.bg-colorpage`, no tienen padding direccional y atan los nombres a la herramienta. Descartadas.
- **Tailwind:** descartado. Duplicaría la fuente de verdad de los tokens.
- **Custom properties en línea (`style="--p: …"`):** descartado. Rompe la norma de no usar estilos en línea y no limita los valores a la escala sin pasos extra.

## Consequences

- Los ficheros `style-props.generated.*` no se versionan: hay que lanzar `pnpm tokens` en un clon nuevo. `pnpm dev` y `pnpm build` ya lo hacen.
- La página de catálogo se publica en Vercel con `noindex`. Al lanzar hay que decidir si se excluye del build de producción o se protege.
