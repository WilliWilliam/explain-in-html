# Patrones

Reglas aprendidas comparando artefactos reales. Complementan a `SKILL.md`, no lo reemplazan.

**Cómo aplicarlas:** cada patrón dice cuándo aplica. Úsalo solo si el contenido lo pide; no fuerces ninguno. Si un patrón choca con lo que pidió el usuario o con el design system del proyecto, ganan ellos.

Orden de prioridad: instrucción del usuario → design system del proyecto → estos patrones → valores por defecto de la skill.

---

## 1. Diagramas y notación

**Notación estándar antes que metáforas.**
Cuando: el contenido es técnico (sistemas, APIs, autenticación, datos).
Usa la notación que un técnico reconoce: diagrama de secuencia, carriles, máquina de estados, arquitectura. Una metáfora visual (una ruta de envío, una fábrica) solo si aclara algo que la notación no muestra. Las cajas y flechas no son genéricas cuando son la notación correcta.

**Diagrama de secuencia completo.**
Cuando: varios sistemas intercambian mensajes.
Muestra todos los mensajes a la vez, además de cualquier recorrido paso a paso. Ida y vuelta en carriles separados, con el protocolo o formato escrito sobre cada tramo (REST · JSON, SOAP · XML). Si algo falla, marca el punto exacto donde se corta el flujo.

**Dos puntos de corte, dos marcadores.**
Cuando: el concepto tiene dos umbrales distintos que la gente confunde (dónde pasa el riesgo y hasta dónde paga el vendedor; dónde termina la responsabilidad de un sistema y empieza la del otro).
Márcalos ambos, con estilos distintos (por ejemplo, línea sólida y punteada) y una etiqueta que diga qué significa cada uno.

**Dibuja el lugar.**
Cuando: es un proceso físico (una bodega, un puerto, una planta).
Un plano visto desde arriba con las zonas reales ubica al lector mejor que cajas abstractas.

**Transiciones con su disparador.**
Cuando: el contenido es un ciclo de estados.
Entre cada estado, muestra el evento o documento que hace que pase al siguiente.

## 2. Interacción

**Simuladores que se rompen.**
Cuando: hay un proceso que puede fallar.
Deja que el lector lo rompa con controles (estado de cada sistema, datos faltantes, credenciales, modo síncrono o asíncrono, control de duplicados), no solo con escenarios fijos. Muestra qué hace cada sistema, qué estado queda y quién tiene que actuar.

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
Las dos o tres ideas que el lector debe llevarse van destacadas en tarjetas, no enterradas en párrafos.

**Niveles de lectura: 1, 5 y 10 minutos.**
Cuando: la página es para leer y entender (una explicación, la descripción o revisión de un PR, un reporte, un post-mortem, un plan). No va en tableros, editores ni decks, ni en páginas que se leen enteras en un minuto.
Una sola página con un selector arriba: **1 min · 5 min · 10 min**, que abre en 10. Los niveles se acumulan: el de 5 incluye el de 1, y el de 10 incluye el de 5.
- **1 min:** qué cambió o qué es, y por qué importa, en tres o cuatro frases, más las ideas clave y una sola figura. Unas 200 palabras.
- **5 min:** los conceptos que hay que entender (estructura, flujo, decisiones principales), con sus diagramas.
- **10 min:** alternativas descartadas, riesgos, casos borde, preguntas abiertas y el detalle que importa.

Cada nivel debe entenderse solo. Nada de "ver el diagrama de abajo" si ese diagrama está oculto en ese nivel, y nada de enlaces a secciones ocultas.
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
Oculta con CSS, no con JS. Si algo falla, se ve la página completa. Un poco de JS puede guardar el nivel en la URL (`#5min`) para compartir el enlace. Al imprimir sale el nivel elegido. Verifica los tres niveles al revisar la página.

**Glosario lateral.**
Cuando: hay más de cuatro o cinco términos especializados.
Glosario al margen, con los términos del texto enlazados a su definición.

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
