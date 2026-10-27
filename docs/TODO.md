# TODO: arranque de la web de Sara Torres-Esquius

Lista a grandes rasgos. Base: `docs/design/brief.md`, `CONTEXT.md` y la guía del vídeo (`docs/references/tutorial-landing-claude-code.html`).

**Para empezar a construir solo bloquean:** ver el vídeo (el commit/push y Astro con i18n ya están hechos). Lo de "Pendiente de negocio" se cierra en paralelo.

## Base técnica
- [x] Usar **Astro** (rápido, SEO y poco JavaScript). Ver `docs/adr/0001-astro-con-rutas-por-idioma.md`.
- [x] Preparar **i18n**: español por defecto, catalán e inglés (`/ca`, `/en`). Esqueleto con selector de idioma y portada mínima por idioma.
- [ ] Añadir `hreflang` y `canonical` en el `<head>` cuando tengamos dominio (`site` en `astro.config.mjs`).
- [ ] Opcional: validación de tipos con `@astrojs/check` y `typescript`.
- [ ] Instalar la skill [`landing-page-design`](https://github.com/elayadesign/ai-design-skills) a nivel de proyecto.
  - Leer antes su `SKILL.md` (es lo que el agente va a obedecer) y fijar un commit concreto del repo, no `main`.
  - Aporta intake, estructura de página, copy de conversión y sistema visual (tipografía, espaciado, movimiento). SEO y estrategia no constan en la ficha del repo: comprobarlo.
  - Si choca con el brief, **manda el brief**.
- [ ] Elegir hosting (el vídeo usa Cloudflare) y dominio.

## Diseño
- [ ] Dirección visual: comparar 2 o 3 prototipos reales (`/prototype`) antes de elegir. Diseñar primero a ancho de móvil.
- [ ] Esqueleto previsible: hero con reserva, situaciones, primera visita en pasos, precios, Sara, FAQ.
- [ ] Árbol genealógico como elemento visual: aspecto de dibujo a mano, generado por ordenador.

## Contenido
- [x] Fotos optimizadas a WebP y sRGB (`docs/design/assets/web/`).
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

## Pendiente de negocio
- [ ] Herramienta de reserva, correo propio de la web y dominio.
- [ ] Textos legales (aviso legal, privacidad, cookies) tomando como base los de [Precongenia](https://www.precongenia.es/pol%C3%ADtica-de-privacidad) y [ConGen](https://www.congen.es/politica-de-privacidad/). Titular: Sara Torres-Esquius, persona física. Y frase de confidencialidad junto al botón de reservar.

## Descartado (a propósito)
- Fondo de vídeo generado con IA que avanza con el scroll: no encaja con el tono sereno y previsible del brief.
- Alterar o ampliar las fotos de Sara con IA.

## Antes de seguir
- [ ] Ver el vídeo entero y rellenar la lista de comprobación de la guía.
- [ ] Pasar el enlace al repo del autor (en la descripción del vídeo) con su archivo de prompts, para compararlo con el brief.
- [x] Commit y push de Astro, fotos, guía y TODO.
