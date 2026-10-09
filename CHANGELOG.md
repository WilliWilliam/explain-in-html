# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [semantic versioning](https://semver.org/).

## [1.4.0] - 2026-10-09

### Changed
- The whole repo is in English. Requests in Spanish still trigger the skill and still get answers in Spanish; only the repo's own text changed.
- `references/patrones.md` is now `references/patterns.md`, translated. It adds one line: UI labels follow the page's language. `SKILL.md` and `diagrams-and-illustrations.md` point to the new name.
- Reading-level markup uses `data-level`, `name="level"` and `#level-N` instead of `data-nivel`, `name="nivel"` and `#nivel-N`.
- Examples renamed and translated: `10-reading-levels.html`, `11-warehouse-floor-plan.html`, `12-assembly-regime.html`. The old names stay as redirect pages, so existing links (including `#5min`-style anchors) keep working; `check-examples.sh` checks that each redirect points at a file that exists.
- Evals renamed: `explain-e-invoicing-spanish`, `explain-in-one-sentence-spanish`, `explain-change-in-levels`, `explain-warehouse-deconsolidation`; graders `patterns-read` and `applies-patterns`. Descriptions and grader rubrics are in English; the Spanish cases keep their Spanish prompts and still require a Spanish reply.
- Plugin and marketplace descriptions are in English.
- Pages: the hero counts twelve examples, and the skill-structure diagram shows `patterns.md` next to `SKILL.md` as always read.

## [1.3.0] - 2026-10-08

### Added
- **Theme button** (system · light · dark) in universal rule 5 of `SKILL.md`, with the code in `references/matching-your-style.md`: it remembers the choice when storage is available, applies it before first paint, and hides when printing. Before, the page only followed the OS preference.
- `verify-before-delivering.md` asks to test all three modes, including light with the OS in dark mode.
- Examples 10, 11 and 12 carry the button: in the level selector's sticky bar when there is one, in the corner when there isn't.
- `verify-before-delivering.md` also asks to capture the 1 and 5 minute views when the page has reading levels.

## [1.2.0] - 2026-10-07

### Added
- **Walkthrough with play** pattern in `references/patrones.md`: a diagram with a step-by-step walkthrough gets clickable steps, previous, next, ▶ Play and "Step N of M". It never starts on its own, stops on any manual action and at the end, pauses on steps that ask a question, and gives each step a duration based on its text. It does not apply to static diagrams.
- `references/diagrams-and-illustrations.md`: **Floor plan of a physical process** section with the shape, what matters, common mistakes and an SVG skeleton.
- Example `docs/examples/11-plano-bodega.html`: deconsolidating a container in a bonded warehouse, with a warehouse floor plan, a synced documents table, a player, reading levels and deadlines with real dates. It was made by a fresh agent that only had the skill, as proof that the patterns work without seeing another floor plan and in the house style.
- Example `docs/examples/12-regimen-ensamble.html`: Colombia's import regime for motorcycle transformation and/or assembly, researched from official sources and drawn as the plant, showing where duties and taxes are suspended and where they are paid. Also made by a fresh agent with only the skill.
- Eval `explicar-desconsolidacion-bodega` (floor plan with zones and cargo per document, a player that never starts on its own and pauses on questions).

### Changed
- **Draw the place** goes from one line to concrete rules: fixed stage and moving cargo, zones in process order, engineering-drawing line work, one color per entity, the exception drawn where it happens, physical flow next to paperwork, the place fixed in the HTML, and the plan scrollable inside its box on phones.
- **Standard notation before metaphors** clarifies that a metaphor means drawing a place for something that isn't one; when the subject is a physical place (warehouse, port, terminal, airport), the floor plan is the standard notation.
- `SKILL.md` names floor plans of warehouses, ports, terminals and airports as spatial information, and lists them in the reference index.
- `matching-your-style.md` separates the accent (page controls) from category colors (diagram entities or data series): five at most, with a dark-mode value and always labeled. **Draw the place** asks for the page's style, not the style of a reference plan the user brings.
- **Walkthrough with play** specifies that ▶ advances right away, pauses on reaching a step with a question, and that arrow keys don't steal focus from the level selector, the plan or the tables.
- `matching-your-style.md` adds `--accent-ink` for text on the accent and selected controls: the base violet with white text gives 4.2:1, below the 4.5:1 minimum.
- **Reading levels** clarify that what a figure always shows (steps, table) counts as level 1, and that an announced list appears complete in its level. **Side glossary** starts at level 5; at level 1 terms are explained inline. **Key ideas in cards** is distinguished from the decorative grid.
- `verify-before-delivering.md` explains how to capture a step-by-step walkthrough and warns that Playwright's fake clock freezes transitions. `accessibility-and-print.md` asks for `lang` to match the content's language.

### Fixed
- The skill no longer mentions files in `docs/examples/`: the package only ships `SKILL.md` and `references/`, and pointing to an example introduced bias.

## [1.1.0] - 2026-10-07

