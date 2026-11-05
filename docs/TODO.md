# TODO: arranque de la web de Sara Torres-Esquius

Lista a grandes rasgos. Base: `docs/design/brief.md`, `CONTEXT.md` y la guía del vídeo (`docs/references/tutorial-landing-claude-code.html`).

**Para empezar a construir solo bloquean:** ver el vídeo (el commit/push y Astro con i18n ya están hechos). Lo de "Pendiente de negocio" se cierra en paralelo.

## Base técnica
- [x] Usar **Astro** (rápido, SEO y poco JavaScript). Ver `docs/adr/0001-astro-con-rutas-por-idioma.md`.
- [x] Preparar **i18n**: español por defecto, catalán e inglés (`/ca`, `/en`). Esqueleto con selector de idioma y portada mínima por idioma.
- [ ] Añadir `hreflang` y `canonical` en el `<head>` cuando tengamos dominio (`site` en `astro.config.mjs`).
- [x] Validación de tipos con `@astrojs/check` y `typescript@6` (el build falla si hay errores). Ver el plan técnico.
- [ ] Añadir a `CLAUDE.md` cómo arrancar el servidor: `astro dev --background`, y `astro dev stop`, `status` y `logs`.

## Vercel
- [x] Conectar el repo; una web estática de Astro no necesita adaptador.
- [x] `site` con la URL de Vercel mientras no haya dominio (canonical y sitemap salen de ahí).
- [x] `noindex` mientras la web sea un esqueleto, para que Google no indexe la página en construcción. Quitarlo al publicar.
- [ ] Caché de `/_astro/` en `vercel.json` si hace falta (el `_headers` del repo de referencia es de Cloudflare).

