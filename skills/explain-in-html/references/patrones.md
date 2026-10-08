# Patrones

Reglas aprendidas comparando artefactos reales. Complementan a `SKILL.md`, no lo reemplazan.

**Cómo aplicarlas:** cada patrón dice cuándo aplica. Úsalo solo si el contenido lo pide; no fuerces ninguno. Si un patrón choca con lo que pidió el usuario o con el design system del proyecto, ganan ellos.

Orden de prioridad: instrucción del usuario → design system del proyecto → estos patrones → valores por defecto de la skill.

---

## 1. Diagramas y notación

**Notación estándar antes que metáforas.**
Cuando: el contenido es técnico (sistemas, APIs, autenticación, datos).
Usa la notación que un técnico reconoce: diagrama de secuencia, carriles, máquina de estados, arquitectura. Una metáfora visual (dibujar un sistema de software como una fábrica o una ruta de envío) solo si aclara algo que la notación no muestra. Las cajas y flechas no son genéricas cuando son la notación correcta.
Una metáfora es dibujar un lugar para algo que no es un lugar. Cuando el tema *sí* es un lugar físico (bodega, puerto, terminal, aeropuerto, planta), el plano es la notación estándar: ver "Dibuja el lugar".

**Diagrama de secuencia completo.**
Cuando: varios sistemas intercambian mensajes.
Muestra todos los mensajes a la vez, además de cualquier recorrido paso a paso. Ida y vuelta en carriles separados, con el protocolo o formato escrito sobre cada tramo (REST · JSON, SOAP · XML). Si algo falla, marca el punto exacto donde se corta el flujo.

**Dos puntos de corte, dos marcadores.**
Cuando: el concepto tiene dos umbrales distintos que la gente confunde (dónde pasa el riesgo y hasta dónde paga el vendedor; dónde termina la responsabilidad de un sistema y empieza la del otro).
Márcalos ambos, con estilos distintos (por ejemplo, línea sólida y punteada) y una etiqueta que diga qué significa cada uno.

**Dibuja el lugar.**
Cuando: es un proceso físico (una bodega, un puerto, una terminal, un aeropuerto, una planta, una zona franca).
Un plano visto desde arriba con las zonas reales ubica al lector mejor que cajas abstractas. Dibújalo como un plano de ingeniero, no como una ilustración, y con el estilo de la página (tipografía, botones, colores de `matching-your-style.md`). Si el usuario trae un plano de referencia, toma su estructura, no su apariencia:
- **El escenario no se mueve, la carga sí.** Muros, puertas, zonas, carriles y estanterías quedan fijos en todos los pasos. Lo que cambia de un paso a otro es lo que se mueve entre zonas: bultos, contenedor, camiones, personas, documentos.
- **El orden en el espacio es el orden del proceso.** Ubica las zonas para que el recorrido se lea en un sentido (izquierda a derecha, o de arriba abajo), de la entrada a la salida. Lo de afuera (patio, portería, muelle, pista) va al borde.
- **Trazo de plano.** Muros gruesos en `--ink`, puertas como huecos en el muro, zonas con contorno punteado en `--ink-soft` y su nombre en mayúscula pequeña, zonas restringidas con contorno `--danger` y rayado siempre visible. La zona del paso actual se resalta con el acento. Nada de sombras, perspectiva ni íconos decorativos.
- **Un color por entidad, en todas partes.** Cada carga, documento o cliente tiene su color, y es el mismo en el plano, en la tabla, en la leyenda y en el texto. Estos colores son categorías, no acentos: no cuentan para la regla de "un solo acento". Máximo cinco, distintos del acento y entre sí, cada uno con su valor para modo oscuro, y siempre con una letra o etiqueta además del color.
- **La excepción se dibuja donde ocurre.** Un faltante es un hueco punteado en su carril; una inspección es su zona resaltada; la nota ("4 / 5 faltante") va pegada al lugar, no en un párrafo aparte.
- **Lo físico y lo documental lado a lado.** Si el proceso tiene papeles (manifiesto, documento de transporte, declaración), muestra junto al plano una tabla que avanza con él: "en el piso" y "en los papeles" tienen que cuadrar.
- **El lugar fijo va en el HTML.** Muros y zonas se escriben en el SVG; el JS solo mueve objetos. Si el JS falla, el plano se ve completo.
- **En el celular, el plano se desplaza dentro de su caja, no la página.** Un contenedor con `overflow-x: auto`, `tabindex="0"` y `aria-label`, y el SVG con un `min-width` que mantenga legibles las etiquetas.

