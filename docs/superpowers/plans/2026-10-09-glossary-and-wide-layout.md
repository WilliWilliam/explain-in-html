# Glossary popover + drawer and wide layout: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the margin glossary with a popover-on-term + collapsible drawer, and let wide content use the window's width, in both the skill's guidance and its examples.

**Architecture:**
- **No shared code.** Every example is a self-contained HTML file, so there is no shared JS/CSS. `patterns.md` carries only the contract (markup skeleton + required behaviours, ~20 lines). The full implementation lives in `docs/examples/02-iri-explainer.html`, in one marked CSS block and one marked script block, and Tasks 3–5 copy it from there.
- **One behavioural test.** A Playwright script (`scripts/verify-glossary.mjs`) is the test for the pattern. Each example migration is "make it pass".

**Tech stack:** plain HTML/CSS/JS (no libraries), Bash, Node + Playwright (Chromium).

**Spec:** `docs/superpowers/specs/2026-10-09-glossary-and-wide-layout-design.md`

## Global constraints

**Width tiers**
- Text measure: `min(70ch, 100%)`.
- `.wide`: `min(1600px, 100%)`.
- `.full`: window width minus a 16–24px gutter.
- Phone: all tiers are 100% with a 16px gutter.

**Glossary**
- Used only with more than four or five specialized terms.
- With reading levels it starts at level 5. At level 1 both the glossary and its button are hidden.
- The drawer overlays the content and never pushes it. It starts closed and closes on Esc or its button, and focus returns to the button.
- The open/closed state goes to `localStorage` key `glossary-open`, wrapped in try/catch.
- Without JS, and when printing, the glossary is a list at the end of `main` and the term links jump to it.

**Examples**
- No libraries and no external scripts.
- Every example still passes `scripts/check-examples.sh` (prompt header comment, `:focus-visible`, both theme blocks, etc.).

**Language:** repo text is in English.

**Temporary files:** `$SCRATCH` is the session scratchpad directory, never `/tmp` or the repo.

**Version:** 1.5.0.

## Names every task uses

**Markup**

| Thing | Exact name |
|---|---|
| Glossary | `<aside class="glossary" id="glossary" aria-labelledby="glossary-t">`, last child of `main` |
| Entry | `<dt id="g-<slug>">` + `<dd id="g-<slug>-d">` |
| Term in text | `<a class="term" href="#g-<slug>">` |
| Drawer button | `<button class="glossary-toggle" type="button" aria-controls="glossary" aria-expanded="false" hidden>Glossary</button>`, in the same bar as `.theme-toggle` |

**What the JS adds**

| Thing | Exact name |
|---|---|
| Enhanced state | `html.js-glossary` (enables the drawer and popover CSS) |
| Drawer open | `aside.glossary[data-open]` |
| Popover | one shared `<div id="term-pop" role="tooltip" hidden>` holding the `dd` text plus `<a class="term-pop-more" href="#g-<slug>">See in glossary →</a>` |
| Term ↔ definition | each `.term` gets `aria-describedby="g-<slug>-d"` |
| Button | the `hidden` attribute is removed |

**Wide layout**
- Wrapper: `<div class="page">` with grid lines `full`, `wide` and `content`. The gutter is `padding-inline: clamp(16px, 2vw, 24px)` on `.page`, not a grid track, so `100%` resolves inside the padding and `.full` stops at the gutter.
- Children default to `grid-column: content`; `.wide` uses `grid-column: wide` and `.full` uses `grid-column: full`.

## Review focus

1. **A term near the right edge or bottom of the viewport.** The popover stays fully inside the viewport. Test in Task 1 (`popover-in-viewport`).
2. **A `.term` whose `href` has no matching `dt`.** It should fail the static check, not silently show an empty popover. Test in Task 1 (`check-examples.sh` rule).
3. **Switching to the 1-minute level while the drawer is open.** The drawer disappears too. Test in Task 1 (`level-1-hides-open-drawer`).
4. **A glossary longer than the viewport.** The drawer scrolls inside itself and the page behind does not jump. Test in Task 1 (`drawer-scrolls`).
5. **Dark theme.** The popover and drawer use the theme tokens (no hardcoded white). Checked on the dark screenshots in each migration task.

