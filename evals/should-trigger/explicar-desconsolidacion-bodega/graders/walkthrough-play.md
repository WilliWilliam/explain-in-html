---
type: llm
focus: { source: file, path: desconsolidacion.html }
---

Estás evaluando los controles de un recorrido paso a paso sobre un plano de bodega en una página HTML.

PASS si la página no tiene recorrido por pasos (un plano estático bien hecho también es válido), o si lo tiene y se cumple todo:
- Hay controles de anterior y siguiente, y un botón de reproducir/pausa.
- La reproducción no arranca sola al cargar la página (no hay un temporizador que avance pasos sin que el lector oprima reproducir).
- Cualquier acción manual (anterior, siguiente, elegir un paso) detiene la reproducción.
- La reproducción se detiene al llegar al último paso.
- Si algún paso le hace una pregunta al lector, la reproducción se pausa ahí en vez de saltarla.

FAIL si el recorrido arranca solo, si sigue en bucle sin detenerse, o si avanza por encima de una pregunta sin pausar.