Si el plano tiene un recorrido por pasos, aplica "Recorrido con reproducir".

**Transiciones con su disparador.**
Cuando: el contenido es un ciclo de estados.
Entre cada estado, muestra el evento o documento que hace que pase al siguiente.

## 2. Interacción

**Simuladores que se rompen.**
Cuando: hay un proceso que puede fallar.
Deja que el lector lo rompa con controles (estado de cada sistema, datos faltantes, credenciales, modo síncrono o asíncrono, control de duplicados), no solo con escenarios fijos. Muestra qué hace cada sistema, qué estado queda y quién tiene que actuar.

**Recorrido con reproducir.**
Cuando: un diagrama tiene un recorrido paso a paso (un plano donde se mueve la carga, una secuencia de mensajes, una máquina de estados que avanza). No en diagramas estáticos: si no hay pasos, no hay nada que reproducir.
Controles debajo del diagrama: los pasos con número y nombre corto (clicables), **← Anterior**, **Siguiente →**, **▶ Reproducir** y "Paso N de M".
- Nunca arranca solo al cargar. El lector decide. Al oprimir ▶ avanza de una vez al paso siguiente.
- Cualquier acción manual (un paso, anterior, siguiente, las flechas del teclado) detiene la reproducción. Las flechas no cambian de paso cuando el foco está en el selector de nivel, en el plano desplazable o en una tabla: ahí ya tienen su uso.
- Se detiene al llegar al final. Oprimir ▶ en el último paso vuelve al primero (no al segundo) y sigue desde ahí.
- Se pausa al llegar a cualquier paso que le pregunte algo al lector. Una pregunta que se salta sola no sirve. Si la pregunta está oculta en el nivel de lectura elegido, no se pausa ahí.
- El tiempo de cada paso depende de su texto visible: unas 3 palabras por segundo, mínimo 4 segundos.
- El botón cambia su texto entre ▶ Reproducir y ❚❚ Pausa (sin `aria-pressed`: el texto ya dice qué hace). "Paso N de M" va en `aria-live="polite"`.
- Con `prefers-reduced-motion: reduce` se quitan las transiciones, pero los pasos siguen funcionando.
- Todo lo fijo del diagrama se ve siempre (como en "Diagrama de secuencia completo"); los pasos solo cambian lo que se mueve y lo que se resalta.
- Al imprimir se ocultan los controles y sale el paso actual.

**El artefacto real en cada paso.**
Cuando: se explica un proceso técnico paso a paso.
Muestra lo que realmente viaja o se registra en ese punto: el mensaje con sus encabezados, el documento, la línea del log.

**Equivalencias enlazadas.**
Cuando: hay dos representaciones del mismo dato (JSON y XML, un campo en un sistema y su equivalente en otro, un término y su definición).
Al pasar el mouse, enfocar con teclado o tocar uno, se resalta su pareja.

**Variantes cuando el detalle cambia el resultado.**
Cuando: un dato menor altera la conclusión (el lugar de entrega en un Incoterm, el modo de envío en una integración).
Ofrece las variantes como opciones que el lector puede alternar.

**Exportar a texto.**
Cuando: el lector edita algo, o el resultado de un simulador le sirve para soporte.
Agrega "copiar como texto" con un formato listo para pegar en un correo o ticket.

## 3. Contenido y estructura

**Compacto.**
Prefiere páginas densas y fáciles de escanear sobre páginas largas con mucho aire. No repitas en prosa lo que ya muestra un diagrama o una tabla.

**Ideas clave en tarjetas.**
Las dos o tres ideas que el lector debe llevarse van destacadas en tarjetas, no enterradas en párrafos. Son una sola fila de dos o tres, sin sombras ni íconos, cerca del principio. Eso no es la "grilla de tarjetas porque sí" que prohíbe la guía de estilo: aquí la tarjeta marca lo que hay que recordar.