---

### Task 1: Tests and checks for the pattern

**Files:**
- Create: `scripts/verify-glossary.mjs`
- Modify: `scripts/check-examples.sh` (new rules inside the per-file loop)
- Modify: `scripts/verify-example.mjs:13-17` (add a view)
- Modify: `.gitignore` (add `node_modules/`)
- Modify: `CONTRIBUTING.md:14-15` (document the new script)

**Interfaces:**
- **Produces:**
  - `node scripts/verify-glossary.mjs file.html …`: exit 0 if all checks pass; otherwise prints `FAIL <file>` and one line per failed check (`<check-name>: <detail>`).
  - It skips a file with no `aside.glossary` and no `.full`/`.wide`, printing `skip <file>`.

- [ ] **Step 1: Install Playwright locally (not committed)**

Run: `npm i --no-save playwright && npx playwright install chromium`, then add `node_modules/` to `.gitignore`.
Expected: `node -e "import('playwright')"` exits 0.

- [ ] **Step 2: Add the 1920 view to `verify-example.mjs`**

Add `{ name: 'wide', width: 1920, height: 1000, scheme: 'light' }` to `views`.

- [ ] **Step 3: Add the static rules to `check-examples.sh`**

Add these inside the loop, after the dark-theme block:
- If the file contains `class="glossary"`, it must also contain `aria-controls="glossary"` (else the problem is `glossary without drawer button`) and `aria-describedby` (else `glossary without popover wiring`).
- Every `href="#g-…"` must have a matching `id="g-…"` in the same file. Else the problem is `term links to missing g-<slug>` (Review focus 2).

- [ ] **Step 4: Write `scripts/verify-glossary.mjs`**

**Shape:** same CLI as `verify-example.mjs`. Each check is a named async function that returns `null` or a string describing the failure. Glossary checks run only if `aside.glossary` exists; width checks run only if `.full`/`.wide` exist.

**Glossary checks** (1280×800, unless the check names another context):

| Check | Assertion |
|---|---|
| `no-js` | Context with `javaScriptEnabled: false`: `aside.glossary` is visible and is the last element child of `main`, its top ≥ the bottom of its own previous sibling, and `.glossary-toggle` is not visible. |
| `starts-closed` | `.glossary-toggle` is visible, has `aria-expanded="false"`, and `aside.glossary` is not visible. If the page has `#level-10`, check it first. |
| `describedby` | Every `.term` has `aria-describedby` pointing to an existing element whose text is non-empty. |
| `hover-popover` | Hover the first visible `.term`: `#term-pop` is visible and its text contains the text of the term's `dd`. |
| `esc-closes-popover` | After `hover-popover`, press Escape: `#term-pop` is hidden. |
| `focus-popover` | `term.focus()` via Tab: `#term-pop` is visible. Blur: hidden. |
| `touch-popover` | Context 400×800, `hasTouch: true`, `isMobile: true`: tap the first visible `.term`. `#term-pop` is visible and `location.hash` is unchanged. |
| `popover-in-viewport` | At 1280 and at 400 (touch), open the popover on the first and on the last visible `.term`. Its bounding box is within `[0, viewportWidth] × [0, viewportHeight]`. |
| `drawer-toggle` | Record `main`'s first child width. Click `.glossary-toggle`: `aria-expanded="true"`, the aside is visible, and that width is unchanged. Press Escape: the aside is hidden and `document.activeElement` is the toggle. |
| `click-opens-drawer` | Mouse-click the first visible `.term` (and, separately, focus it and press Enter): the drawer is open, `location.hash` equals its `href`, and the entry is inside the drawer's visible area. |
| `see-in-glossary` | Open a popover and click `.term-pop-more`: the drawer is open and `location.hash` equals the term's `href`. |
| `remembers-open` | Open the drawer and reload: the drawer is open. |
| `drawer-scrolls` | With the drawer open at 1280×500, the aside's computed `overflow-y` is `auto` or `scroll`. `window.scrollY` is the same before and after scrolling the aside. |
| `level-1-hides-open-drawer` | Only if `#level-1` exists: open the drawer, then check `#level-1`. The aside and the toggle are both not visible. |
| `print` | `page.emulateMedia({ media: 'print' })` with the drawer closed: the aside is visible and the toggle is not. |

