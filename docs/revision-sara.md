# Lo que Sara tiene que revisar

Lista viva: se añade lo que Sara debe confirmar, rellenar o aprobar antes de publicar. Al resolver algo, se marca y se anota la fecha. Lo que decide el equipo (no Sara) está en `docs/TODO.md`.

Última actualización: 2026-11-09.

## Para rellenar o confirmar (bloquean la publicación)

- [ ] **Plazo de respuesta al correo.** `/contacto/` dice «Te respondemos en [COMPLETAR] días hábiles». Se fija en `responseDays` (`src/config/contact.ts`). Propuesta: 2 días hábiles.
- [ ] **Prensa: enlaces.** Faltan las URL de las entrevistas y apariciones (El País, La Vanguardia, RTVE, Onda Cero, Telemadrid) y del capítulo del Manual SEHH 2024 (el enlace que tenía estaba roto). Hoy «Sobre mí» solo lista los nombres. Sin enlace verificado no se publica nada.
- [ ] **Resúmenes de las publicaciones (26).** Redactados a partir de los abstracts de PubMed, en español, catalán e inglés (`src/data/publication-notes.json`). Que compruebe que no dicen nada que no sea cierto.
  - [ ] Cinco se basan solo en el título porque PubMed no tiene abstract: Blood Advances 2026 (la más importante), American Journal of Hematology 2026 (TERT), Blood Cancer Journal 2026 (bulbo del pelo y mucosa), Leukemia 2025 (sideroblastos en anillo) y JCO Precision Oncology 2024 (PALB2/RAD51C). Conviene que los reescriba ella.
- [ ] **Orden de las publicaciones destacadas.** Hoy: 1 Blood Advances, 2 JAMA Network Open 2024, 3 British Journal of Haematology 2024; después, por fecha. Los puestos 4 y 5 están libres. El orden entre 2 y 3 lo puse yo.
- [ ] **Datos de la titular:** NIF y domicilio profesional (variables `PUBLIC_LEGAL_NIF` y `PUBLIC_LEGAL_ADDRESS` en Vercel). Confirmar con el gestor si basta una dirección profesional.
- [ ] **IVA incluido en los precios.** Confirmarlo con su gestor.

## Textos que escribimos y debe aprobar

- [ ] **Home, «Así es la primera visita»**: paso 1 («nos cuentas, si quieres, el motivo de tu consulta»), «Qué necesitas» («tus informes médicos a mano») y paso 4 (informe escrito y estudio con el laboratorio).
- [ ] **Qué ocurre tras cada visita:** informe por escrito con lo tratado y la valoración de asesoramiento genético (también en las condiciones de reserva).
- [ ] **Estudio genético y laboratorio** (condiciones de reserva y privacidad): lo realiza un laboratorio independiente (principalmente Health in Code), que factura y cobra al paciente; ella no cobra, no gestiona el pago ni recibe comisión; el precio de la visita no lo incluye; el paciente firma el consentimiento informado con el laboratorio.
- [ ] **«Motivo de la consulta» al reservar:** campo de texto libre y opcional. Se le pide al paciente que no incluya informes ni resultados. Hay que configurarlo así en el formulario de Cal.com.
- [ ] **Página de contacto, blog en construcción y textos de las dos tarjetas de visita** de la home (mismos que `/reservar/`).
- [ ] **Datos estructurados y vista previa al compartir (Open Graph):** nombre, ocupación «Asesora genética», Barcelona, LinkedIn, precios de las dos visitas con IVA incluido; imagen de compartir: su foto principal recortada a 1200×630. Ver que le gusta la foto elegida.

## Legal (con su gestor o abogado)

Los puntos jurídicos están marcados en el código con `REVISAR por gestor/DPO` (`src/components/legal/PrivacyPolicy.astro`) y detallados en `docs/TODO.md`, sección «Páginas legales». Resumen:

- [ ] Base jurídica de los datos de salud que el paciente escriba en «Motivo de la consulta».
- [ ] Comunicación de datos al laboratorio: base jurídica y si el laboratorio es responsable independiente o encargado.
- [ ] Transferencias a EE. UU. (Cal.com, Stripe, Google, Vercel, Resend, Cloudflare).
- [ ] Si el calendario de Cal.com obliga a un aviso de cookies con consentimiento.
- [ ] Desistimiento de 14 días frente a «menos de 48 h, no hay reembolso».
- [ ] Obligaciones de la actividad sanitaria que deban constar en el aviso legal (colegiación, etc.).
- [ ] Traducir al catalán y al inglés el aviso legal, la privacidad y las cookies cuando el texto en castellano esté revisado.

## Traducciones al catalán y al inglés

Las hizo el equipo; Sara las revisa (acordado). Incluyen: toda la web, las condiciones de reserva, los resúmenes de publicaciones y la página del blog.

## Ya hecho (referencia)

- Colores (aprobados el 2026-11-05) y árbol genealógico (pedigrí con sus indicaciones).
- Política de cancelación: cambio o cancelación gratis hasta 48 h antes, reembolso del 100 %.
