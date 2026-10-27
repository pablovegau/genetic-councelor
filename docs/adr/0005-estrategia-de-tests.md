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
- En una máquina nueva hay que ejecutar una vez `pnpm exec playwright install chromium`: los tests de componentes usan un Chromium real.
- `pnpm test` genera antes los tokens (los tests leen el CSS generado). `pnpm coverage` añade el umbral del 90 % sobre la lógica.
- Las expectativas de los tests de componentes se obtienen preguntando al navegador por el valor de la variable de cada token, no con literales: sobreviven a cambiar los valores de los tokens con la dirección visual (comprobado cambiando espaciado, tamaño, interlineado, radio y color).
- Los tests se verifican con mutaciones deliberadas del código y de los tokens: cada rotura hace saltar el test que corresponde.
- **Playwright contra el sitio compilado** (`pnpm test:e2e` compila y ejecuta), en cuatro proyectos: escritorio y móvil, claro y oscuro (se emula `prefers-color-scheme`). La accesibilidad (axe, WCAG 2.2 AA) se comprueba en las cuatro páginas y en los cuatro proyectos; las pruebas de humo (idioma, `noindex`, selector de idioma, 404) solo en uno, porque no dependen del esquema ni del ancho. Se verificó con errores deliberados (botón vacío, imagen sin `alt`, texto sin contraste en oscuro, `noindex` quitado, `aria-current` borrado).
- **VRT:** una captura por sección del catálogo y proyecto (36). Solo se ejecutan en Linux (`test.skip` en otros sistemas). La imagen `mcr.microsoft.com/playwright:v1.64.1-noble` se fija a la misma versión que `@playwright/test`, tanto en la CI como en `scripts/e2e-docker.sh`, que además fija `linux/amd64` porque la CI de GitHub es x86_64 y un Mac con Apple Silicon es arm64.
- Las capturas se regeneran con el workflow manual `Update VRT baselines`, que las sube a la rama; `pnpm test:vrt:update` hace lo mismo en local con Docker. Un workflow lanzable a mano solo aparece cuando existe en la rama por defecto: mientras la PR que lo introduce no se fusione, si la CI rechazara las capturas hay que bajar las actuales del artefacto de la ejecución (`gh run download`) y subirlas.
- El script de Docker fija el almacén de pnpm en el volumen (`npm_config_store_dir`); sin eso pnpm crea un `.pnpm-store/` de cientos de MB dentro del repo.
- Se verificó que el VRT detecta cambios visuales: cambiar el radio `3` y el color `neutral.100` de los tokens rompió 14 de las 36 capturas (las que usan esos valores) y dejó 22 intactas.
- Astro 7 pasa `astro preview` a segundo plano si detecta un agente de IA (variable `CLAUDECODE`), y entonces Playwright cree que el servidor murió. La configuración vacía esas variables solo para ese proceso. Además, Astro admite un único servidor de previsualización por proyecto: si falla con «exited early», `pnpm astro preview stop`.
