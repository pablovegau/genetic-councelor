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
- [ ] Instalar la skill [`landing-page-design`](https://github.com/elayadesign/ai-design-skills) a nivel de proyecto.
  - Leer antes su `SKILL.md` (es lo que el agente va a obedecer) y fijar un commit concreto del repo, no `main`.
  - Usar la **parte A** (intake, estructura, reglas de conversión, build por secciones, SEO). La **parte B** (sistema visual) solo donde no contradiga el brief: prohíbe guiones en el texto (rompe "Torres-Esquius"), limita a una tipografía sin cursivas y manda revelados con mucho movimiento.
  - Si choca con el brief, **manda el brief**: decirlo en el prompt de arranque (ver `docs/prompts/01-home.md`).
- [ ] Elegir hosting (el vídeo usa Cloudflare) y dominio.

## Diseño
- [ ] Dirección visual: comparar 2 o 3 prototipos reales (`/prototype`) antes de elegir. Diseñar primero a ancho de móvil.
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