**Width checks** (1920×1000):

| Check | Assertion |
|---|---|
| `full-width` | Every visible `.full` is at least `clientWidth − 49` px and at most `clientWidth − 32` px wide (`document.documentElement.clientWidth`). |
| `wide-width` | Every visible `.wide` is at most 1600px wide and wider than 1100px. |
| `text-measure` | Every visible `main p` that is not inside `.wide` or `.full` is at most 780px wide. |

**Before each check:** clear `localStorage`. Every check is independent of the others.

- [ ] **Step 5: Run it against the current examples to see it fail**

Run: `node scripts/verify-glossary.mjs docs/examples/02-iri-explainer.html docs/examples/11-warehouse-floor-plan.html docs/examples/12-assembly-regime.html`
Expected: three `FAIL` blocks, including `starts-closed` and `describedby` on each file. Also run `scripts/check-examples.sh`. Expected: those three files fail with `glossary without drawer button`.

- [ ] **Step 6: Commit**

```bash
git add scripts/ .gitignore CONTRIBUTING.md
git commit -m "Add glossary and wide-layout checks"
```

---

### Task 2: Canonical snippet in `patterns.md`, proven on example 02

**Files:**
- Modify: `skills/explain-in-html/references/patterns.md:118-121` (replace "Side glossary")
- Modify: `docs/examples/02-iri-explainer.html` (layout `:27-28`, glossary `:53-56`, `:143-…`, the toggle bar, the script)

**Interfaces:**
- **Consumes:** the names table above, and `verify-glossary.mjs` from Task 1.
- **Produces:**
  - The section "Glossary: popover + drawer" in `patterns.md`: markup skeleton + required behaviours (~20 lines, no full CSS/JS).
  - The reference implementation in `02-iri-explainer.html`: one CSS block and one `<script>` block, each marked `glossary: popover + drawer`. Tasks 3–5 copy them verbatim.
  - The section "Wide layout" with the `.page` grid snippet and the `.full` criterion (more than about 6 columns or zones, or labels under 11px at 1100px).

- [ ] **Step 1: Run the test on 02 to confirm it fails**

Run: `node scripts/verify-glossary.mjs docs/examples/02-iri-explainer.html`
Expected: `FAIL`.

- [ ] **Step 2: Write both sections in `patterns.md`**

**Glossary: popover + drawer**
- Keep the existing **When** line and the reading-levels sentence.
- Add the markup from the names table.
- CSS:
  - Without `html.js-glossary`, the aside is a static block at the end.
  - With `html.js-glossary`, the aside becomes the drawer: `position: fixed`, right edge, `width: min(22rem, 100vw)`, `top: 0; bottom: 0`, `overflow-y: auto`, `overscroll-behavior: contain`. It is hidden via `visibility: hidden` + transform until `[data-open]`.
  - At ≤ 600px the drawer is full screen and `#term-pop` is a bottom sheet.
  - All colors come from theme tokens.
  - `@media print` shows the aside statically and hides `.glossary-toggle` and `#term-pop`.
