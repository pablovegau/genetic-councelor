# Astro, con rutas por idioma (español sin prefijo, `/ca` y `/en`)

La web es un sitio de contenido donde el SEO es crítico, el público llega sobre todo desde el móvil y hay tres idiomas. Usamos Astro (salida estática, poco JavaScript) con su i18n: español por defecto sin prefijo, y catalán e inglés bajo `/ca` y `/en`. Cada idioma tiene sus propias páginas, no un traductor en cliente, para que Google indexe cada versión.

Pendiente de esta decisión: las etiquetas `hreflang` y `canonical` necesitan el dominio (`site` en `astro.config.mjs`).
