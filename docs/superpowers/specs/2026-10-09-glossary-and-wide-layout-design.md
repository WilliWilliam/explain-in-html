# Glossary popover + drawer, and a wide layout

Date: 2026-10-09 · Branch: `feat/glossary-popover-drawer` · Target version: 1.5.0

## Problem

The skill tells every explainer to put its glossary **in the margin**. The examples implement that as a permanent column (220–260px) inside a page capped at 1100–1180px. A large diagram therefore gets about 800px even on a 1600px+ window. Two things cost width: the page cap and the glossary column.

## Goal

- One default glossary pattern for the skill that takes no permanent space.
- Wide content (diagrams, plans, tables) uses the window's width; running text stays readable.
- Nothing regresses: phone, keyboard, both themes, print, reading levels, and "if JS fails, the full page shows".

Success: in the warehouse example at 1920px, the floor plan is drawn at full window width with the glossary closed, and every term definition is still one hover, focus or tap away.

## Decisions

1. **Glossary pattern: popover on the term + a collapsible drawer.** One pattern, not a per-page choice and not a reader toggle.
2. **Width: three tiers**, chosen per block: text, `.wide`, `.full`.
3. **Existing examples** with a glossary (02, 11, 12) migrate. **New example** `13-https-request.html`: "What happens when you open an HTTPS URL".

## 1. Glossary pattern

### Base markup (works without JS)

```html
<p>… the browser sends the <a class="term" href="#g-sni">SNI</a> in the clear …</p>
…
<aside class="glossary" id="glossary" data-level="5" aria-labelledby="glossary-t">
  <h2 id="glossary-t">Glossary</h2>
  <dl>
    <dt id="g-sni">SNI</dt><dd id="g-sni-d">Server Name Indication: …</dd>
  </dl>
</aside>
```

- The `aside` is the **last child of `main`**. Without JS or when printing, it is a glossary at the bottom and the term links jump to it.
- Each `dt` has an `id`; each `dd` has `id` = `dt` id + `-d`.

### Behaviour added by JS (~40 lines, no library)

**Popover on `.term`**
- Opens on hover (pointer), on focus (keyboard), and on first tap (touch; the tap does not navigate).
- Contains the `dd` text and a "see in glossary →" link.
- Closes on Esc, on mouseleave/blur, or on a tap outside.
- A mouse click or Enter on a term opens the drawer at its entry and sets the hash (the same as "see in glossary"). On touch, the first tap only opens the popover.
- JS sets `aria-describedby` on each term to its `dd` id.
- On phone width it renders as a sheet anchored to the bottom of the viewport.