- JS:
  - Build `#term-pop`, set `aria-describedby`, and unhide the toggle.
  - Popover events: hover/focus/first tap open; leave/blur/Esc/outside tap close.
  - A mouse click or Enter on a `.term` acts like `.term-pop-more`: it opens the drawer at the entry and sets the hash. A first tap on touch only opens the popover.
  - Position the popover clamped to the viewport.
  - The toggle opens and closes the drawer; Esc closes it and returns focus.
  - `.term-pop-more` opens the drawer and sets the hash.
  - Persist to `localStorage` key `glossary-open` inside try/catch.
  - If the page has reading levels, the drawer is closed when `#level-1` is checked. CSS already hides it with the `[data-level="5"]` rule; also hide the toggle via `body:has(#level-1:checked) .glossary-toggle { display: none }`.

**Wide layout**
- The tier table from the spec.
- The `.page` grid with named lines:
  `[full-start] minmax(0,1fr) [wide-start] minmax(0, calc((1600px - 70ch)/2)) [content-start] min(70ch, 100%) [content-end] minmax(0, calc((1600px - 70ch)/2)) [wide-end] minmax(0,1fr) [full-end]`, with `padding-inline: clamp(16px, 2vw, 24px)` on `.page` (at 400px this must sum to the viewport, with no overflow).
- The `.full` criterion, and the viewBox note (about 1800 units wide).

- [ ] **Step 3: Migrate 02 by copying the snippet**

- Replace `.layout`'s two-column grid with `.page`. The quarter-car `figure.demo` becomes `.wide`.
- The glossary `aside` moves to the end of `main` with the new ids. Each term in the text becomes `a.term`, wrapping the existing first mention of each glossary term.
- Add the toggle next to the theme button. If there is no theme button, put it in the same fixed corner bar.

- [ ] **Step 4: Run all checks on 02**

Run: `node scripts/verify-glossary.mjs docs/examples/02-iri-explainer.html && node scripts/verify-example.mjs --shots "$SCRATCH/shots" docs/examples/02-iri-explainer.html && scripts/check-examples.sh`
Expected: `ok` for 02 in all three (11 and 12 may still fail `check-examples.sh`). Look at the `desktop-dark` and `wide` screenshots: the popover and drawer are legible in dark (Review focus 5), and the demo is wider than before.

- [ ] **Step 5: Commit**

```bash
git add skills/explain-in-html/references/patterns.md docs/examples/02-iri-explainer.html
git commit -m "Glossary popover + drawer and wide layout pattern; migrate IRI example"
```

---

### Task 3: Migrate example 12 (assembly regime)

**Files:**
- Modify: `docs/examples/12-assembly-regime.html` (`:44-48` layout, `:162-168` glossary CSS, `:191` toggle bar, `:516-…` aside, script near `:536`)

**Interfaces:**
- **Consumes:** the marked glossary CSS and script blocks from `02-iri-explainer.html` (Task 2), and the contract in `patterns.md`.

- [ ] **Step 1: Confirm it fails**

Run: `node scripts/verify-glossary.mjs docs/examples/12-assembly-regime.html`. Expected: `FAIL`.

- [ ] **Step 2: Migrate**

- The term links in 12 have no class today. Every one of them becomes `a.term` with an `href="#g-<slug>"` that matches a `dt` id.
- `.wrap`/`.layout` become `.page`. Delete `main > * { max-width: 72ch }` and `main > .wide`; the grid now handles the text measure.
- `.ideas`, `.tour` and `.duo` get `.wide`. Widen the `.duo` breakpoint so the plan and the text sit side by side from 1100px.
- The glossary uses the pattern and keeps `data-level="5"`. The `.glossary-toggle` goes next to the fixed `.theme-toggle` at `:191`.

- [ ] **Step 3: Run all three checks on 12, and look at the dark and wide screenshots**

Expected: `ok` everywhere, including `level-1-hides-open-drawer`.

- [ ] **Step 4: Commit:** `git commit -am "Migrate assembly-regime example to glossary drawer and wide layout"`

