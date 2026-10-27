# Estrategia de tests: Vitest, componentes en navegador real y VRT con Playwright en CI Linux

Se prueban contratos y comportamiento, no HTML. Las capas son:

- **Unitarios (Vitest, Node):** tokens (todos los alias resuelven, claro y oscuro tienen las mismas claves y el **contraste WCAG** de cada par texto/fondo cumple en ambos esquemas), generador de style props, helpers y paridad de claves de i18n entre ES, CA y EN.
- **Componentes (Vitest en modo navegador con `@vitest/browser-playwright` más Testing Library):** props, roles ARIA, foco y teclado en un Chromium real, con el CSS verdadero (capas, custom properties).
- **Accesibilidad:** axe con Playwright sobre el catálogo y las páginas.
- **VRT (`toHaveScreenshot` de Playwright):** el catálogo, con cada variante en claro y oscuro y en dos anchos; después, las páginas clave.
- **E2E mínimos (Playwright):** el menú con teclado (los fallos del repo antiguo como pruebas de regresión), el cambio de idioma y las metas `noindex` y `hreflang`.

Los VRT se generan y se comparan **solo en CI Linux**: Playwright guarda una captura base por plataforma y avisa de que el renderizado varía con el sistema. En local se ejecutan mediante un script Docker con la misma imagen, y las bases se actualizan con un flujo manual de CI. Para que sean deterministas: fuentes servidas desde el propio dominio, animaciones desactivadas, datos de la API de publicaciones con *fixtures* y sin red.

Cobertura: umbral solo sobre la lógica; los componentes de presentación se protegen con VRT y con unos pocos tests de contrato. Se usa la skill `tdd` para la lógica.

## Considered Options

- **jsdom o happy-dom para los componentes:** descartados. No reproducen el CSS real ni el comportamiento del foco, de los que dependen nuestros componentes.
- **Bases de VRT también en macOS:** descartado. No es reproducible frente a CI.
- **API Container de Astro para probar componentes `.astro`:** no se usa. La documentación la marca como experimental y el design system es React.

## Consequences

- Hace falta un workflow de GitHub Actions (lint, tipos, unitarios, componentes, build, a11y y VRT) y las bases de VRT viven en el repositorio.
- Vitest 5 y Playwright se instalan como dependencias de desarrollo; los navegadores de Playwright, en CI.
