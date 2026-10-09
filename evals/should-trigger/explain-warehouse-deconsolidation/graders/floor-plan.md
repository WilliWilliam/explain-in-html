---
type: llm
focus: { source: file, path: desconsolidacion.html }
weight: 2
---

You are judging an HTML page that explains to someone new to foreign trade how a consolidated container is deconsolidated at a bonded warehouse (depósito habilitado) in Colombia. The request was in Spanish, so the page must be in Spanish.

PASS if all of the following hold:
- The page text is in Spanish.
- There is a top-down floor plan of the warehouse, as inline SVG, with real named zones (for example receiving or dock, sorting, storage, inspection, dispatch), not an abstract box-and-arrow diagram or a perspective illustration.
- The zones are laid out in process order, from entry to exit.
- Cargo is distinguished per house document (by color or label), and each load visibly follows its own path: one can be held (shortage, inspection) while others leave.
- It uses Colombian context (the DIAN by name and at least one term such as levante, documento de transporte hijo, depósito habilitado or informe de descargue e inconsistencias).

FAIL if there is no floor plan of the place, if the plan is a metaphor or decorative illustration, if all the cargo moves together as one block, or if the page is in English.