## SEO (patrón del repo de referencia)
- [ ] `@astrojs/sitemap` con i18n, `robots.txt` y `llms.txt` generados desde `site`.
- [ ] Canonical y `hreflang` por idioma (`es`, `ca`, `en`) más `x-default`.
- [ ] Imagen para redes de 1200×630, favicon y manifest, `h1` único por página, 404 con `noindex`, enlace "saltar al contenido".
- [ ] Datos estructurados en un solo grafo: `Person` (con ORCID en `sameAs`) y servicio profesional. Verificar antes si el `FAQPage` aporta algo: Google restringe esos resultados en salud.
- [ ] Fuentes servidas desde el propio dominio con la API de fuentes de Astro (cuando se elija tipografía).
- [x] Skill [`landing-page-design`](https://github.com/elayadesign/ai-design-skills): leída y **no instalada** (decisión, versión `ded7efc9d5`). Las reglas de conversión de su parte A ya van dentro de `docs/prompts/01-home.md`. Motivos: su parte B choca con el brief, y sus reglas de "contenido realista" y de "asumir y seguir" chocan con no inventar nada en una web de salud.
- [x] Hosting: Vercel (https://genetic-councelor.vercel.app/).
- [ ] Elegir dominio.

## Plan técnico (ADR 0004 y 0005), por orden
- [x] 1. Herramientas (hecho; el hook de pre-commit ejecuta lint-staged y typecheck, y se le añadirá `test` con el paso 3): TypeScript 6 estricto con `astro check` en el build, ESLint 10 (typescript-eslint, jsx-a11y, eslint-plugin-astro) y Prettier con `prettier-plugin-astro`. Scripts `check`, `lint` y `format`. Hook de pre-commit con la skill `setup-pre-commit` (Husky y lint-staged).
- [x] 2. React (hecho): `@astrojs/react`, `react`, `react-dom`. Portar Box, Flex, Grid, Text e Icon a TSX. El generador exporta las escalas como `as const` (sin `as never`). El catálogo sigue siendo una página Astro.
- [x] 3. Unitarios con Vitest 5 (hecho; seams S1 tokens, S2 CSS generado, S3 generador, S4 helpers y contrato): tokens (alias, paridad claro/oscuro, contraste WCAG), generador y helpers.
- [x] 4. Componentes con Vitest en modo navegador (hecho para Box, Flex, Grid, Text e Icon) (`@vitest/browser-playwright`) y Testing Library.
- [x] 5. (hecho, PR #1) Playwright: axe y VRT del catálogo, ejecutados en CI Linux con script Docker local. Workflow de GitHub Actions.
- [ ] 6. Base UI (`@base-ui/react`): instalado con Button. Falta usarlo en el primer widget compuesto (menú, diálogo), con la cabecera. Recordar `isolation: isolate` en la raíz y `body { position: relative }` para Safari de iOS 26.
- [x] `main` protegida: la comprobación `verify` es obligatoria, también para administradores, y se entra por PR. Para saltarla en una emergencia, desactivarlo en Settings → Branches.
- [x] `update-vrt.yml` validado de extremo a extremo y la versión de Playwright vigilada por un test (`scripts/playwright-version.test.ts`).
- [ ] Pruebas que dependen de funcionalidad futura: el menú con teclado (cuando exista), `hreflang` y `canonical` (cuando haya dominio) y la paridad de claves de i18n (cuando haya diccionarios).

## Design system (ver `docs/adr/0002-tokens-dtcg-con-terrazzo.md`)
- [x] Tokens primitivos y semánticos en DTCG 2025.10 con Terrazzo; tema `default` con esquemas claro y oscuro (`data-scheme`). Valores neutros de placeholder.
- [x] Colores reales: rampas `neutral`, `violet`, `orange` y `red` en oklch y roles `action`, `accent`, `danger`, `tint` y `focus` (ver `docs/design/direccion-visual.md`). Pendiente de revisar con Sara.
- [x] Tipografía real: Funnel Display y Funnel Sans servidas desde el propio dominio y estilos de texto semánticos como tokens. Pendiente: comprobar la cobertura del catalán con texto real y definir los radios definitivos.
- [x] Primitivos de UI: Box, Flex, Grid, Text, Icon, con style props generados desde los tokens y catálogo interno en `/design-system/` (ver `docs/adr/0003-primitivos-y-style-props.md`).
- [ ] Decidir al lanzar si el catálogo se excluye del build de producción (hoy es público con `noindex`).
- [ ] Props que faltan según se necesiten: márgenes, props responsivos, sombras.
- [ ] Set de iconos definitivo (hoy 4 trazos placeholder) y favicon.
- [x] Button (`src/design-system/components/Button`, Base UI para el botón y `<a>` con `href`): solo primario, tamaños md y sm, hover de solo color (sin subir ni sombra, decisión de Pablo). Tokens de componente en `tokens/component/button.tokens.json`. Pendiente más adelante: icono, variantes y trabajar mejor el hover/active.
- [x] Componentes extraídos de la home (ver `docs/adr/0003-primitivos-y-style-props.md`, última sección): Section/Container, Split, Link, Wordmark, Byline, Portrait, MarkerList, Steps, LanguageSwitch, Footer (React) y FamilyTree y SchemeToggle (Astro, con script mínimo). Cada uno con tests, página de catálogo y, si procede, tokens de componente (`section`, `steps`). `SiteHeader`, `SiteFooter` y `Home` solo los componen.
- [ ] Componentes mayores que aún no existen (formulario de reserva, FAQ, tarjetas de precio). Los tokens de componente se crean con cada componente.
- [ ] Revisar tras extraer: los titulares de la home usan ahora las variantes de `Text` (`heading-1`/`heading-2`) en vez de los `clamp()` de la maqueta, y el texto de los párrafos es `text` (1 rem). Cambio visual pequeño; ajustar con `size` si algo se ve flojo.
- [x] Tipografía semántica como tokens (cinco alias por estilo, sin el tipo compuesto `typography`). Falta el componente de texto que los use, con la reducción de los titulares en móvil.
- [x] Interruptor de esquema (`SchemeToggle.astro`): `data-scheme` + `localStorage` + script en el `<head>` contra el parpadeo, y un icono que pasa de sol a luna con estrellas (de un CodePen de Pablo). Anima `r` y `cx` por CSS **con unidad** (`9px`): sin ella Chromium lo acepta y Safari y Firefox no, y la luna no se forma. Una prueba corre en Chromium, WebKit y Firefox. El cambio de esquema se hace con una View Transition (fundido de 200 ms de toda la página); con movimiento reducido o sin soporte cambia de golpe, y un cambio del esquema del sistema sigue siendo instantáneo.
- [ ] Fotos de Sara con fondo blanco de plató en modo oscuro: decidir marco/tarjeta, recorte o zona clara.
- [x] Menú móvil del repo antiguo como componente (`MobileMenu`, con `Dialog` de Base UI): hamburguesa que pasa a X, tarjeta lateral con cristal esmerilado, botón de reservar y selector ES/CA/EN abajo, no modal (solo se cierra con la X, Escape o eligiendo un enlace; la cabecera sigue libre para, p. ej., cambiar el esquema), `inert` en `main` y `footer`, scroll bloqueado, scroll interno en pantallas bajas, `prefers-reduced-motion` y cierre al pasar a escritorio. Sin adorno de fondo: se probaron un círculo y el árbol genealógico atenuado y no aportaban (decisión de Pablo). Breakpoint en 48 rem: subirlo si la cabecera no cabe.

## Diseño
- [x] Dirección visual elegida tras varias rondas de prototipos (ver `docs/design/direccion-visual.md`). Falta la revisión con Sara.
- [x] Home real a partir de la maqueta, en es/ca/en (`src/components/Home.astro`, textos en `src/i18n/`). Los textos de ca y en son traducciones del español, pendientes de revisar. Las piezas viven en el design system (`src/design-system/components/`) y `src/styles/site.css` solo guarda los ajustes globales; los enlaces de reserva, legal y redes apuntan a anclas hasta tener herramienta de reserva y textos.
- [ ] Esqueleto previsible, lo que falta: precios, FAQ y una puerta por cada situación.
- [ ] Árbol genealógico como elemento visual: aspecto de dibujo a mano, generado por ordenador.

## Contenido
- [x] Fotos optimizadas a WebP y sRGB (`docs/design/assets/web/`).
- [ ] Todo el contenido en ficheros de datos, uno por idioma con la misma forma (`src/data/`), que alimenten páginas, JSON-LD y `llms.txt`.
- [ ] Marcador de pendientes visible solo con `pnpm dev` y que nunca llegue al build (precios sin cerrar, legales, textos sin validar).
- [ ] Regla: no inventar nada (ni titulaciones, ni cifras, ni testimonios, ni precios). Lo no verificado se marca como pendiente.
- [ ] Redactar los textos en español; luego catalán e inglés.
- [ ] Que Sara revise la descripción de la primera visita.
- [ ] Publicaciones por API (ORCID): 5 visibles, botón "más" y total.
- [ ] Sección de prensa con los medios ya recopilados.
- [ ] Página corta "Qué puede salir de un estudio genético".

## Método (del vídeo)
- [ ] Pedir plan y coste antes de ejecutar nada de pago o difícil de revertir.
- [ ] Construir por secciones y validar cada una (home → una situación → primera visita).
- [ ] Pasar el brief a spec y tickets (`/to-spec`, `/to-tickets` en `.scratch/`).
- [ ] Guardar prompts y decisiones en el repo.
- [ ] Medir peso y tiempo de carga en móvil como criterio de aceptación.

## Calidad
- [ ] SEO: una página por situación, títulos por intención de búsqueda, "test genético" y "consejo genético" explicados en el cuerpo y las FAQ.
- [ ] Accesibilidad y rendimiento en móvil.
- [ ] Cada elemento interactivo con sus estados (hover, activo, foco visible, error), sin enlaces muertos, 404 propia, texto alternativo en las imágenes con significado y HTML semántico.
- [ ] Revisión antes de dar algo por hecho: `pnpm build` sin errores, consola limpia, viewport de 390×844, `prefers-reduced-motion`, y probar con un navegador de pruebas, no con el Chrome de Pablo.

## Pendiente de negocio
- [ ] Herramienta de reserva, correo propio de la web y dominio.
- [ ] Textos legales (aviso legal, privacidad, cookies) tomando como base los de [Precongenia](https://www.precongenia.es/pol%C3%ADtica-de-privacidad) y [ConGen](https://www.congen.es/politica-de-privacidad/). Titular: Sara Torres-Esquius, persona física. Y frase de confidencialidad junto al botón de reservar.

## Descartado (a propósito)
- Fondo de vídeo generado con IA que avanza con el scroll: no encaja con el tono sereno y previsible del brief.
- Alterar o ampliar las fotos de Sara con IA.
- Copiar código del repo de referencia (`midudev/mcp-higgsfield-landing`): no declara licencia. Solo reutilizamos ideas.

## Antes de seguir
- [ ] Ver el vídeo entero y rellenar la lista de comprobación de la guía.
- [ ] Pasar el enlace al repo del autor (en la descripción del vídeo) con su archivo de prompts, para compararlo con el brief.
- [x] Commit y push de Astro, fotos, guía y TODO.
