---
type: llm
focus: { source: file, path: facturacion.html }
weight: 2
---

Estás evaluando una página HTML que explica la facturación electrónica entre un ERP, un proveedor tecnológico y la DIAN a alguien nuevo en un equipo de integraciones.

PASS si se cumple todo:
- El texto de la página está en español.
- Hay un diagrama de secuencia, de carriles o equivalente con los tres sistemas como participantes, y los mensajes entre ellos tienen etiqueta (qué se envía, por ejemplo XML/UBL, CUFE, respuesta de validación), no solo flechas sin nombre.
- Explica el caso de rechazo: muestra en qué punto se corta el flujo y quién tiene que actuar.
- Usa contexto colombiano real (la DIAN por su nombre y al menos un término propio como CUFE, resolución de facturación o documento soporte).

FAIL si la página está en inglés, si no tiene diagrama o sus flechas no tienen etiqueta, si no trata el rechazo, o si describe el proceso de forma genérica sin la DIAN.