### Added
- **Reading levels** pattern in `references/patrones.md`: pages meant to be read and understood (explainers, PRs, reports, post-mortems, plans) get a 1 / 5 / 10 min selector that opens at 10. Levels stack and are hidden with CSS (`data-nivel`), so without `:has()` or without JS the full page shows. If the user asks for a single length, only that level is made. It does not apply to dashboards, editors or decks.
- `SKILL.md` points to the pattern in the drafting step.
- Example `docs/examples/10-niveles-de-lectura.html`: the 1, 5 and 10 minute explainer prompt applied to the fork's own pattern commits, with UML class and sequence diagrams.
- Eval `explicar-cambio-en-niveles` (selector defaults to 10 min, levels marked, each level stands on its own) and grader `no-reading-levels` in `triage-editor-with-export`.

## [1.0.1] - 2026-10-04

### Changed
- The skill folder moves from `skills/html-artifacts/` to `skills/explain-in-html/`, matching its `name`. In Claude Code the skill shows up as `explain-in-html:explain-in-html` instead of `explain-in-html:html-artifacts`. Manual install copies the folder as is.

### Fixed
- The `skill-fired` and `skill-not-fired` graders recognize the skill by the name Claude Code gives plugin skills (`plugin:folder`).

## [1.0.0] - 2026-10-04

First version of **explain-in-html**, a fork of [dogum/html-artifacts](https://github.com/dogum/html-artifacts) 2.0.0. The entries below are from the original project.

### Added
- `references/patrones.md`: the fork's own patterns, learned by comparing real artifacts. `SKILL.md` always reads it before drafting.
- Spanish triggers in the skill's description ("explícame", "compara", "reporte", "diagrama", "plan", "tablero").
- Evals: `explicame-facturacion-electronica` (must trigger and apply the patterns) and `explicame-en-una-frase` (must not trigger). Every should-trigger case checks that `patrones.md` was read.

### Changed
- The skill and the plugin are named `explain-in-html`. The release zip is `explain-in-html.skill` and its inner folder matches the skill's name.
- Versioning restarts at 1.0.0 for the fork.

## [2.0.0] - 2026-09-14

The skill was written for models that needed to be told how to write HTML. Four months later they don't. This release moves the skill's budget from mechanics to judgment and verification, fixes the facts that had gone stale, and adds the distribution and testing scaffolding a shared skill should have.

### Added
- **Universal rule 8, verify before delivering.** Render headless and screenshot when a browser is available; run a read-through checklist when it isn't. The skill never stalls on a surface without tooling.
- **Workflow section** in SKILL.md: decide, pick the reference, match the style, draft, verify.
- **Four references:** `data-and-charts.md`, `accessibility-and-print.md`, `harness-mechanics.md`, `verify-before-delivering.md`.
- **Eval suite** under `evals/` for `claude plugin eval`: four should-trigger cases and three should-not-trigger cases, graded on both whether the skill fired and what it produced. Manual CI workflow with pinned models and a cost ceiling.
- **Plugin manifests** (`.claude-plugin/plugin.json`, `marketplace.json`) so `/plugin marketplace add dogum/html-artifacts` works and Claude Code users get updates.
- **Release workflow** that builds `html-artifacts.skill` from source on every `v*` tag and attaches it to a GitHub Release. **CI workflow** that validates frontmatter, manifests, and examples on every push.
- **Scripts:** `build-skill.sh`, `check-examples.sh`, `verify-example.mjs`.
- **Three examples:** annotated code review, design-token sheet, incident post-mortem.
- **Gallery issue template** for community-made artifacts. `CONTRIBUTING.md`.

### Changed
- **SKILL.md rewritten.** Shorter, with "stay in markdown" expanded to match "reach for HTML" in weight. Frontmatter now carries `license` and `metadata.version` and uses only Agent Skills spec fields.
- **Storage guidance.** Artifacts no longer say "no localStorage"; they say storage is unreliable in sandboxed surfaces, keep state in memory, and wrap access in try/catch.
- **Theme guidance.** Dark mode is defined twice: under `prefers-color-scheme` and under `[data-theme="dark"]`, so both system preference and a manual toggle work. Baseline CSS updated accordingly.
- **Editors** must have a keyboard path for every drag-and-drop, list their shortcuts, and show export text in a textarea as well as copying it.
- **Decks** get tap-to-advance for touch devices and a print stylesheet.
- **Code review severity tags** are worded as well as colored.
- **Canonical layout** moved from `skill/` to `skills/html-artifacts/` (plugin layout). The manual install command changed to match.
- **All six original examples** now pass the skill's rules: prompt header comment, both themes, visible focus, keyboard support on the triage board, focusable flowchart nodes. Two real bugs found by the new headless check were fixed: the comparison page overflowed at desktop width, and the explainer logged SVG attribute errors on load.
- **Docs site** updated: nine examples, twelve-spoke structure diagram, three install paths.

### Removed
- The committed `html-artifacts.skill` zip. It is now a release asset built by CI, so it cannot drift from `skills/`.
- Leftover copy from the source article ("Greg or anyone else may open it on a phone") and a hardcoded path to a `frontend-design` skill.

## [0.1.0] - 2026-05-08

Initial release: `SKILL.md` with the recognition heuristic and universal rules, eight per-category references, six examples, and the GitHub Pages site.

[1.0.1]: https://github.com/WilliWilliam/explain-in-html/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/WilliWilliam/explain-in-html/releases/tag/v1.0.0
[2.0.0]: https://github.com/dogum/html-artifacts/compare/v0.1.0...v2.0.0
[0.1.0]: https://github.com/dogum/html-artifacts/releases/tag/v0.1.0
