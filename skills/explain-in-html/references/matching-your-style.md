# Matching the User's Style

Bad-looking HTML is worse than good markdown. Most of the harm an HTML-artifact skill can do is producing generic-looking output: gradient cards, emoji headers, four shades of indigo, the default Tailwind aesthetic. Avoid that. Read this reference whenever the artifact will be shared, presented, or kept around for any length of time.

## Three rules of thumb

1. **Restraint over decoration.** A calm typographic layout — system serif body, generous spacing, one or two restrained accent colors — beats a busy "dashboard" almost every time. If you're tempted to add a gradient, don't.
2. **Use real type.** Default the body to a real serif (Charter, Iowan, Source Serif, Tinos, system serif fallback) for documents and explainers. Sans-serif (Inter, system-ui) for tools and editors. 16–18px body, 60–75ch line length, 1.5–1.6 line height. These numbers are not negotiable; they're table stakes.
3. **Color carries meaning, not mood.** If a color appears in the artifact it should be doing work — severity, status, category, axis. If a color is there for vibe, remove it.

   The accent is for the page's own chrome: links, focus, the selected control, the current step. Categorical colors are a separate budget: when a diagram or chart tracks several entities (shipments, customers, services, data series), give each one a color, at most five, distinct from the accent and from each other, with a dark-mode value each, and repeat it everywhere that entity appears. Always pair the color with a label or letter. Use `--warn`, `--danger` and `--ok` for state, never an entity color.

## The design-system-from-codebase trick

When the user has an existing visual identity (a deployed product, a brand, a codebase), don't invent one. Build a one-time **design system reference HTML file** by reading the codebase, then have it sit alongside future artifacts as input.

The flow:

1. Point Claude at the user's codebase (Tailwind config, theme file, design tokens, CSS variables, any `theme.ts` / `colors.ts`).
2. Generate `design-system.html` — color swatches with hex/token name, type scale specimens, spacing/radius/shadow examples. (See `design-and-prototypes.md` for the layout.)
3. Save it somewhere it can be reused: project root, `.claude/` folder, wherever fits.
4. For every subsequent HTML artifact, read `design-system.html` first, then use those tokens as the artifact's CSS variables.

This is one-time work that pays off across every future artifact. Suggest it the first time the user asks for an HTML artifact in a project that has a real design system.

## When there's no existing system: the safe default

Use this baseline if the user hasn't specified anything and there's no codebase to read:

```css
:root {
  /* Neutral, calm, works in light and dark */
  --bg:        #fafaf7;
  --surface:   #ffffff;
  --ink:       #1a1a1f;
  --ink-soft:  #555560;
  --rule:      #e7e5df;
  --accent:    #8b5cf6;     /* one accent only */
  --accent-ink:#6d28d9;     /* accent as text, or as a fill under light text */
  --warn:      #d97706;
  --danger:    #b91c1c;
  --ok:        #15803d;

  --serif: Charter, "Iowan Old Style", "Source Serif 4",
           ui-serif, Georgia, serif;
  --sans:  Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
  --mono:  ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace;
}

/* Dark: once for the system preference, once for a manual toggle. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg:       #0e0e12;
    --surface:  #16161c;
    --ink:      #f1f1f4;
    --ink-soft: #a8a8b3;
    --rule:     #2a2a32;
    --accent:   #a78bfa;
    --accent-ink:#c4b5fd;
  }
}
:root[data-theme="dark"] {
  --bg:       #0e0e12;
  --surface:  #16161c;
  --ink:      #f1f1f4;
  --ink-soft: #a8a8b3;
  --rule:     #2a2a32;
  --accent:   #a78bfa;
  --accent-ink:#c4b5fd;
}

html { background: var(--bg); color: var(--ink); }
body { font: 17px/1.55 var(--serif); max-width: 70ch;
       margin: 4rem auto; padding: 0 1.25rem; background: var(--bg); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
h1 { font-size: 2.2rem; line-height: 1.15; letter-spacing: -.01em; }
h2 { font-size: 1.4rem; margin-top: 2.4em; }
code, pre { font-family: var(--mono); font-size: .92em; }
pre { background: var(--surface); border: 1px solid var(--rule);
      padding: 1rem; border-radius: 4px; overflow-x: auto; }
table { border-collapse: collapse; width: 100%; }
th, td { padding: .5rem .75rem; border-bottom: 1px solid var(--rule);
         text-align: left; vertical-align: top; }
```

