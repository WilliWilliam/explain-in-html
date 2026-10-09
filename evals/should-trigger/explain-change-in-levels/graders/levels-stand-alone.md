---
type: llm
focus: { source: file, path: change.html }
weight: 2
---

You are judging an HTML explainer of a code change (a payments client that moves retries into a pluggable RetryPolicy and adds an idempotency key). It must offer 1, 5 and 10 minute reading levels in one page.

PASS if all of the following hold:
- There is one page with a level selector (1 / 5 / 10 min), with 10 selected by default, and content marked so lower levels hide the deeper sections (not three separate copies of the text).
- The 1 minute level, read alone (everything marked data-level="5" or "10" removed), says what changed and why in a few sentences and does not refer to a diagram or section that is hidden at that level.
- The deeper levels add design and architecture (the RetryPolicy strategy and its implementations, where the idempotency key comes from and why it matters for retries), not line-by-line code walkthroughs.
- Because the prompt asks for it, there is at least one UML class diagram (generalization or realization drawn with a hollow triangle) and one sequence diagram (lifelines, labelled messages), as inline SVG.

FAIL if the levels are three tabs with duplicated content, if 10 minutes is not the default, if the 1 minute level points at hidden content, or if the page is mostly a code walkthrough.
