# Diagrams & Illustrations

Inline SVG gives the agent a real pen. The output is vector art the user can tweak by hand and copy out. Don't fall back to ASCII or "imagine a flowchart that…" prose — render it.

## Figure sheet for a post or doc

For "make me the diagrams for this article" or "draw the figures I'll use in the writeup."

**Layout**
- One figure per section, each in its own `<figure>` with a caption.
- Each figure is inline `<svg>`, sized for both light and dark backgrounds (use CSS variables or `currentColor`).
- A "copy SVG" button below each figure. The whole point is that the user pastes them into their real document.
- Consistent visual language across figures: same line weight, same arrowhead style, same palette, same type face. They should look like a set.

**What's load-bearing**
- Visual consistency across the set. A scattered visual language reads as amateurish even if each figure is fine on its own.
- Copy buttons per figure. Without them the user has to view-source. With them this is a usable workflow.
- Sizing that survives reuse: don't hard-code colors that won't work in the destination doc.

## Annotated flowchart

For "diagram our deploy pipeline" or "show me how a request flows through the system."

**Layout**
- The flowchart as inline SVG, drawn properly: nodes with labels, edges with directionality, branching paths visually distinct from the main path.
- Click any node to expand a side panel with: what runs there, expected duration, what failure looks like, links to source.
- Highlight the **happy path** in a distinct color; failure/retry paths in a muted secondary color.
- A legend in the corner.

**What's load-bearing**
- Click-to-expand. The flowchart is the navigation, the panel is the content. Don't try to fit everything on the chart itself. Nodes are focusable (`tabindex="0"`) and open on Enter as well as click.
- Happy path highlight. Most of the time the reader cares about the common case; let them tune out the edges initially.
- Direction indicators on edges. Without arrows, a flowchart is just a graph.

**Common mistakes**
- Auto-layout via Mermaid that produces a tangled mess. If the layout is bad, hand-place the nodes. SVG positions are just numbers.
- Drawing every possible edge case. A flowchart with 40 nodes is unreadable; abstract the rare branches into a single "error handling" subgraph.
- Using only color to distinguish states. Use shape *and* color so it survives colorblind viewing and grayscale printing.

## Floor plan of a physical process

For logistics, foreign trade, operations: "explain how a consolidated container is unloaded at the warehouse," "walk me through the port," "how does a parcel move through the hub." When the subject is a place, the top-down plan *is* the standard notation; boxes and arrows throw away the one thing the reader already knows, the layout. The rules live in `patrones.md` ("Dibuja el lugar", "Recorrido con reproducir"); this is the shape.

**Layout**
- A top-down plan in inline SVG: building walls, doors as gaps, yard or quay outside, zones as dashed outlines with uppercase labels. Zones ordered in the direction the process runs.
- Below or beside it, the paper trail as a table (document, owner, declared vs. counted, status) that updates with each step.
- Step controls under the plan: numbered step chips, previous, next, play/pause, "Step N of M".
- Like every artifact, the plan uses the page's tokens from `matching-your-style.md`; it does not bring its own look.

**What's load-bearing**
- Static stage, moving cargo. The walls and zones are markup and never change; JS only translates the moving groups (`transform` with a CSS transition). With JS off the plan still reads.
- One color per entity across plan, table and prose.
- Exceptions drawn in place: a dashed ghost for a missing package, a hatched zone for inspection, a short note next to it.
- The plan scrolls inside its own box at phone width (`overflow-x: auto` wrapper with `tabindex="0"` and `aria-label`, SVG `min-width` around 720px). The page itself never scrolls sideways.

**Common mistakes**
- Isometric or illustrated warehouses. They look nice and hide the distances and adjacency the reader needs.
- Redrawing the whole plan per step, so zones jump around. The reader loses their place.
- Autoplay on load, or a play loop that runs past a question the step asks.