`--accent` is for outlines, focus rings and thin rules. Text in the accent color, and any filled control with text on it (the selected segment, the current step), uses `--accent-ink`, with `--bg` as the text color on top. The plain accent under white text is about 4.2:1 and fails the 4.5:1 minimum.

### Theme button

Every page gets one small button that cycles **system → light → dark**. It sets or removes `data-theme` on `<html>`, which the two dark blocks above already honor. Put it in a corner (top right, or inside a sticky bar if the page has one), label it in the page's language, and remember the choice when storage is available.

```html
<!-- in <head>, before the <style>, so the saved theme applies before first paint -->
<script>try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}</script>

<!-- anywhere in <body> -->
<button class="theme-toggle" type="button">◐ System</button>
```

```css
.theme-toggle { position: fixed; top: .75rem; right: .75rem; z-index: 10;
  font: 13px/1 var(--sans); color: var(--ink); background: var(--surface);
  border: 1px solid var(--rule); border-radius: 999px; padding: .4rem .7rem; cursor: pointer; }
@media print { .theme-toggle { display: none; } }
```

```js
(() => {
  const btn = document.querySelector('.theme-toggle'), root = document.documentElement;
  const order = ['system', 'light', 'dark'];
  const label = { system: '◐ System', light: '☀ Light', dark: '☾ Dark' };   // translate to the page's language
  let t = root.dataset.theme || 'system';
  const show = () => { btn.textContent = label[t]; btn.setAttribute('aria-label', 'Theme: ' + label[t].slice(2)); };
  btn.addEventListener('click', () => {
    t = order[(order.indexOf(t) + 1) % order.length];
    if (t === 'system') delete root.dataset.theme; else root.dataset.theme = t;
    try { t === 'system' ? localStorage.removeItem('theme') : localStorage.setItem('theme', t); } catch (e) {}
    show();
  });
  show();
})();
```

If the page has print styles that reset colors on `:root`, write the selector as `:root, :root[data-theme]`, or a reader who chose dark prints a dark page. The label says the current mode, not the next one. If the page already has a sticky bar (a reading-level selector, a toolbar), put the button in it instead of fixing it to the corner, so the two don't overlap. Surfaces that supply their own theme switch (some published-artifact hosts) don't need it.

That's enough to make a document that looks deliberate. Add complexity only when the artifact actually needs it — sliders, color swatches, charts, etc.

## Tools and editors get a different default

For editors and dashboards, switch the body to sans-serif and tighten the layout:

```css
body { font: 14px/1.4 var(--sans); max-width: none;
       margin: 0; padding: 1rem; }
```

Editors are tools. Tools should feel responsive and dense, not magazine-airy.

## Frontend-design plugin / skill

If the user has a `frontend-design` skill or plugin installed, or a design-system file in the project, defer to its conventions before using the baseline above. Look for it wherever skills live in the current harness; don't assume a path.

## What "AI default look" feels like — avoid

A shorthand list of the things to *not* default to:

- Cards everywhere, with rounded corners and shadows, on a gray background.
- A full-bleed gradient hero.
- Emoji as section headers (📊 Analytics).
- Four shades of indigo or violet doing nothing in particular.
- Shadcn-shaped components when no shadcn library is needed.
- "Glass morphism," frosted blur, animated background gradients.
- Centered everything.
- A header with a logo placeholder.

If the artifact has any three of those, restart.

Two newer tells, now that models are better at the old ones: a "hero" stat row of four giant numbers on a page that isn't a dashboard, and section dividers made of decorative icons. Both are decoration pretending to be structure.

## What good looks like

Real publications, real product screenshots, real reference docs. Calm typography, restrained ink, two accent colors maximum, real diagrams instead of icon decoration. Stripe Press pages. Ben Frain's writing. Bartosz Ciechanowski's explainers. The New York Times graphics desk. The OEIS. Things that look like *someone read them*, not like they were generated.
