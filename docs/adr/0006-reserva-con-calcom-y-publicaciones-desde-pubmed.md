# 0006. Reserva con Cal.com y publicaciones desde PubMed

## Status

Aceptado (2026-11-05). Sustituye a lo que hacía la web antigua (embed de Cal.com en la página, Netlify Forms y PubMed consultado en cada build).

## Context

El éxito de la web es una reserva (`docs/design/brief.md`). La web antigua ya usaba Cal.com (servidor europeo) y PubMed, pero con un evento de prueba, un formulario con mensaje libre (en contra del brief: sin datos de salud al reservar), Netlify Forms (que no existe en Vercel) y un build que publicaba una lista vacía si PubMed fallaba.

## Decision

**Reserva.** Cal.com sigue siendo la herramienta (la gestión de huecos, correos y, si Sara quiere, el cobro con Stripe se configura en su cuenta, no en la web).

- La página `/reservar/` muestra las dos visitas con su precio (120 € la primera, descontable si hay estudio genético; 90 € el seguimiento) y un botón por visita.
- Cada botón es un **enlace directo** a su evento de Cal.com. Con JavaScript, un script mínimo carga el embed de Cal.com **solo cuando se elige una visita** y lo muestra en la página, con el enlace directo como alternativa. La home y la página de reserva no cargan nada de terceros antes de elegir.
- La web **no pide datos de salud** ni tiene formulario de contacto: no hay campos en ninguna página. El contacto escrito llegará con el correo propio de la web.
- Cuenta individual en `cal.com` (revisado en cal.com/europe el 2026-11-06): cal.eu cerró el 1 de noviembre de 2026. El alojamiento europeo («todos los datos se almacenan y procesan dentro de la UE») es solo para el plan Organizations, que es de pago (la página no da precio; solo los antiguos Teams de cal.eu lo reciben gratis). Las cuentas individuales se alojan en EE. UU. Por eso los datos de reserva (nombre y correo) se tratan fuera de la UE: hay que citarlo en la política de privacidad como encargado del tratamiento. No se recogen datos de salud y las visitas, por Meet, no se graban. Si hiciera falta residencia europea, la salida es Organizations.
- Eventos, usuario y precios en `src/config/booking.ts`. Los slugs (`primera-visita`, `seguimiento`) hay que crearlos en Cal.com; un test comprueba el enlace, no que el evento exista.

**Publicaciones.**

- `pnpm publications` (`scripts/update-publications.ts`) consulta PubMed con `"Torres-Esquius S"[Author]`, limpia y ordena (`src/lib/publications.ts`, con tests) y escribe `src/data/publications.json`, que **va en el repo**. El build usa ese fichero y no depende de PubMed.
- Si PubMed falla, devuelve cero resultados o menos de los que ya hay, el script sale con error **sin tocar el fichero**: es mejor publicar la última lista buena que una vacía.
- `.github/workflows/update-publications.yml` lo lanza cada lunes y a mano; si hay cambios abre una PR (la rama dispara la CI a mano, porque los commits del `GITHUB_TOKEN` no lanzan workflows). Al fusionarla, Vercel reconstruye.
- Se descartan fe de erratas y comentarios (`Published Erratum`, `Comment`). La página muestra las 5 más recientes y el resto tras un `<details>` nativo, con el total.

## Consequences

- Hay que crear en Cal.com los dos eventos con esos slugs (o cambiarlos en la config) y decidir si el pago se hace al reservar (Stripe, desde Cal.com) o en la consulta.
- La búsqueda por `Torres-Esquius S` puede traer a un homónimo: las PR de actualización existen para revisarlo. Con ORCID se puede afinar.
- El workflow necesita «Allow GitHub Actions to create and approve pull requests» en los ajustes del repo. `NCBI_EMAIL` (variable) y `NCBI_API_KEY` (secreto) son opcionales.
- Las rutas son iguales en los tres idiomas (`/ca/reservar/`, `/en/reservar/`); si se quieren localizar, el selector de idioma ya conserva la página.