```html
<div class="plan-scroll" tabindex="0" aria-label="Warehouse plan (scrolls on small screens)">
  <svg class="plan" viewBox="0 0 1000 480" role="img" aria-labelledby="planDesc">
    <desc id="planDesc">Top-down plan: yard on the left, receiving dock, sorting lanes, storage, inspection and dispatch on the right.</desc>
    <defs>
      <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" stroke-width="2" opacity=".2"/>
      </pattern>
    </defs>
    <!-- stage: fixed, in markup -->
    <rect class="yard" x="0" y="0" width="140" height="480"/>
    <rect class="wall" x="140" y="20" width="840" height="440"/>
    <rect class="door" x="136" y="160" width="10" height="160"/>       <!-- gap in the wall -->
    <rect class="zone" x="160" y="140" width="110" height="200"/>
    <text class="zlabel" x="166" y="132">Receiving</text>
    <rect class="zone restricted" x="640" y="280" width="140" height="120"/>
    <text class="zlabel" x="648" y="300">Inspection</text>
    <!-- actors: moved by JS -->
    <g id="cargo"><g class="bx A" data-id="A1"><rect width="18" height="14"/></g>…</g>
    <g id="notes" aria-hidden="true"></g>
  </svg>
</div>
<div class="controls">
  <button id="prev" type="button">← Previous</button>
  <button id="next" type="button">Next →</button>
  <button id="play" type="button">▶ Play</button>  <!-- label swaps to ❚❚ Pause -->
  <span id="pos" aria-live="polite"></span>
</div>
```

```css
.plan-scroll { overflow-x: auto; }
.plan { display: block; width: 100%; min-width: 720px; height: auto; }
.plan .wall { fill: none; stroke: var(--ink); stroke-width: 6; }
.plan .door { fill: var(--surface); }
.plan .zone { fill: none; stroke: var(--ink-soft); stroke-width: 2; stroke-dasharray: 10 6; }
.plan .zone.restricted { stroke: var(--danger); fill: url(#hatch); }
.plan .zone.hot { stroke: var(--accent); }                 /* zone of the current step */
.plan .bx.A rect { fill: var(--A); }                         /* one categorical color per entity */
.plan .bx { transition: transform .8s cubic-bezier(.6,0,.3,1), opacity .4s; }
@media (prefers-reduced-motion: reduce) { .plan .bx { transition: none; } }
```

## SVG craftsmanship notes

For both figure sheets and flowcharts:

- **Use `viewBox`, not fixed `width`/`height`.** Lets the figure scale.
- **Use `currentColor` for ink** where possible. Lets the figure inherit text color and adapt to dark mode.
- **Round numbers.** `x="120"` not `x="119.7843"`. Easier for a human to tweak by hand.
- **Group with `<g>` and label.** A user editing the SVG needs to find things by structure, not coordinates.
- **Type set in SVG, not as `<text>`-rendered-as-paths.** Selectable, copyable, accessible.
- **No raster fallbacks.** If a thing can be drawn, draw it. PNGs of diagrams defeat the whole purpose.

## Example sketch — labeled flow

```html
<figure>
  <svg viewBox="0 0 600 200" role="img" aria-labelledby="title">
    <title id="title">Request lifecycle</title>
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
              markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
      </marker>
    </defs>

    <g class="node" data-step="ingress">
      <rect x="20" y="80" width="120" height="40" rx="6"
            fill="none" stroke="currentColor"/>
      <text x="80" y="105" text-anchor="middle">ingress</text>
    </g>
    <g class="node" data-step="auth">
      <rect x="180" y="80" width="120" height="40" rx="6"
            fill="none" stroke="currentColor"/>
      <text x="240" y="105" text-anchor="middle">auth</text>
    </g>
    <line x1="140" y1="100" x2="180" y2="100"
          stroke="currentColor" marker-end="url(#arrow)"/>
    ...
  </svg>
  <figcaption>Happy-path request flow. Click any step for details.</figcaption>
  <button onclick="copySvg(this)">Copy SVG</button>
</figure>
```
