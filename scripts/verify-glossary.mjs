// Behavioural checks for the glossary popover + drawer and the wide-layout tiers.
// Usage: node scripts/verify-glossary.mjs file.html [more.html ...]
// Needs Playwright with Chromium. Exit 0 if every check passes; otherwise prints FAIL <file>
// and one "<check-name>: <detail>" line per failed check. Files with neither aside.glossary nor
// .full/.wide (and redirect stubs) print "skip <file>".
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';

const files = process.argv.slice(2);
if (!files.length) { console.error('usage: verify-glossary.mjs file.html ...'); process.exit(2); }

const browser = await chromium.launch();
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(fn, timeout = 1500) {
  const end = Date.now() + timeout;
  for (;;) {
    let v; try { v = await fn(); } catch { v = false; }
    if (v) return true;
    if (Date.now() > end) return false;
    await sleep(40);
  }
}

// Fresh context + page per call, so checks never share state. localStorage starts empty.
async function open(file, opts, fn) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  page.setDefaultTimeout(2000);
  try {
    await page.goto(pathToFileURL(file).href);
    if (opts.javaScriptEnabled !== false) {
      await page.evaluate(() => { try { localStorage.clear(); } catch {} });
      await page.reload();
    }
    await page.waitForTimeout(150);
    return await fn(page);
  } finally { await ctx.close(); }
}
const DESKTOP = { viewport: { width: 1280, height: 800 } };
const TOUCH = { viewport: { width: 400, height: 800 }, hasTouch: true, isMobile: true };

const vis = (page, sel) => page.locator(sel).first().isVisible();
const drawerOpen = page => page.evaluate(() => {
  const a = document.querySelector('aside.glossary');
  if (!a || !a.hasAttribute('data-open')) return false;
  const r = a.getBoundingClientRect(), s = getComputedStyle(a);
  return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
});
const setLevel = (page, n) => page.evaluate(n => document.getElementById('level-' + n).click(), n);
const firstTerm = page => page.locator('.term:visible').first();
const lastTerm = page => page.locator('.term:visible').last();
const popVisible = page => vis(page, '#term-pop');
const hash = page => page.evaluate(() => location.hash);
const norm = s => (s || '').replace(/\s+/g, ' ').trim();
async function openDrawer(page) {
  await page.locator('.glossary-toggle').click();
  if (!await until(() => drawerOpen(page))) throw new Error('drawer did not open');
}

