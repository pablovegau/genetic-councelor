# TODO: arranque de la web de Sara Torres-Esquius

Lista a grandes rasgos. Base: `docs/design/brief.md`, `CONTEXT.md` y la guía del vídeo (`docs/references/tutorial-landing-claude-code.html`).

**Para empezar a construir solo bloquean:** ver el vídeo (el commit/push y Astro con i18n ya están hechos). Lo de "Pendiente de negocio" se cierra en paralelo.

## Base técnica
- [x] Usar **Astro** (rápido, SEO y poco JavaScript). Ver `docs/adr/0001-astro-con-rutas-por-idioma.md`.
- [x] Preparar **i18n**: español por defecto, catalán e inglés (`/ca`, `/en`). Esqueleto con selector de idioma y portada mínima por idioma.
- [ ] Añadir `hreflang` y `canonical` en el `<head>` cuando tengamos dominio (`site` en `astro.config.mjs`).
- [ ] Opcional: validación de tipos con `@astrojs/check` y `typescript`.
- [ ] Añadir a `CLAUDE.md` cómo arrancar el servidor: `astro dev --background`, y `astro dev stop`, `status` y `logs`.

## Vercel
- [ ] Conectar el repo; una web estática de Astro no necesita adaptador.
- [ ] `site` con la URL de Vercel mientras no haya dominio (canonical y sitemap salen de ahí).
- [ ] `noindex` mientras la web sea un esqueleto, para que Google no indexe la página en construcción. Quitarlo al publicar.
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

## Design system (ver `docs/adr/0002-tokens-dtcg-con-terrazzo.md`)
- [x] Tokens primitivos y semánticos en DTCG 2025.10 con Terrazzo; tema `default` con esquemas claro y oscuro (`data-scheme`). Valores neutros de placeholder.
- [ ] Sustituir los placeholders por los valores reales cuando haya dirección visual (colores, tipografía, radios).
- [ ] Primitivos de UI: Box, Flex, Grid, Text, Icon. Decidir el mecanismo de estilos (recomendado: CSS Modules + custom properties, props mapeados por atributo) y el catálogo (recomendado: página interna en Astro).
- [ ] Button = Flex + Icon + Text; luego componentes mayores. Los tokens de componente se crean con cada componente.
- [ ] Tipografía semántica junto al componente Text. Verificar antes la forma del tipo `typography` de DTCG (no la pude leer entera).
- [ ] Interruptor de esquema: `data-scheme` + `localStorage` + script en el `<head>` para evitar el parpadeo, cuando exista el componente.
- [ ] Fotos de Sara con fondo blanco de plató en modo oscuro: decidir marco/tarjeta, recorte o zona clara.
- [ ] Menú móvil del repo antiguo como componente: conservar la X, la tarjeta lateral y el botón de reservar abajo; corregir panel con scroll en pantallas bajas, `inert` cuando está cerrado, `prefers-reduced-motion`, breakpoint más alto y selector ES/CA/EN.

## Diseño
- [ ] Dirección visual: comparar 2 o 3 prototipos reales (`/prototype`) antes de elegir. Cada prototipo es una variante de valores de los tokens, no un diseño aparte. Diseñar primero a ancho de móvil.
- [ ] Esqueleto previsible: hero con reserva, situaciones, primera visita en pasos, precios, Sara, FAQ.
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
