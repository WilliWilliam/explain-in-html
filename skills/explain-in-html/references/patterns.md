# Patterns

Rules learned by comparing real artifacts. They complement `SKILL.md`; they don't replace it.

**How to apply them:** each pattern says when it applies. Use it only when the content calls for it; don't force any. If a pattern clashes with what the user asked for or with the project's design system, those win.

Priority order: user's instruction → project's design system → these patterns → the skill's defaults.

UI labels below ("Step N of M", "▶ Play", "Reading time") are written in English; on a page in another language, write them in that language.

---

## 1. Diagrams and notation

**Standard notation before metaphors.**
When: the content is technical (systems, APIs, authentication, data).
Use the notation an engineer recognizes: sequence diagram, swimlanes, state machine, architecture. A visual metaphor (drawing a software system as a factory or a shipping route) only if it clarifies something the notation doesn't show. Boxes and arrows aren't generic when they're the right notation.
A metaphor means drawing a place for something that isn't a place. When the subject *is* a physical place (warehouse, port, terminal, airport, plant), the floor plan is the standard notation: see "Draw the place".

**Complete sequence diagram.**
When: several systems exchange messages.
Show all the messages at once, in addition to any step-by-step walkthrough. Request and response in separate lanes, with the protocol or format written on each leg (REST · JSON, SOAP · XML). If something fails, mark the exact point where the flow breaks.

**Two cut-off points, two markers.**
When: the concept has two distinct thresholds people confuse (where risk transfers and how far the seller pays; where one system's responsibility ends and the other's begins).
Mark both, with different styles (for example, solid and dashed line) and a label saying what each one means.

**Draw the place.**
When: it's a physical process (a warehouse, a port, a terminal, an airport, a plant, a free trade zone).
A top-down plan with the real zones orients the reader better than abstract boxes. Draw it like an engineering drawing, not an illustration, and in the page's style (typography, buttons, colors from `matching-your-style.md`). If the user brings a reference plan, take its structure, not its look:
- **The stage stays still, the cargo moves.** Walls, doors, zones, lanes and racks stay fixed in every step. What changes from step to step is what moves between zones: packages, container, trucks, people, documents.
- **Order in space is order in the process.** Place the zones so the route reads in one direction (left to right, or top to bottom), from entry to exit. What's outside (yard, gate, dock, apron) goes on the edge.
- **Drawing line work.** Thick walls in `--ink`, doors as gaps in the wall, zones with a dashed outline in `--ink-soft` and their name in small caps, restricted zones with a `--danger` outline and hatching that's always visible. The current step's zone is highlighted with the accent. No shadows, perspective or decorative icons.
- **One color per entity, everywhere.** Each load, document or client has its color, and it's the same in the plan, the table, the legend and the text. These colors are categories, not accents: they don't count toward the "single accent" rule. Five at most, distinct from the accent and from each other, each with its dark-mode value, and always with a letter or label besides the color.
- **The exception is drawn where it happens.** A shortage is a dashed gap in its lane; an inspection is its zone highlighted; the note ("4 / 5 short") sits on the spot, not in a separate paragraph.
- **Physical and paperwork side by side.** If the process has papers (manifest, transport document, declaration), show a table next to the plan that advances with it: "on the floor" and "on paper" have to match.
- **The fixed place goes in the HTML.** Walls and zones are written in the SVG; JS only moves objects. If the JS fails, the plan still shows complete.
- **On phones, the plan scrolls inside its box, not the page.** A container with `overflow-x: auto`, `tabindex="0"` and `aria-label`, and the SVG with a `min-width` that keeps labels legible.

If the plan has a step-by-step walkthrough, apply "Walkthrough with play".

**Transitions with their trigger.**
When: the content is a cycle of states.
Between each state, show the event or document that moves it to the next.

## 2. Interaction