---

### Task 4: Migrate example 11 (warehouse floor plan) with the plan at full width

**Files:**
- Modify: `docs/examples/11-warehouse-floor-plan.html` (`:47` wrap, `:130` `.walk`, `:155-167` and `:178-200` glossary CSS, `:208-218` levelbar, `:237-…` the floor-plan SVG with `viewBox="0 0 1000 500"`, `:555-…` aside, script near `:577`)

**Interfaces:**
- **Consumes:** the marked glossary CSS and script blocks from `02-iri-explainer.html` (Task 2), and the contract in `patterns.md`.

- [ ] **Step 1: Confirm it fails**

Run: `node scripts/verify-glossary.mjs docs/examples/11-warehouse-floor-plan.html`. Expected: `FAIL`.

- [ ] **Step 2: Migrate the glossary and layout**

- `.doc`'s two-column grid becomes `.page`. `.wrap` keeps its role only in the levelbar.
- The glossary toggle goes into `.levelbar` before `.theme-toggle`.
- The `.walk` section (the plan next to its steps) gets `.full`.

- [ ] **Step 3: Redraw the floor plan for the full width**

- Change `viewBox` to `0 0 1800 600`.
- Spread the zones horizontally, using the extra width for wider aisles and labels at their current font size. Do not scale the old drawing.
- Keep every existing zone id, cargo id and step hook, so the player and the synced table keep working.
- Below 900px, `.walk` stays one column and the SVG sits in an `overflow-x: auto` container.

- [ ] **Step 4: Remap coordinates in the script**

Run `grep -n -E "translate|setAttribute\('(x|y|cx|cy|x1|x2|y1|y2|points|d|transform)'|\b[0-9]{3,4}\b" docs/examples/11-warehouse-floor-plan.html` over the `<script>`. Remap every coordinate literal, path and transform the player or the cargo animation uses to the 1800×600 viewBox.

- [ ] **Step 5: Run all three checks, then do the manual walkthrough**

Expected: `ok` everywhere. Manually: ▶ Play runs every step and the highlighted zones match, at 1280 and 1920. Look at the dark and wide screenshots.

- [ ] **Step 6: Commit:** `git commit -am "Migrate warehouse example; floor plan at full width"`

---

### Task 5: New example 13: "What happens when you open an HTTPS URL"

**Files:**
- Create: `docs/examples/13-https-request.html`

**Interfaces:**
- **Consumes:**
  - The marked glossary blocks from `02-iri-explainer.html` and the wide-layout grid (Task 2).
  - The reading-levels markup in `patterns.md`.
  - The walkthrough-with-play pattern and theme toggle as implemented in `11-warehouse-floor-plan.html`.

- [ ] **Step 1: Run the tests against the empty file to see them fail**

Create the file with only `<!doctype html><title>x</title>`. Run `node scripts/verify-glossary.mjs docs/examples/13-https-request.html`.
Expected: `skip` (no glossary yet). Then run `scripts/check-examples.sh`. Expected: `13-https-request.html` fails with `no viewport meta`, among others.

- [ ] **Step 2: Write the page**

**Header:** the prompt header comment `Produced by the explain-in-html skill`, with prompt "explain what happens when you open an HTTPS URL".

**Structure**
- A levelbar with 1/5/10 minutes, the glossary toggle and the theme toggle.
- A TL;DR.
- A `.full` sequence diagram:
  - **Lanes:** Browser · DNS resolver · CDN edge · Origin.
  - **Phases, left to right:** DNS lookup, TCP handshake (SYN, SYN-ACK, ACK), TLS 1.3 handshake (ClientHello with SNI and ALPN, ServerHello + certificate chain, Finished), HTTP/2 request, cache miss to origin, response, keep-alive.
  - **Timing:** a time axis in RTTs, with one example clock (for example, 20 ms RTT to the edge and 80 ms edge→origin).
  - **Size:** `viewBox` about `0 0 1800 520`.
