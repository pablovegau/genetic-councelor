# Prompt 01: arranque de la home

Plantilla basada en el "Intake" del repo de referencia, rellenada con `docs/design/brief.md`. Aún sin decisiones de tipografía, color ni movimiento: esas vienen después, con prototipos.

Todo lo marcado **PENDIENTE** no está decidido: el agente debe señalarlo, no rellenarlo.

```text
Vamos a montar la home de la web de Sara Torres-Esquius, asesora genética. Es una persona real y una web de salud, así que usa solo los datos de este mensaje, de docs/design/brief.md y de CONTEXT.md: no inventes titulaciones, cifras, reseñas, precios ni promesas. Lo que falte, márcalo como pendiente.

Lee antes docs/design/brief.md y CONTEXT.md. Si usas la skill landing-page-design: aplica la parte A (intake, estructura, conversión, SEO). De la parte B solo lo que no contradiga el brief; en concreto, "Torres-Esquius" lleva guion y se queda así, y el tono es sereno, sin revelados con mucho movimiento. Ante cualquier choque, manda el brief.

Intake:
- Acción principal: reservar una primera visita por videollamada. Herramienta de reserva: PENDIENTE (enlace).
- Acción secundaria, solo más abajo: leer más sobre cada situación.
- Oferta: primera visita, 120 €, descontable si se hace un estudio genético. Visita de seguimiento, 90 €. Duración: PENDIENTE.
- Titular: PENDIENTE. Propón 3 opciones para elegir. Debe nacer de las preguntas con las que la gente llega (ej.: "¿Tienes antecedentes de cáncer en la familia y quieres saber si hay un riesgo genético?", "¿Te planteas tener un hijo y quieres saber si tú o tu pareja sois portadores de alguna enfermedad genética?").
- Situaciones (una puerta cada una desde la home): cáncer hereditario, reproductivo (preconcepcional y prenatal), cardiogenética, enfermedades raras, resultados de tests comerciales.
- Primera visita en pasos: por videollamada; se prepara la información personal y familiar relevante (ej.: qué cánceres hay en la familia, a qué edad se diagnosticaron); se dibuja el árbol genealógico de tres generaciones; se fijan expectativas y dudas; se acuerda un plan, y se pacta un estudio genético o no; se agenda seguimiento. Mensaje clave: un estudio genético no es una sentencia, y asesorarse no implica hacerse un estudio. Descripción final: PENDIENTE (la revisa Sara).
- Prueba (solo estos hechos): más de 10 años de trayectoria en genética; asesora genética en el Hospital Vall d'Hebron (desde 2021) y en Clínica Corachan-IDOC (desde 2025); vocal de la Junta Directiva de SEAGen; profesora vinculada en la UAB (desde 2025); publicaciones (lista por API, ORCID 0000-0001-7540-7284); prensa (El País, La Vanguardia, RTVE, Onda Cero, Telemadrid) y manual SEHH 2024. Todo como texto, sin logos. La consulta es independiente del hospital y la web lo dice.
- Datos: consulta online. Correo propio de la web: PENDIENTE. Sin teléfono.
- Legal: aviso legal, privacidad y cookies, PENDIENTE. Titular: Sara Torres-Esquius, persona física. Frase de confidencialidad junto al botón de reservar. La reserva pide solo nombre, correo y teléfono opcional: nada de datos de salud.
- Público: consultantes adultos que llegan por Google, redes o boca a boca; a veces serenos, a veces ansiosos. Casi siempre desde el móvil. Sin menores.
- Objeciones (asumidas, confírmalas): qué me van a decir, si me obligan a hacerme un estudio, qué pasa con mis datos, cuánto cuesta.
- Tono: cercana (sin jerga, sin barrera), con experiencia (demostrada con hechos, no con el adjetivo) y serena. Nunca alarmista, vendedora ni fría. Tuteo. "Nosotros" en la home y los servicios.
- Vocabulario: el de CONTEXT.md (consultante, asesoramiento genético, estudio genético, variante genética, riesgo). "Test genético" y "consejo genético" se explican en el cuerpo y las FAQ, no en titulares.
- Fotos: docs/design/assets/web/ (mg-XXXX, con -bn en blanco y negro y -v en vertical). No las alteres ni las amplíes con IA. Cuál va dónde: PENDIENTE.
- Diseño: PENDIENTE. No fijes tipografía, color ni movimiento: pregúntame. Esqueleto previsible: hero con reserva, situaciones, primera visita en pasos, precios, Sara, FAQ, reserva final.
- Prioridad: móvil primero.
- Idiomas: construye primero el español. Catalán e inglés quedan con la misma estructura y el contenido pendiente.

Stack: proyecto Astro 7 ya creado, con i18n (es por defecto, /ca, /en). No añadas dependencias de estilo sin preguntarme.

Antes de escribir código: mira las fotos de docs/design/assets/web/ y devuélveme (1) el esquema de la página, (2) el copy del hero (3 titulares, subtítulo, CTA y una línea de prueba), (3) los pasos de la primera visita, (4) las FAQ, (5) SEO/AEO (title y description) y (6) qué foto iría en cada sección. No escribas código hasta que te diga que sí.
```

## Notas

- Orden de trabajo: esquema → hero → situaciones → primera visita → prueba → FAQ → reserva final, sección a sección y sin rehacer toda la página en cada iteración.
- Cada respuesta que se pegue en este prompt se guarda aquí con su fecha, como hace el repo de referencia en `PROMPTS.md`.
