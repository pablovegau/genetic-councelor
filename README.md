# Web de Sara Torres-Esquius

Web de asesoramiento genético (Astro, en castellano, catalán e inglés), desplegada en Vercel.
Diseño y decisiones: `docs/design/` y `docs/adr/`. Vocabulario: `CONTEXT.md`.

## Comandos

| Comando                | Qué hace                                                                        |
| ---------------------- | ------------------------------------------------------------------------------- |
| `pnpm dev`             | Servidor de desarrollo, con el catálogo del design system en `/design-system/`. |
| `pnpm build`           | Comprueba tipos y compila la web de producción en `dist/` (sin el catálogo).    |
| `pnpm test`            | Tests unitarios y de componentes.                                               |
| `pnpm test:e2e`        | Compila (con reservas y catálogo) y pasa Playwright: accesibilidad, humo y VRT. |
| `pnpm test:e2e:docker` | Lo mismo en la imagen de la CI. `pnpm test:vrt:update` regenera las capturas.   |

## Variables de entorno

Todas son públicas (`PUBLIC_`): se incrustan al compilar, así que **al cambiarlas en Vercel hay que
redesplegar**. La plantilla está en `.env.example`; en local se copia a `.env.local`, que no se sube.

| Variable                     | Para qué sirve                                                                                                                                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_CAL_BOOKING_ENABLED` | `true` activa las reservas con Cal.com. Ausente (por defecto) o distinto de `true`: `/reservar/` muestra «Las reservas se abrirán muy pronto» y la web no enlaza a Cal.com ni carga nada suyo. |
| `PUBLIC_LEGAL_NIF`           | NIF del titular, para el aviso legal y la política de privacidad.                                                                                                                              |
| `PUBLIC_LEGAL_ADDRESS`       | Domicilio del titular. Mientras falten, las páginas legales muestran «Pendiente de completar».                                                                                                 |
| `PUBLIC_ALLOW_INDEXING`      | `true` quita el `noindex`. Con `true` el build falla si faltan el NIF o el domicilio.                                                                                                          |

### Activar las reservas

1. En Cal.com (`cal.com/saratorresesquius`): eventos `primera-visita` (60 min, 120 €) y `seguimiento` (45 min, 90 €), visibles y con Stripe conectado.
2. En Vercel, Settings → Environment Variables: `PUBLIC_CAL_BOOKING_ENABLED=true` (Production y, si se quiere probar, Preview).
3. Redesplegar. El usuario y los eventos se cambian en `src/config/booking.ts`, el único sitio donde viven.

Con las reservas activas, el calendario de Cal.com solo se carga cuando se pulsa «Ver horarios» o se abre
`/reservar/?visita=primera-visita` (o `#seguimiento`), y las políticas de privacidad y de cookies lo explican.