**Niveles de lectura: 1, 5 y 10 minutos.**
Cuando: la página es para leer y entender (una explicación, la descripción o revisión de un PR, un reporte, un post-mortem, un plan). No va en tableros, editores ni decks, ni en páginas que se leen enteras en un minuto.
Una sola página con un selector arriba: **1 min · 5 min · 10 min**, que abre en 10. Los niveles se acumulan: el de 5 incluye el de 1, y el de 10 incluye el de 5.
- **1 min:** qué cambió o qué es, y por qué importa, en tres o cuatro frases, más las ideas clave y una sola figura. Unas 200 palabras.
- **5 min:** los conceptos que hay que entender (estructura, flujo, decisiones principales), con sus diagramas.
- **10 min:** alternativas descartadas, riesgos, casos borde, preguntas abiertas y el detalle que importa.

Cada nivel debe entenderse solo. Nada de "ver el diagrama de abajo" si ese diagrama está oculto en ese nivel, y nada de enlaces a secciones ocultas. Si una frase anuncia una lista ("hay dos lugares"), todos sus elementos van en el mismo nivel. Lo que siempre se ve de una figura (los nombres de los pasos, el texto corto de cada paso, las celdas de su tabla) cuenta como nivel 1: escríbelo sin jerga o explica el término ahí mismo.
Si el usuario pide un solo tiempo ("explícamelo en 1 minuto", "versión de 5 min"), haz solo ese nivel y sin selector.

Marcado (úsalo igual siempre):
```html
<fieldset class="nivel">
  <legend>Tiempo de lectura</legend>
  <input type="radio" name="nivel" id="nivel-1" value="1"><label for="nivel-1">1 min</label>
  <input type="radio" name="nivel" id="nivel-5" value="5"><label for="nivel-5">5 min</label>
  <input type="radio" name="nivel" id="nivel-10" value="10" checked><label for="nivel-10">10 min</label>
</fieldset>
<!-- Lo del nivel 1 va sin marca. data-nivel="N": visible desde el nivel N. -->
<section data-nivel="5">…</section>
<section data-nivel="10">…</section>
```
```css
body:has(#nivel-1:checked) [data-nivel="5"],
body:has(#nivel-1:checked) [data-nivel="10"],
body:has(#nivel-5:checked) [data-nivel="10"] { display: none; }
```
Los radios pueden ir dentro de un contenedor para darles estilo de botones segmentados (el radio oculto con `opacity: 0` y la etiqueta como botón). Oculta con CSS, no con JS. Si algo falla, se ve la página completa. Un poco de JS puede guardar el nivel en la URL (`#5min`) para compartir el enlace. Al imprimir sale el nivel elegido. Verifica los tres niveles al revisar la página.

**Glosario lateral.**
Cuando: hay más de cuatro o cinco términos especializados.
Glosario al margen, con los términos del texto enlazados a su definición.
Con niveles de lectura, el glosario va desde el nivel 5. En lo que se ve en el nivel 1, los términos se explican en la misma frase y no se enlazan al glosario, que ahí está oculto.

**Caso con hilo de punta a punta.**
Cuando: se usa un ejemplo.
Que el caso tenga continuidad: dónde nació el problema, dónde se pudo detectar y dónde explotó.

**Fallas accionables.**
Cuando: se explican errores.
Clasifícalos por la pregunta clave: ¿se arregla esperando o alguien tiene que corregir algo? Para cada uno: qué se ve, si conviene reintentar y quién actúa. Advierte cuando una respuesta exitosa puede esconder un error.

**Errores típicos.**
Cuando: el lector es nuevo en el tema.
Incluye los errores más comunes de quien empieza, con la corrección.

**Preguntas para el experto.**
Cuando: el lector depende de otro equipo (técnico, legal, operaciones).
Cierra con las preguntas que debería hacerle a ese equipo.

## 4. Datos y contexto

**Fechas reales.**
Cuando: hay cronogramas o plazos.
Cuenta días hábiles y festivos reales del país correspondiente, no solo días calendario.

**Contexto local.**
Cuando: el tema es de un país concreto.
Usa las entidades, normas, documentos y lugares reales de ese país (por ejemplo, en Colombia: DIAN, levante, puertos y vías reales).

**Nombres.**
Usa el nombre de producto, empresa o sistema que dé el usuario. Si no lo da, usa uno genérico y claramente ficticio. Nunca uses el nombre de esta skill ni de su autor como nombre de un producto.