**Simulators that break.**
When: there's a process that can fail.
Let the reader break it with controls (each system's status, missing data, credentials, sync or async mode, duplicate control), not only with fixed scenarios. Show what each system does, what state it's left in and who has to act.

**Walkthrough with play.**
When: a diagram has a step-by-step walkthrough (a plan where cargo moves, a message sequence, a state machine that advances). Not on static diagrams: if there are no steps, there's nothing to play.
Controls under the diagram: the steps with number and short name (clickable), **← Previous**, **Next →**, **▶ Play** and "Step N of M".
- It never starts on its own on load. The reader decides. Pressing ▶ advances to the next step right away.
- Any manual action (a step, previous, next, the arrow keys) stops playback. Arrow keys don't change steps when focus is on the level selector, the scrollable plan or a table: they already have a use there.
- It stops at the end. Pressing ▶ on the last step goes back to the first (not the second) and continues from there.
- It pauses on reaching any step that asks the reader something. A question that skips itself is useless. If the question is hidden at the chosen reading level, it doesn't pause there.
- Each step's duration depends on its visible text: about 3 words per second, 4 seconds minimum.
- The button switches its text between ▶ Play and ❚❚ Pause (no `aria-pressed`: the text already says what it does). "Step N of M" goes in `aria-live="polite"`.
- With `prefers-reduced-motion: reduce` transitions are removed, but the steps still work.
- Everything fixed in the diagram is always visible (as in "Complete sequence diagram"); steps only change what moves and what's highlighted.
- When printing, the controls are hidden and the current step prints.

**The real artifact at each step.**
When: a technical process is explained step by step.
Show what actually travels or gets recorded at that point: the message with its headers, the document, the log line.

**Linked equivalents.**
When: there are two representations of the same data (JSON and XML, a field in one system and its equivalent in another, a term and its definition).
On hover, keyboard focus or tap on one, its pair is highlighted.

**Variants when the detail changes the outcome.**
When: a minor detail changes the conclusion (the delivery point in an Incoterm, the sending mode in an integration).
Offer the variants as options the reader can toggle.

**Export to text.**
When: the reader edits something, or a simulator's result is useful for support.
Add "copy as text" with a format ready to paste into an email or ticket.

## 3. Content and structure

**Compact.**
Prefer dense, easy-to-scan pages over long, airy ones. Don't repeat in prose what a diagram or table already shows.

**Key ideas in cards.**
The two or three ideas the reader must take away are highlighted in cards, not buried in paragraphs. They're a single row of two or three, no shadows or icons, near the top. That isn't the "card grid for its own sake" the style guide forbids: here the card marks what to remember.

**Reading levels: 1, 5 and 10 minutes.**
When: the page is meant to be read and understood (an explainer, a PR description or review, a report, a post-mortem, a plan). Not on dashboards, editors or decks, nor on pages read in full in a minute.
One page with a selector at the top: **1 min · 5 min · 10 min**, opening at 10. Levels stack: 5 includes 1, and 10 includes 5.
- **1 min:** what changed or what it is, and why it matters, in three or four sentences, plus the key ideas and a single figure. About 200 words.
- **5 min:** the concepts you need to understand (structure, flow, main decisions), with their diagrams.
- **10 min:** discarded alternatives, risks, edge cases, open questions and the detail that matters.

Each level must stand on its own. No "see the diagram below" if that diagram is hidden at that level, and no links to hidden sections. If a sentence announces a list ("there are two places"), all its items go in the same level. What a figure always shows (step names, each step's short text, its table cells) counts as level 1: write it without jargon or explain the term right there.
If the user asks for a single length ("explain it in 1 minute", "5 min version"), make only that level, with no selector.

Markup (always use it the same way):
```html
<fieldset class="level">
  <legend>Reading time</legend>
  <input type="radio" name="level" id="level-1" value="1"><label for="level-1">1 min</label>
  <input type="radio" name="level" id="level-5" value="5"><label for="level-5">5 min</label>
  <input type="radio" name="level" id="level-10" value="10" checked><label for="level-10">10 min</label>
</fieldset>
<!-- Level 1 content is unmarked. data-level="N": visible from level N. -->
<section data-level="5">…</section>
<section data-level="10">…</section>
```
```css
body:has(#level-1:checked) [data-level="5"],
body:has(#level-1:checked) [data-level="10"],
body:has(#level-5:checked) [data-level="10"] { display: none; }
```
The radios can sit inside a container styled as segmented buttons (the radio hidden with `opacity: 0` and the label as the button). Hide with CSS, not JS. If something fails, the full page shows. A bit of JS can store the level in the URL (`#5min`) for sharing the link. Printing outputs the chosen level. Check all three levels when reviewing the page.

**Glossary: popover + drawer.**
When: there are more than four or five specialized terms.
With reading levels, the glossary starts at level 5. In what shows at level 1, terms are explained in the same sentence and aren't linked to the glossary, which is hidden there.
```html
<button class="glossary-toggle" type="button" aria-controls="glossary" aria-expanded="false" hidden>Glossary</button> <!-- next to .theme-toggle -->
<p>… the <a class="term" href="#g-sni">SNI</a> …</p>
<aside class="glossary" id="glossary" data-level="5" aria-labelledby="glossary-t"> <!-- last child of main; data-level only with reading levels -->
  <h2 id="glossary-t">Glossary</h2>
  <dl><dt id="g-sni">SNI</dt><dd id="g-sni-d">Server Name Indication: …</dd></dl>
</aside>
```
A short script adds `html.js-glossary`, one shared `#term-pop` and unhides the button. Copy the marked CSS and script blocks from `docs/examples/02-iri-explainer.html`. It must keep these behaviours:
- Without JS and when printing, the aside is a list at the end of `main` and term links jump to it.
- Each `.term` gets `aria-describedby="g-<slug>-d"`. Hover, focus or a first tap opens the popover (the `dd` text plus "See in glossary →"), clamped to the viewport. Leaving, blur, Esc or a tap outside closes it.
- A mouse click or Enter on a term opens the drawer at its entry and sets the hash. On touch, the first tap only opens the popover.
- The drawer is a fixed side panel that overlays the content and never pushes it. It starts closed. Esc or the button closes it, and focus returns to the button. It scrolls inside itself (`overscroll-behavior: contain`).
- The open state is stored in `localStorage` key `glossary-open`, inside try/catch.
- At level 1 the glossary and its button are hidden, even with the drawer open.
- Colors come from the theme tokens only, so both themes work. On phones the drawer is full screen and the popover is a bottom sheet.

**Wide layout.**
When: a figure, table or diagram needs more than the text measure.
| Class | Width | For |
|---|---|---|
| (default) | `min(70ch, 100%)` | Running text, lists, callouts |
| `.wide` | `min(1600px, 100%)` | Tables, comparisons, medium diagrams, card grids |
| `.full` | window width minus a 16–24px gutter | Floor plans, many-column flows, diagrams that gain from space |

One centered column in `<div class="page">`, no side column. The gutter is padding, so `.full` stops at it:
```css
.page { display: grid; padding-inline: clamp(16px, 2vw, 24px);
  grid-template-columns: [full-start] minmax(0,1fr) [wide-start] minmax(0, calc((1600px - 70ch)/2)) [content-start] min(70ch, 100%) [content-end] minmax(0, calc((1600px - 70ch)/2)) [wide-end] minmax(0,1fr) [full-end]; }
```
Children default to `grid-column: content`; `main` and its sections pass the lines down with `subgrid` (see 02). Grid items don't collapse margins, so give text one-sided margins.
Use `.full` only when the diagram has more than about 6 columns or zones, or its labels would render below 11px at 1100px; otherwise `.wide`. A `.full` SVG gets a `viewBox` drawn for its real width (about 1800 units), not an 800-unit drawing scaled up. On phones all tiers are 100% with a 16px gutter; anything that still doesn't fit scrolls in an `overflow-x: auto` box.

**A case threaded end to end.**
When: an example is used.
Give the case continuity: where the problem started, where it could have been caught and where it blew up.

**Actionable failures.**
When: errors are explained.
Classify them by the key question: does it fix itself by waiting, or does someone have to correct something? For each: what you see, whether retrying makes sense and who acts. Warn when a successful response can hide an error.

**Common mistakes.**
When: the reader is new to the subject.
Include the most common beginner mistakes, with the fix.

**Questions for the expert.**
When: the reader depends on another team (technical, legal, operations).
Close with the questions they should ask that team.

## 4. Data and context

**Real dates.**
When: there are schedules or deadlines.
Count business days and the country's real public holidays, not just calendar days.

**Local context.**
When: the subject is specific to a country.
Use that country's real agencies, regulations, documents and places (for example, in Colombia: DIAN, customs release (levante), real ports and roads).

**Names.**
Use the product, company or system name the user gives. If they don't give one, use a generic, clearly fictional one. Never use this skill's or its author's name as a product name.