- A walkthrough with play that highlights one phase per step and never autostarts.
- A `.wide` table: cold first visit vs repeat visit (cached DNS, 0-RTT resumption, CDN hit), with ms.
- "Common mistakes" and "Where you'll meet it".
- Glossary of 12 terms with `data-level="5"`: RTT, DNS resolver, TTL, SYN/ACK, TLS handshake, SNI, ALPN, certificate chain, CDN edge, origin, keep-alive, 0-RTT.

**Reading levels**
- At level 1, terms are explained inline and are not linked.
- Level 10 adds the 0-RTT replay caveat and the edge→origin connection reuse.

- [ ] **Step 3: Run all three checks on 13, then the manual checks from the spec**

The manual checks are: mouse, Tab and emulated touch; Esc and focus return; JS off; print preview; level 1.
Expected: `ok` everywhere.

- [ ] **Step 4: Commit:** `git add docs/examples/13-https-request.html && git commit -m "Add HTTPS request example"`

---

### Task 6: Remaining skill guidance

**Files:**
- Modify: `skills/explain-in-html/SKILL.md:22`
- Modify: `skills/explain-in-html/references/reports-and-research.md:15,20,105-130`
- Modify: `skills/explain-in-html/references/diagrams-and-illustrations.md` (one paragraph in the general diagram section)
- Modify: `skills/explain-in-html/references/verify-before-delivering.md:59` (widths) and the interaction checklist

- [ ] **Step 1: Make the text changes from spec §3**

- **`SKILL.md:22`:** "a glossary on the term (popover) and in a drawer".
- **`reports-and-research.md`**
  - Replace the two "in the margin" bullets with one line pointing at the `patterns.md` pattern.
  - Delete "Bottom glossaries are never read".
  - In the skeleton, the aside closes `main` and the toggle appears in the header.
- **`diagrams-and-illustrations.md`:** the `.wide`/`.full` choice and the viewBox-for-real-width rule.
- **`verify-before-delivering.md`**
  - Add 1600px and >2000px to the widths.
  - Add popover (mouse, keyboard, touch), drawer focus return, and JS off.

- [ ] **Step 2: Check that nothing still says "margin"**

Run: `grep -rn -i "margin" skills/explain-in-html | grep -i gloss`
Expected: no output.

- [ ] **Step 3: Build the skill zip to make sure packaging still works**

Run: `scripts/build-skill.sh "$SCRATCH/explain-in-html.skill"`
Expected: exit 0.

- [ ] **Step 4: Commit:** `git commit -am "Skill guidance: glossary popover + drawer, wide layout, new checks"`

---

### Task 7: Site, README, changelog, version

**Files:**
- Modify: `docs/index.html`
  - The hero/footer count "12 example files" becomes 13 (`:963`, and the hero count).
  - Add a card for 13 after the card at `:694`, in the same markup.
- Modify: `README.md` ("What this fork adds": add a bullet; the heading becomes 1.5.0)
- Modify: `CHANGELOG.md` (new `## [1.5.0] - <date>` with Added and Changed sections)
- Modify: `.claude-plugin/plugin.json:4`, `.claude-plugin/marketplace.json:11` (`"version": "1.5.0"`)

- [ ] **Step 1: Make the edits**

- **CHANGELOG**
  - Changed: the glossary pattern; the width tiers; examples 02, 11 and 12 migrated; floor plan redrawn.
  - Added: example 13, `verify-glossary.mjs`, the 1920 view and the new static rules.

- [ ] **Step 2: Full verification**

Run: `scripts/check-examples.sh && node scripts/verify-example.mjs docs/examples/*.html docs/index.html && node scripts/verify-glossary.mjs docs/examples/*.html`
Expected: every line `ok` or `skip`, exit 0.

- [ ] **Step 3: Commit:** `git commit -am "Version 1.5.0"`
