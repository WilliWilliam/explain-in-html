---
type: llm
focus: { source: file, path: facturacion.html }
weight: 2
---

You are judging an HTML page that explains electronic invoicing between an ERP, a technology provider and the DIAN to someone new on an integrations team. The request was in Spanish, so the page must be in Spanish.

PASS if all of the following hold:
- The page text is in Spanish.
- There is a sequence diagram, swimlanes or equivalent with the three systems as participants, and the messages between them are labelled (what is sent, for example XML/UBL, CUFE, validation response), not just unnamed arrows.
- It covers the rejection case: it shows where the flow breaks and who has to act.
- It uses real Colombian context (the DIAN by name and at least one specific term such as CUFE, resolución de facturación or documento soporte).

FAIL if the page is in English, if it has no diagram or its arrows are unlabelled, if it doesn't cover rejection, or if it describes the process generically without the DIAN.
