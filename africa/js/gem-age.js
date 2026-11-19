/*
 * Gem age slider: the same Gem, told for different ages. The younger the reader, the simpler, shorter
 * and bigger the text; the older, the more detail, debate and depth.
 *
 * Load it in the <head>, before the styles, so the page never shows the wrong age:
 *   <script src="js/gem-age.js" data-bands="🎒 6–9|📘 10–12|🎓 13–18" data-default="2" data-key="my-gem-age"
 *           data-after=".topbar" data-big="1"></script>
 *   data-bands    the age bands, separated by |, each "icon label". Two to four bands.
 *   data-default  the band shown the first time (1 = the first band). Usually the band the Gem was written for.
 *   data-key      where the choice is remembered in the browser (localStorage).
 *   data-after    where the slider strip goes when the page has no <div class="age-switch"> of its own
 *                 (the strip is placed right after this element, usually the top bar).
 *   data-big      bands that get bigger letters (e.g. "1").
 * Marking the page:
 *   <p data-ages="1 2">…</p>   shown only to bands 1 and 2. Anything without data-ages is shown to every age.
 *   or, without touching the HTML, a page script sets window.GEM_AGES before the page finishes loading:
 *     show: { "css selector": "2 3" }            existing elements shown only to those bands
 *     add:  [["css selector", "after|before|start|end", "1", "<p>…</p>"], …]   new content for some bands
 *     open: { "3": "details.deeper" }            <details> opened for that band (closed again when leaving it)
 *     simplify: "1"                              the band(s) whose chapters get the short text instead of the long one
 *     chapters: { "#cap1": { "1": "short text", "3": "more for the oldest", pic: "🦁🪨", hide: "> p, > ul" } }
 *                 the short text goes after the chapter's <h2> and the long paragraphs (direct <p>, <ul>, <h3>,
 *                 except labels and elements with an id) are hidden for the simplify bands; any other band gets
 *                 its text in a "Going further" box at the end of the chapter.
 * ?age=2 in the address opens the page at that band (handy for a teacher's link).
 * A small copy floats at the bottom right while reading; on phones it is one button that opens the others.
 * On every change the reader stays on the same chapter, and the window events "agechange"
 * (detail: { age, band }) and "gem-menu:refresh" are fired (the ☰ menu lists only what is shown).
 * It also picks the light or dark Liminal Ed logo (.gem-brand) for the colour of the bar it sits in.
 * Texts in Catalan, English, Hindi and Punjabi, chosen from <html lang>.
 * Licence: CC BY-NC-SA 4.0, as the Gems. Original idea by Jaume Nu a l'art, made with the help of an AI agent.
 */
