---
type: llm
focus: { source: file, path: desconsolidacion.html }
weight: 2
---

Estás evaluando una página HTML que explica a alguien nuevo en comercio exterior cómo se desconsolida un contenedor consolidado en un depósito habilitado en Colombia.

PASS si se cumple todo:
- El texto de la página está en español.
- Hay un plano de la bodega visto desde arriba, en SVG en línea, con zonas reales con nombre (por ejemplo recepción o muelle, clasificación, almacenamiento, inspección, despacho), no un diagrama de cajas y flechas abstracto ni una ilustración en perspectiva.
- Las zonas están ordenadas en el sentido del proceso, de la entrada a la salida.
- La carga se distingue por documento hijo (por color o etiqueta), y se ve que cada carga sigue su propio camino: una puede quedar retenida (faltante, inspección) mientras otras salen.
- Usa contexto colombiano (la DIAN por su nombre y al menos un término como levante, documento de transporte hijo, depósito habilitado o informe de descargue e inconsistencias).

FAIL si no hay plano del lugar, si el plano es una metáfora o ilustración decorativa, si toda la carga avanza junta como un solo bloque, o si la página está en inglés.