const glossaryChecks = {
  async 'no-js'(file) {
    return open(file, { ...DESKTOP, javaScriptEnabled: false }, async page => {
      const r = await page.evaluate(() => {
        const a = document.querySelector('aside.glossary'), m = document.querySelector('main');
        const prev = a.previousElementSibling;
        return { last: m && m.lastElementChild === a, top: a.getBoundingClientRect().top,
          prevBottom: prev ? prev.getBoundingClientRect().bottom : null };
      });
      if (!await vis(page, 'aside.glossary')) return 'aside.glossary is not visible without JS';
      if (!r.last) return 'aside.glossary is not the last element child of main';
      if (r.prevBottom !== null && r.top < r.prevBottom - 1) return `aside top ${r.top} overlaps previous sibling bottom ${r.prevBottom}`;
      if (await vis(page, '.glossary-toggle')) return '.glossary-toggle is visible without JS';
      return null;
    });
  },
  async 'starts-closed'(file) {
    return open(file, DESKTOP, async page => {
      if (await page.locator('#level-10').count()) await setLevel(page, 10);
      await page.waitForTimeout(100);
      if (!await vis(page, '.glossary-toggle')) return '.glossary-toggle is not visible';
      const ex = await page.locator('.glossary-toggle').getAttribute('aria-expanded');
      if (ex !== 'false') return `aria-expanded is ${ex}, expected "false"`;
      if (await vis(page, 'aside.glossary')) return 'aside.glossary is visible on load';
      return null;
    });
  },
  async describedby(file) {
    return open(file, DESKTOP, async page => {
      const bad = await page.evaluate(() => [...document.querySelectorAll('.term')].flatMap(t => {
        const id = t.getAttribute('aria-describedby');
        if (!id) return [`${t.getAttribute('href')} has no aria-describedby`];
        const el = document.getElementById(id);
        if (!el) return [`${t.getAttribute('href')} -> #${id} does not exist`];
        return el.textContent.trim() ? [] : [`#${id} is empty`];
      }));
      if (!await page.locator('.term').count()) return 'no .term elements';
      return bad.length ? bad.slice(0, 3).join('; ') + (bad.length > 3 ? ` (+${bad.length - 3} more)` : '') : null;
    });
  },
  async 'hover-popover'(file) {
    return open(file, DESKTOP, async page => {
      const t = firstTerm(page);
      const want = norm(await page.evaluate(h => (document.getElementById(h.slice(1) + '-d') || {}).textContent, await t.getAttribute('href')));
      await t.hover();
      if (!await until(() => popVisible(page))) return '#term-pop not visible on hover';
      const got = norm(await page.locator('#term-pop').textContent());
      return want && got.includes(want) ? null : `popover text does not contain the dd text (${want.slice(0, 40)}...)`;
    });
  },
  async 'esc-closes-popover'(file) {
    return open(file, DESKTOP, async page => {
      await firstTerm(page).hover();
      if (!await until(() => popVisible(page))) return '#term-pop not visible on hover';
      await page.keyboard.press('Escape');
      return await until(async () => !await popVisible(page)) ? null : '#term-pop still visible after Escape';
    });
  },
  async 'focus-popover'(file) {
    return open(file, DESKTOP, async page => {
      const t = firstTerm(page);
      await t.focus();
      if (!await until(() => popVisible(page))) return '#term-pop not visible on focus';
      await t.blur();
      return await until(async () => !await popVisible(page)) ? null : '#term-pop still visible after blur';
    });
  },
  async 'touch-popover'(file) {
    return open(file, TOUCH, async page => {
      const before = await hash(page);
      await firstTerm(page).tap();
      if (!await until(() => popVisible(page))) return '#term-pop not visible after tap';
      const after = await hash(page);
      return after === before ? null : `location.hash changed from "${before}" to "${after}"`;
    });
  },
  async 'popover-in-viewport'(file) {
    const probe = page => page.evaluate(() => {
      const r = document.getElementById('term-pop').getBoundingClientRect();
      const w = innerWidth, h = innerHeight;
      const ok = r.left >= -0.5 && r.top >= -0.5 && r.right <= w + 0.5 && r.bottom <= h + 0.5;
      return ok ? null : `box ${[r.left, r.top, r.right, r.bottom].map(Math.round)} outside ${w}x${h}`;
    });
    for (const [label, ctxOpts, which] of [['1280', DESKTOP, firstTerm], ['1280', DESKTOP, lastTerm], ['400', TOUCH, firstTerm], ['400', TOUCH, lastTerm]]) {
      const bad = await open(file, ctxOpts, async page => {
        const t = which(page);
        if (ctxOpts.hasTouch) await t.tap(); else await t.hover();
        if (!await until(() => popVisible(page))) return '#term-pop not visible';
        await page.waitForTimeout(150);
        return probe(page);
      });
      if (bad) return `${label} ${which === firstTerm ? 'first' : 'last'} term: ${bad}`;
    }
    return null;
  },
  async 'drawer-toggle'(file) {
    return open(file, DESKTOP, async page => {
      // Content box and the first child's box: a drawer that pads, narrows or shifts the page must not slip through a max-width child.
      const width = () => page.evaluate(() => {
        const m = document.querySelector('main'), c = m.firstElementChild.getBoundingClientRect(), s = getComputedStyle(m);
        return [c.left, c.width, m.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)].map(Math.round).join('/');
      });
      const w0 = await width();
      await page.locator('.glossary-toggle').click();
      if (!await until(() => drawerOpen(page))) return 'aside not visible after clicking the toggle';
      await page.waitForTimeout(400);
      const ex = await page.locator('.glossary-toggle').getAttribute('aria-expanded');
      if (ex !== 'true') return `aria-expanded is ${ex} after open`;
      const w1 = await width();
      if (w1 !== w0) return `main's first child left/width/content-width changed ${w0} -> ${w1} (drawer pushes content)`;
      await page.evaluate(() => document.activeElement && document.activeElement.blur());
      await page.keyboard.press('Escape');
      if (!await until(async () => !await vis(page, 'aside.glossary'))) return 'aside still visible after Escape';
      const focused = await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('glossary-toggle'));
      return focused ? null : 'focus did not return to .glossary-toggle after Escape';
    });
  },
  async 'click-opens-drawer'(file) {
    const inside = page => page.evaluate(() => {
      const a = document.querySelector('aside.glossary');
      const dt = document.getElementById(location.hash.slice(1));
      if (!dt) return `no element for ${location.hash}`;
      const ar = a.getBoundingClientRect(), dr = dt.getBoundingClientRect();
      return dr.top >= ar.top - 1 && dr.bottom <= ar.bottom + 1 && ar.top < innerHeight && ar.bottom > 0 ? null
        : `entry ${Math.round(dr.top)}-${Math.round(dr.bottom)} outside drawer ${Math.round(ar.top)}-${Math.round(ar.bottom)}`;
    });
    for (const via of ['click', 'Enter']) {
      const bad = await open(file, DESKTOP, async page => {
        const t = firstTerm(page);
        const href = await t.getAttribute('href');
        if (via === 'click') await t.click(); else { await t.focus(); await page.keyboard.press('Enter'); }
        if (!await until(() => drawerOpen(page))) return 'drawer not open';
        const h = await hash(page);
        if (h !== href) return `location.hash "${h}" != href "${href}"`;
        let r; await until(async () => !(r = await inside(page)));
        return r;
      });
      if (bad) return `via ${via}: ${bad}`;
    }
    return null;
  },
  async 'see-in-glossary'(file) {
    return open(file, DESKTOP, async page => {
      const t = firstTerm(page);
      const href = await t.getAttribute('href');
      await t.hover();
      if (!await until(() => popVisible(page))) return '#term-pop not visible on hover';
      await page.locator('.term-pop-more').click();
      if (!await until(() => drawerOpen(page))) return 'drawer not open after .term-pop-more';
      const h = await hash(page);
      return h === href ? null : `location.hash "${h}" != "${href}"`;
    });
  },
  async 'remembers-open'(file) {
    return open(file, DESKTOP, async page => {
      await openDrawer(page);
      await page.reload();
      return await until(() => drawerOpen(page)) ? null : 'drawer closed after reload';
    });
  },
  async 'drawer-scrolls'(file) {
    return open(file, { viewport: { width: 1280, height: 500 } }, async page => {
      // Scroll the window first so a page jump behind the drawer is observable.
      await page.evaluate(() => scrollTo(0, 50));
      const y0 = await page.evaluate(() => scrollY);
      if (y0 !== 50) return `page cannot scroll to 50px at 1280x500 (scrollY is ${y0}), so a page jump would be invisible`;
      // Open via an in-page click: Playwright's own click would scroll the toggle into view and mask a jump.
      await page.evaluate(() => document.querySelector('.glossary-toggle').click());
      if (!await until(() => drawerOpen(page))) return 'drawer did not open';
      await page.waitForTimeout(300);
      const afterOpen = await page.evaluate(() => scrollY);
      if (afterOpen !== y0) return `window.scrollY changed ${y0} -> ${afterOpen} when the drawer opened`;
      const oy = await page.evaluate(() => getComputedStyle(document.querySelector('aside.glossary')).overflowY);
      if (oy !== 'auto' && oy !== 'scroll') return `aside overflow-y is ${oy}`;
      const overflows = () => page.evaluate(() => { const a = document.querySelector('aside.glossary'); return a.scrollHeight > a.clientHeight + 1; });
      if (!await overflows()) { await page.setViewportSize({ width: 1280, height: 300 }); await page.waitForTimeout(150); }
      if (!await overflows()) return null; // glossary fits even in 300px: only the overflow-y assertion applies
      const y1 = await page.evaluate(() => scrollY);
      const box = await page.locator('aside.glossary').boundingBox();
      if (!box) return 'aside.glossary has no bounding box while open';
      await page.mouse.move(box.x + box.width / 2, box.y + Math.min(box.height, 300) / 2);
      // Keep wheeling past the end of the aside so any scroll chaining to the page shows up.
      for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 1000); await page.waitForTimeout(120); }
      await page.waitForTimeout(400);
      const { top, y2 } = await page.evaluate(() => ({ top: document.querySelector('aside.glossary').scrollTop, y2: scrollY }));
      if (top <= 0) return 'wheel over the aside did not scroll it (aside.scrollTop is 0)';
      return y2 === y1 ? null : `window.scrollY changed ${y1} -> ${y2} while scrolling the aside`;
    });
  },
  async 'level-1-hides-open-drawer'(file) {
    return open(file, DESKTOP, async page => {
      if (!await page.locator('#level-1').count()) return null;
      await openDrawer(page);
      await setLevel(page, 1);
      if (!await until(async () => !await vis(page, 'aside.glossary'))) return 'aside still visible at level 1';
      return await until(async () => !await vis(page, '.glossary-toggle')) ? null : '.glossary-toggle still visible at level 1';
    });
  },
  async print(file) {
    return open(file, DESKTOP, async page => {
      await page.emulateMedia({ media: 'print' });
      await page.waitForTimeout(100);
      if (!await vis(page, 'aside.glossary')) return 'aside.glossary not visible in print';
      return await vis(page, '.glossary-toggle') ? '.glossary-toggle visible in print' : null;
    });
  },
};