**Drawer**
- A "Glossary" button sits in the top bar, next to the reading-level and theme buttons. It has `aria-controls="glossary"` and `aria-expanded`.
- The button turns the `aside` into a fixed side panel that **overlays** the content. It does not push the content, so diagrams never change width.
- Starts closed. Closes on Esc or the same button, and focus returns to the button.
- The open/closed state is remembered in `localStorage`, wrapped in try/catch.
- "See in glossary" opens the drawer and highlights the entry (same style as today's `dt:target`).
- On phone width the drawer is full screen.

### Rules kept

- Use a glossary only with more than four or five specialized terms.
- With reading levels, the glossary starts at level 5. At level 1 both the glossary and the drawer button are hidden, and terms are explained in the same sentence.
- Print: drawer and popovers hidden; the glossary prints as a list at the end.

## 2. Width tiers

| Class | Width | For |
|---|---|---|
| (default) | `min(70ch, 100%)` | Running text, lists, callouts |
| `.wide` | `min(1600px, 100%)` | Tables, comparisons, medium diagrams, card grids |
| `.full` | window width minus a 16–24px gutter | Floor plans, many-column flows, diagrams that gain from space |

- **Page structure:** one centered column with no glossary column. The gutter is padding on the wrapper, so `.full` stops at it. `.wide` and `.full` break out of the text measure symmetrically. Use CSS grid with named column lines (`[full-start] gutter [wide-start] … [content-start] 70ch [content-end] … [wide-end] gutter [full-end]`), no JS.
- **When to use `.full`:** the diagram has more than about 6 columns or zones, or at 1100px its labels would render below 11px. Otherwise use `.wide`.
- **SVG:** a `.full` diagram gets a `viewBox` designed for its real width (about 1800 units wide), not an 800-unit drawing scaled up.
- **Phone:** at 400px all three tiers are 100% with a 16px gutter. Anything that still doesn't fit sits in an `overflow-x: auto` container, as today.

## 3. Skill text changes

- **`references/patterns.md`**
  - Replace "Side glossary" with "Glossary: popover + drawer": the markup skeleton with the exact names and a short list of required behaviours (about 20 lines). No full CSS/JS: upstream 2.0 spends the skill on judgment, not mechanics, and `patterns.md` is read on every invocation. The full implementation lives in example 02.
  - Add "Wide layout" with the tier table, the grid snippet and the `.full` criterion.
- **`references/reports-and-research.md`**
  - Replace the "in the margin" bullets (lines 15, 20) and the `aside.glossary` in the skeleton.
  - Drop "bottom glossaries are never read". The bottom position is now only the no-JS/print fallback.
- **`SKILL.md:22`**: "a glossary in the margin" becomes "a glossary on the term (popover) and in a drawer".
- **`references/diagrams-and-illustrations.md`**: one paragraph on choosing `.wide` vs `.full`, and on sizing the `viewBox` for the real width.
- **`references/verify-before-delivering.md`**
  - Check at 1600px and above 2000px as well as 400px and desktop.
  - Check the popover with mouse, keyboard and touch, the drawer's focus return, and the no-JS fallback.

## 4. Examples

- **`02-iri-explainer.html`:** glossary becomes the pattern; the quarter-car diagram becomes `.wide`.
- **`11-warehouse-floor-plan.html`:** glossary becomes the pattern; the floor plan becomes `.full` with a viewBox redrawn for that width.
- **`12-assembly-regime.html`:** glossary becomes the pattern; the walkthrough (`.tour`/`.duo`) and the idea cards become `.wide`.
- **New `13-https-request.html`:** "What happens when you open an HTTPS URL".
  - **Content:** a `.full` sequence/timeline diagram across browser → DNS resolver → CDN edge → origin, with lanes for DNS, TCP, TLS 1.3, HTTP/2 request and response, and RTT annotations.
  - **Interaction:** a walkthrough with play, following the existing pattern.
  - **Other parts:** reading levels, the theme button, and a glossary of 8–12 terms (RTT, DNS resolver, TTL, SYN/ACK, TLS handshake, SNI, ALPN, certificate chain, CDN edge, origin, keep-alive, 0-RTT).
  - **Language and header:** English, with the standard prompt header comment.
- **`docs/index.html`:** the count goes from twelve to thirteen and a card is added for 13.
- Examples without a glossary are untouched.

## 5. Verification

- **`scripts/verify-example.mjs`:** add a `wide` viewport of 1920×1000, light.
- **`scripts/check-examples.sh`:** if a file contains `class="glossary"`, it must also contain `aria-controls="glossary"` and `aria-describedby`. A file missing either is still on the margin pattern.
- **Manual checks on 02, 11, 12 and 13:**
  - Popover with mouse, Tab and emulated touch.
  - Drawer Esc and focus return.
  - JS disabled: glossary at the bottom.
  - Print preview: glossary at the end.
  - Level 1: glossary and button hidden.
- Both scripts pass on every example and on `docs/index.html`.

## 6. Release

- Version 1.5.0 in `CHANGELOG.md`, `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`.
- New bullet in the README's "What this fork adds".
- Add `.superpowers/` to `.gitignore`.

## Out of scope

- New evals: no current eval asserts glossary placement.
- Width changes in examples without a glossary.
- A reader-facing toggle between glossary modes.
