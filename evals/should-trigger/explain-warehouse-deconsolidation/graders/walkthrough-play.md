---
type: llm
focus: { source: file, path: desconsolidacion.html }
---

You are judging the controls of a step-by-step walkthrough over a warehouse floor plan in an HTML page. The page is in Spanish, so judge the controls by what they do, not by their English labels (for example "Anterior", "Siguiente", "Reproducir", "Pausa", "Paso N de M" are fine).

PASS if the page has no step-by-step walkthrough (a well-made static plan is also valid), or if it has one and all of the following hold:
- There are previous and next controls, and a play/pause button.
- Playback does not start on its own when the page loads (no timer advances steps without the reader pressing play).
- Any manual action (previous, next, choosing a step) stops playback.
- Playback stops on reaching the last step.
- If a step asks the reader a question, playback pauses there instead of skipping it.

FAIL if the walkthrough starts on its own, loops without stopping, or advances past a question without pausing.