(() => {
  const me = document.currentScript, cfg = (me && me.dataset) || {}, root = document.documentElement;
  const T = {
    ca: { title: "Per a quina edat?", unit: "anys", say: "Ara el text és per a {b}.", more: "Per anar més enllà" },
    en: { title: "For what age?", unit: "years old", say: "The text is now for {b}.", more: "Going further" },
    hi: { title: "किस उम्र के लिए?", unit: "साल", say: "अब पाठ {b} के लिए है।", more: "और गहराई में" },
    pa: { title: "ਕਿਸ ਉਮਰ ਲਈ?", unit: "ਸਾਲ", say: "ਹੁਣ ਪਾਠ {b} ਲਈ ਹੈ।", more: "ਹੋਰ ਡੂੰਘਾਈ ਵਿੱਚ" }
  };
  const L = T[(root.lang || "en").slice(0, 2)] || T.en;
  const bands = (cfg.bands || "").split("|").map((b, i) => {
    const [ico, ...rest] = b.trim().split(" ");
    return { n: i + 1, ico, label: rest.join(" ") };
  });
  const N = bands.length, KEY = cfg.key || "gem-age";
  const BIG = (cfg.big || "").split(/\s+/).filter(Boolean).map(Number);
  const clamp = a => Math.min(N, Math.max(1, Math.round(+a) || 1));
  const named = b => `${b.label} ${L.unit}`;

  const OFF = !cfg.bands; // no bands: only the logo colour (pages without the slider)
  let age = +new URLSearchParams(location.search).get("age") || 0;
  if (!age) try { age = +localStorage.getItem(KEY) || 0; } catch (e) { /* private window */ }
  age = clamp(age || cfg.default || 1);
  function mark(a) {
    root.dataset.age = a;
    if (BIG.includes(a)) root.setAttribute("data-age-big", ""); else root.removeAttribute("data-age-big");
  }
  if (!OFF) mark(age);

  // hide what is not for this age, for any number of bands
  let css = "";
  for (let i = 1; i <= N; i++) css += `html[data-age="${i}"] [data-ages]:not([data-ages~="${i}"]){display:none!important}\n`;
  const st = document.createElement("style");
  st.id = "gemAgeStyle";
  st.textContent = css;
  if (!OFF) document.head.append(st);

  const h = (tag, attrs = {}, text) => {
    const n = document.createElement(tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  };
  const shown = el => el.getClientRects().length > 0;

  // ---------------------------------------------------------------- content for each age, from window.GEM_AGES
  const opened = new Set();
  function applyContent() {
    const G = window.GEM_AGES || {};
    for (const sel in G.show || {}) document.querySelectorAll(sel).forEach(el => el.setAttribute("data-ages", G.show[sel]));
    // chapters: a short text for the youngest, a "going further" box for the others
    const simple = String(G.simplify || "").split(/\s+/).filter(Boolean);
    const rest = bands.map(b => String(b.n)).filter(b => !simple.includes(b)).join(" ");
    const HIDE = G.hide || "> p:not(.chap-n):not(.try):not([id]):not(.bubble), > ul, > h3";
    const para = t => (/^\s*</.test(t) ? t : `<p>${t}</p>`);
    for (const sel in G.chapters || {}) {
      const box = document.querySelector(sel), c = G.chapters[sel];
      if (!box) { console.warn("gem-age: no chapter", sel); continue; }
      const keys = Object.keys(c).filter(k => /^[\d ]+$/.test(k));
      // every key made only of simplify bands is a short text (e.g. "1" for 3–5 and "2" for 6–9)
      const shorts = keys.filter(k => k.split(" ").every(b => simple.includes(b)));
      if (shorts.length) {
        const sc = (c.hide || HIDE).split(",").map(x => `:scope ${x.trim()}`).join(", ");
        box.querySelectorAll(sc).forEach(el => { if (!el.hasAttribute("data-ages")) el.setAttribute("data-ages", rest); });
        const h2 = box.querySelector(":scope > h2, :scope > h1") || box.querySelector("h2");
        let prev = h2 ? (h2.parentElement === box ? h2 : h2.parentElement) : null;
        shorts.forEach(k => {
          const div = h("div", { class: "kid", "data-ages": k });
          const pic = typeof c.pic === "object" ? c.pic[k] : c.pic;
          div.innerHTML = (pic ? `<p class="kid-pic" aria-hidden="true">${pic}</p>` : "") + para(c[k]);
          if (prev) prev.after(div); else box.prepend(div);
          prev = div;
        });
      }
      keys.filter(k => !shorts.includes(k)).forEach(k => {
        const div = h("div", { class: "ga-more", "data-ages": k });
        div.innerHTML = `<span class="ga-more-t">${G.moreTitle || L.more}</span>${para(c[k])}`;
        box.append(div);
      });
    }
    for (const [sel, pos, ages, html] of G.add || []) {
      const at = document.querySelector(sel);
      if (!at) { console.warn("gem-age: nothing matches", sel); continue; }
      const tpl = document.createElement("template");
      tpl.innerHTML = html.trim();
      [...tpl.content.children].forEach(n => n.setAttribute("data-ages", ages));
      const nodes = [...tpl.content.children];
      if (pos === "after") { let prev = at; nodes.forEach(n => { prev.after(n); prev = n; }); }
      else if (pos === "before") nodes.forEach(n => at.before(n));
      else if (pos === "start") nodes.reverse().forEach(n => at.prepend(n));
      else nodes.forEach(n => at.append(n));
    }
    applyOpen();
  }
  function applyOpen() {
    const G = window.GEM_AGES || {};
    opened.forEach(d => { d.open = false; });
    opened.clear();
    const sel = (G.open || {})[age];
    if (sel) document.querySelectorAll(sel).forEach(d => { if (!d.open) { d.open = true; opened.add(d); } });
  }

  // ---------------------------------------------------------------- changing age without losing your place
  const BLOCKS = ".hero, .chap, .step, .wide";
  function anchor() {
    let best = null;
    for (const el of document.querySelectorAll(BLOCKS)) if (shown(el) && el.getBoundingClientRect().top < innerHeight * 0.45) best = el;
    return best;
  }
  const controls = [];
  let say = null;
  function set(a) {
    a = clamp(a);
    if (a === age) { sync(); return; }
    const all = [...document.querySelectorAll(BLOCKS)];
    const an = anchor(), before = an ? an.getBoundingClientRect().top : 0;
    age = a;
    mark(a);
    applyOpen();
    try { localStorage.setItem(KEY, a); } catch (e) { /* private window */ }
    // the same block stays at the same height on the screen (or the next one, if this age does not have it)
    const target = an && (shown(an) ? an : all.slice(all.indexOf(an)).find(shown));
    if (target && scrollY > 0) {
      const sb = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      scrollBy(0, target.getBoundingClientRect().top - before);
      root.style.scrollBehavior = sb;
    }
    sync();
    document.body.classList.remove("age-swap");
    void document.body.offsetWidth; // restart the animation
    document.body.classList.add("age-swap");
    if (say) say.textContent = L.say.replace("{b}", named(bands[a - 1]));
    dispatchEvent(new CustomEvent("agechange", { detail: { age: a, band: bands[a - 1] } }));
    dispatchEvent(new Event("gem-menu:refresh"));
    dispatchEvent(new Event("scroll"));
    dispatchEvent(new Event("resize"));
  }
  function sync() { controls.forEach(c => c(age)); }

  // ---------------------------------------------------------------- the controls
  function slider(box) {
    const id = `gas${controls.length}`;
    const wrap = h("div", { class: "as", role: "group", "aria-labelledby": `${id}t` });
    wrap.style.setProperty("--n", N);
    wrap.append(h("span", { class: "as-title", id: `${id}t` }, L.title));
    const track = h("div", { class: "as-track" });
    const input = h("input", { type: "range", min: 1, max: N, step: 1, "aria-labelledby": `${id}t` });
    track.append(input);
    const stops = bands.map(b => {
      // the stops are big tap targets; the range input is what keyboards and screen readers use
      const s = h("button", { type: "button", class: "as-stop", tabindex: "-1", "aria-hidden": "true" });
      s.innerHTML = `<span class="as-ico">${b.ico}</span><span class="as-lbl">${b.label}</span>`;
      s.onclick = () => set(b.n);
      track.append(s);
      return s;
    });
    wrap.append(track);
    box.replaceChildren(wrap);
    input.addEventListener("input", () => set(+input.value));
    controls.push(a => {
      input.value = a;
      input.setAttribute("aria-valuetext", named(bands[a - 1]));
      input.style.setProperty("--p", N > 1 ? (a - 1) / (N - 1) : 0);
      stops.forEach((s, i) => s.classList.toggle("on", i + 1 === a));
    });
  }
  function floating(watch) {
    const f = h("div", { class: "as-float", role: "group", "aria-label": L.title, hidden: "" });
    const btns = bands.map(b => {
      const x = h("button", { type: "button", "aria-pressed": "false", "aria-label": named(b), title: named(b) }, b.ico);
      x.onclick = () => {
        // on phones it is one small button with the current age; a tap opens the others
        if (!f.classList.contains("open") && matchMedia("(max-width: 899px)").matches) { f.classList.add("open"); return; }
        f.classList.remove("open");
        set(b.n);
      };
      f.append(x);
      return x;
    });
    document.body.append(f);
    controls.push(a => btns.forEach((x, i) => x.setAttribute("aria-pressed", String(i + 1 === a))));
    if (watch && "IntersectionObserver" in window) new IntersectionObserver(([e]) => { f.hidden = e.isIntersecting; }).observe(watch);
    else f.hidden = false;
    addEventListener("keydown", e => { if (e.key === "Escape") f.classList.remove("open"); });
  }

  // ---------------------------------------------------------------- colours: the page's own, so it fits every Gem
  const bgOf = el => { const c = getComputedStyle(el).backgroundColor; return c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c) ? c : null; };
  const lum = c => { const m = (c || "").match(/[\d.]+/g); if (!m) return 1; const [r, g, b] = m.map(Number); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
  function colours() {
    const bg = bgOf(document.body) || bgOf(root) || "#ffffff", ink = getComputedStyle(document.body).color || "#222222";
    root.style.setProperty("--ga-bg", bg);
    root.style.setProperty("--ga-ink", ink);
    // the slider strip takes the colours of the top bar it sits under (or the page's, inverted)
    const bar = cfg.after && document.querySelector(cfg.after);
    const barBg = bar && bgOf(bar);
    root.style.setProperty("--as-bg", barBg || ink);
    root.style.setProperty("--as-fg", barBg ? getComputedStyle(bar).color : bg);
    // the logo: light on dark bars, dark on light ones
    document.querySelectorAll(".gem-brand").forEach(b => {
      let p = b.parentElement, c = null;
      while (p && !(c = bgOf(p))) p = p.parentElement;
      b.classList.toggle("on-dark", lum(c || bg) < 0.5);
    });
  }

  function mount() {
    applyContent();
    let boxes = [...document.querySelectorAll(".age-switch")];
    if (!boxes.length) {
      const strip = h("div", { class: "age-strip" }), box = h("div", { class: "age-switch" });
      strip.append(box);
      const after = cfg.after && document.querySelector(cfg.after);
      if (after) after.after(strip); else document.body.prepend(strip);
      boxes = [box];
    }
    boxes.forEach(slider);
    floating(boxes[0]);
    say = h("p", { class: "as-say", "aria-live": "polite" });
    document.body.append(say);
    colours();
    new MutationObserver(colours).observe(root, { attributes: true, attributeFilter: ["data-theme", "class"] });
    new MutationObserver(colours).observe(document.body, { attributes: true, attributeFilter: ["data-theme", "class"] });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", colours);
    sync();
  }
  const start = OFF ? colours : mount;
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", start); else start();
})();