const widthChecks = {
  async 'full-width'(file) {
    return open(file, { viewport: { width: 1920, height: 1000 } }, page => page.evaluate(() => {
      const cw = document.documentElement.clientWidth;
      const bad = [...document.querySelectorAll('.full')].map(e => e.getBoundingClientRect().width)
        .filter(w => w > 0).filter(w => w < cw - 49 - 0.5 || w > cw - 32 + 0.5);
      return bad.length ? `.full widths ${bad.map(Math.round)} outside [${cw - 49}, ${cw - 32}]` : null;
    }));
  },
  async 'wide-width'(file) {
    return open(file, { viewport: { width: 1920, height: 1000 } }, page => page.evaluate(() => {
      const bad = [...document.querySelectorAll('.wide')].map(e => e.getBoundingClientRect().width)
        .filter(w => w > 0).filter(w => w > 1600.5 || w <= 1100);
      return bad.length ? `.wide widths ${bad.map(Math.round)} outside (1100, 1600]` : null;
    }));
  },
  async 'text-measure'(file) {
    return open(file, { viewport: { width: 1920, height: 1000 } }, page => page.evaluate(() => {
      // Rendered paragraphs only (display:none has no client rects). Too narrow catches a child that fell into a gutter track.
      const ws = [...document.querySelectorAll('main p')].filter(p => !p.closest('.wide, .full') && p.getClientRects().length)
        .map(p => p.getBoundingClientRect().width);
      const wide = ws.filter(w => w > 780.5), narrow = ws.filter(w => w < 300);
      if (wide.length) return `${wide.length} paragraph(s) wider than 780px (max ${Math.round(Math.max(...wide))})`;
      if (narrow.length) return `${narrow.length} paragraph(s) narrower than 300px (min ${Math.round(Math.min(...narrow))})`;
      // Paragraphs of main and of its plain sections all sit in the content track: same left edge and width.
      const col = [...document.querySelectorAll('main > p, main > section:not(.wide, .full) > p')].filter(p => p.getClientRects().length)
        .map(p => { const r = p.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.width)].join('/'); });
      const cols = [...new Set(col)];
      return cols.length > 1 ? `paragraphs of main and its sections sit in ${cols.length} columns (left/width ${cols.join(', ')})` : null;
    }));
  },
};

let failed = 0;
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  if (src.includes('http-equiv="refresh"')) { console.log(`skip ${file}`); continue; }
  const hasGlossary = /<aside[^>]*class="[^"]*\bglossary\b/.test(src);
  const hasWide = /class="[^"]*\b(full|wide)\b/.test(src);
  if (!hasGlossary && !hasWide) { console.log(`skip ${file}`); continue; }
  const checks = { ...(hasGlossary ? glossaryChecks : {}), ...(hasWide ? widthChecks : {}) };
  const problems = [];
  for (const [name, fn] of Object.entries(checks)) {
    let res;
    try { res = await fn(file); } catch (e) { res = `error: ${String(e.message).split('\n')[0]} (element missing or not actionable?)`; }
    if (res) problems.push(`${name}: ${res}`);
  }
  if (problems.length) { failed++; console.log(`FAIL ${file}\n  ` + problems.join('\n  ')); }
  else console.log(`ok   ${file}`);
}
await browser.close();
process.exit(failed ? 1 : 0);
