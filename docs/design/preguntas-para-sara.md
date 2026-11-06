# Preguntas para Sara

Lista revisada contra `docs/design/brief.md`, `docs/prompts/01-home.md` y `CONTEXT.md`. Lo que ya está contestado no se vuelve a preguntar. Los colores los aprobó Sara el 2026-11-05.

## Ya respondido en el brief (no preguntar)

- Voz: «nosotros» en la home y los servicios; tercera persona en la trayectoria.
- Solo consultantes adultos; los menores quedan fuera de alcance.
- Precios visibles: primera visita 120 €, descontable si se hace un estudio genético; seguimiento 90 €.
- Sin teléfono. Titular legal: Sara Torres-Esquius, persona física.
- Trayectoria que se puede mencionar, siempre como texto y sin logos: más de 10 años en genética; asesora genética en el Hospital Vall d'Hebron (desde 2021) y en la Clínica Corachan-IDOC (desde 2025); vocal de la Junta Directiva de SEAGen; profesora vinculada en la UAB (desde 2025); publicaciones; prensa y manual SEHH 2024.
- Situaciones: cáncer hereditario, reproductivo (preconcepcional y prenatal), cardiogenética, enfermedades raras y resultados de tests comerciales.
- Idiomas: español (principal), catalán e inglés.
- El árbol genealógico sigue las guías de la NSGC.
- **No habrá testimonios de consultantes** (decisión del brief: se quita la sección de valoraciones).

## Respondido por Sara (2026-11-05)

### Reserva y cobro

- [x] Cobro: reserva de 20 € al reservar (Stripe desde Cal.com) y, al terminar la sesión, un correo con el enlace de pago del resto. **Política de cancelación propuesta por Sara, pendiente de cerrar:** más de 48 h y quieres reagendar, se mantiene la reserva; cancelas con menos de 24 h, pierdes la reserva; cancelas 48 h antes, reembolso del 50 %. Los tramos se solapan; ver propuesta de redacción en `docs/TODO.md`.
- [x] Videollamada: Google Meet, si se puede configurar bien. De momento, correo del dominio redirigido con Cloudflare y Resend al correo personal de Sara.
- [x] Tipos de visita: primera visita (120 €) y seguimiento (90 €). Pendiente valorar los precios y si hace falta otra visita (por ejemplo, entrega de resultados).

### Correo, dominio y redes

- [x] Dominio `saratorresesquius.com`. Una sola dirección de contacto, a decidir entre `info@` y `contacto@` (Sara propone `info@` en vez de `sara@`).
- [x] LinkedIn: https://www.linkedin.com/in/saratorresesquius/. Instagram: aún no existe, se creará.

### Legal

- [x] NIF: el DNI, porque es autónoma (el número va en el aviso legal; no se guarda en el repo hasta publicar). Modelo para aviso legal, privacidad y cookies: los textos de seagen.org que Sara ya revisó.
- [ ] Domicilio: pendiente de confirmar con el gestor si basta una dirección profesional en lugar de la de casa.

### Primera visita

- [x] Duración: unos 60 minutos, puede alargarse o acortarse según el caso y, si se alarga, no cuesta más.
- [x] Al reservar llega un correo de confirmación con un enlace a una página de la web que explica qué preparar. Después se entrega un informe de la consulta con lo básico.
- [x] Qué preparar: árbol familiar de al menos tres generaciones (patologías relevantes para el motivo de consulta) e informes médicos personales relacionados con el motivo. Sara lo detallará.

### Textos

- [x] Titular de la home y FAQ: Sara lo piensa estos días (deberes).
- [x] FAQ de partida (a reescribir y revisar): qué implica un estudio genético (muestra de sangre, saliva o pelo), cuánto tarda (de dos semanas a un mes desde que la muestra llega al laboratorio) y si dice qué enfermedad tendré (no: se analiza un conjunto de genes ligado al motivo de consulta).
- [x] Objeción «me obligan a hacerme un estudio»: no. En la visita se explican los estudios posibles, sus implicaciones, beneficios y limitaciones, y la persona decide. El precio de cada estudio se informa al exponerlo.
- [x] «Independiente del hospital»: es una consulta privada, como la de un fisioterapeuta.
- [x] Frase de confidencialidad: se mantiene la actual.

### Sobre Sara

- [x] Manual SEHH 2024: autora de uno de los capítulos. Sara pasará el enlace, hoy está roto.
- [x] ORCID: https://orcid.org/0000-0001-7540-7284. Las 26 publicaciones de PubMed son todas suyas.
- [x] Fotos: se mantienen las actuales; más material gráfico cuando se pueda.

### Árbol genealógico (hecho)

- [x] Guías NSGC, hombre a la izquierda en cada pareja. I.1 sano, I.2 portadora (punto). II.1 y II.2 portadores (II.2 es el probando, con flecha), II.3 con otra condición (cáncer de colon) y II.4 sana. III.1 con la condición de los puntos; III.2 con cáncer; III.3 sano. Una misma condición lleva siempre el mismo color (violeta y naranja); el rojo, libre, es la flecha del probando.

### Idiomas

- [x] Las traducciones al catalán y al inglés las hago yo y las revisáis vosotros.

## Pendiente (decidimos nosotros, no Sara)

- [ ] Qué edición de Google Workspace y cuenta de Cal.com (`cal.com`, no `cal.eu`). Pablo lo está configurando.
- [ ] Cuándo quitar el `noindex` y publicar.
- [ ] Las visitas no se graban.

## Decisiones de diseño derivadas del brief (no son de Sara)

- La home no lleva valoraciones. La prueba bajo el botón es la trayectoria, las publicaciones y la prensa.
- Una puerta por cada una de las cinco situaciones, no cuatro frases genéricas.
- Faltan las secciones de precios y de FAQ.
- «Sobre mí» debe incluir SEAGen y la UAB.
- El brief pide aspecto de dibujo a mano para el árbol; el actual es limpio y geométrico.
