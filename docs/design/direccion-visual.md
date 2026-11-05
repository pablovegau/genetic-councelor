# Dirección visual (borrador, pendiente de revisar con Sara)

Salió de varias rondas de prototipos. Los valores concretos pueden cambiar tras la revisión con Sara; la estructura de roles no.

## Concepto

El **árbol genealógico** (pedigrí) como lenguaje visual propio: hero, viñetas de las listas y línea del proceso. Se anima una vez al cargar y sus símbolos explican qué significan. Las definiciones de los símbolos son de ejemplo y las valida Sara.

## Color, por funciones

La paleta no depende de ninguna foto (las fotos cambiarán): se justifica por el brief (cercana, con experiencia, serena; nada alarmista ni vendedora), el sector y la accesibilidad.

| Función | Color | Uso |
|---|---|---|
| Base | neutral (gris con un matiz frío) | fondos, texto, bordes |
| Acción | violet | botón principal, enlaces, foco |
| Acento | orange | apoyos y detalles cálidos |
| Peligro | red | errores y avisos, no decoración |
| Tinte | violet, orange, red claros | fondos de sección con un toque de color |

Ritmo de página: base, gris con un toque de color, base… con una franja de color arriba de cada franja teñida. Un único botón principal por pantalla ("Reservar cita").

## Tipografía

Funnel Display (titulares) y Funnel Sans (texto), servidas desde el propio dominio. Falta comprobar la cobertura de ñ, ç y l·l.

## Estructura de la home

Hero, «Sobre mí» justo debajo, situaciones, primera visita (4 pasos horizontales con iconos), cierre y pie (sin valoraciones: el brief dice que no habrá testimonios); menú con selector ES/CA/EN, «Reservar cita» e interruptor de esquema. Fotos solo de estudio por ahora.

## Dónde está

Prototipos en la rama `proto/direccion-visual` (solo local de momento), en `/prototype/home`, `/prototype/paletas` y las rondas anteriores. El sistema real vive en `src/design-system/` y se revisa en `/design-system/`.
