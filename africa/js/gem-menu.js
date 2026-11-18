/*
 * Gem menu (☰): a button fixed at the top left that opens a side panel with every chapter (and each of its steps)
 * and every other section of the page, so readers can jump straight to any point. Same menu as in «Xarxes amb cap».
 * Self-contained: it builds the list from the page and brings its own styles. Settings on the <script> tag:
 *   data-items   chapters and steps, in order (default ".chap, .step"). An item with a .chap-n label starts a chapter;
 *                an item with an <h2> is a step you can jump to.
 *   data-more    the other sections (default ".wide"), each with an <h2>.
 *   data-sticky  the sticky map or drawing that covers the top of the screen on phones (default ".map-col, .viz-col, .stage-col").
 *   data-bar     the top bar, which gets room on the left for the button (optional).
 * Texts in Catalan, English, Hindi and Punjabi, chosen from <html lang>.
 * Licence: CC BY-NC-SA 4.0, as the Gems. Original idea by Jaume Nu a l'art, made with the help of an AI agent.
 */
(() => {
  const me = document.currentScript, cfg = (me && me.dataset) || {};
  const T = {
    ca: { title: "Índex", open: "Obre l'índex de capítols i seccions", close: "Tanca l'índex", start: "🏠 Inici", story: "La història", more: "I a més" },
    en: { title: "Contents", open: "Open the list of chapters and sections", close: "Close the contents", start: "🏠 Start", story: "The story", more: "And also" },
    hi: { title: "विषय-सूची", open: "अध्यायों और भागों की सूची खोलें", close: "विषय-सूची बंद करें", start: "🏠 शुरुआत", story: "कहानी", more: "और भी" },
    pa: { title: "ਤਤਕਰਾ", open: "ਅਧਿਆਵਾਂ ਅਤੇ ਹਿੱਸਿਆਂ ਦੀ ਸੂਚੀ ਖੋਲ੍ਹੋ", close: "ਤਤਕਰਾ ਬੰਦ ਕਰੋ", start: "🏠 ਸ਼ੁਰੂ", story: "ਕਹਾਣੀ", more: "ਹੋਰ ਵੀ" }
  };
  const L = T[(document.documentElement.lang || "en").slice(0, 2)] || T.en;
  const ITEMS = cfg.items || ".chap, .step", MORE = cfg.more || ".wide", STICKY = cfg.sticky || ".map-col, .viz-col, .stage-col";
  const h = (tag, attrs = {}, text) => {
    const n = document.createElement(tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  };
  const clean = el => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");

  function build() {
    if (document.getElementById("gmBtn")) return;
    // ---------------------------------------------------------------- styles
    const css = `
.gm-btn,.gm-menu{--gm-soft:color-mix(in srgb,var(--gm-ink) 10%,var(--gm-bg));--gm-line:color-mix(in srgb,var(--gm-ink) 22%,var(--gm-bg))}
.gm-btn{position:fixed;top:8px;left:8px;z-index:2147483000;width:44px;height:44px;border-radius:12px;border:3px solid var(--gm-ink);
  background:var(--gm-bg);box-shadow:3px 3px 0 var(--gm-ink);display:grid;place-items:center;cursor:pointer;padding:0}
.gm-btn:hover{background:var(--gm-soft)}
.gm-btn:focus-visible,.gm-menu a:focus-visible,.gm-close:focus-visible{outline:3px solid #2f7fb5;outline-offset:2px}
.gm-burger{display:grid;gap:5px}.gm-burger i{display:block;width:20px;height:3px;border-radius:2px;background:var(--gm-ink)}
.gm-back{position:fixed;inset:0;z-index:2147483001;background:#0007}
.gm-menu{position:fixed;top:0;left:0;bottom:0;width:min(380px,90vw);z-index:2147483002;background:var(--gm-bg);color:var(--gm-ink);
  border-right:3px solid var(--gm-ink);box-shadow:6px 0 0 var(--gm-ink);overflow-y:auto;overscroll-behavior:contain;
  padding:12px 14px 40px;box-sizing:border-box;animation:gm-in .25s ease-out;font:16px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;text-align:left}
.gm-menu[hidden],.gm-back[hidden]{display:none}
@keyframes gm-in{from{transform:translateX(-100%)}}
body.gm-open{overflow:hidden}
.gm-head{display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:1.2rem;position:sticky;top:-12px;
  background:var(--gm-bg);padding:6px 0 8px;margin-top:-6px}
.gm-close{font:800 1.1rem system-ui,sans-serif;width:40px;height:40px;border-radius:10px;border:2px solid var(--gm-ink);
  background:var(--gm-bg);color:var(--gm-ink);cursor:pointer}
.gm-menu h3{opacity:.75;font-size:.78rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--gm-ink);margin:1.1em 0 .3em}
.gm-menu ol{list-style:none;padding:0;margin:0;display:grid;gap:2px}
.gm-menu ol ol{padding-left:14px;margin:2px 0 4px 12px;border-left:3px solid var(--gm-line)}
.gm-menu a{display:block;padding:6px 10px;border-radius:10px;color:var(--gm-ink);text-decoration:none;font-weight:700;font-size:.95rem}
.gm-menu ol ol a{font-weight:600;font-size:.9rem}
.gm-menu a:hover{background:var(--gm-soft)}
.gm-menu a[aria-current]{background:var(--gm-ink);color:var(--gm-bg)}
.gm-group{display:block;padding:6px 10px 2px;font-weight:800;font-size:.95rem;opacity:.8;color:var(--gm-ink)}
.gm-bar{padding-left:64px!important;min-height:52px;box-sizing:border-box}
@media print{.gm-btn,.gm-menu,.gm-back{display:none!important}}
@media (prefers-reduced-motion:reduce){.gm-menu{animation:none}}`;
    document.head.append(h("style", { id: "gmStyle" }, css));
    if (cfg.bar) document.querySelectorAll(cfg.bar).forEach(b => b.classList.add("gm-bar"));

    // ---------------------------------------------------------------- the list, from the page
    const groups = [];
    let n = 0;
    document.querySelectorAll(ITEMS).forEach(it => {
      const label = it.querySelector(".chap-n"), h2 = it.querySelector("h2");
      // a new chapter starts when the label changes (steps of one chapter repeat the same label)
      if ((label && clean(label) !== groups[groups.length - 1]?.n) || !groups.length) groups.push({ n: clean(label) || clean(h2), steps: [] });
      if (h2) {
        if (!it.id) it.id = `gm-${++n}`;
        groups[groups.length - 1].steps.push({ id: it.id, t: clean(h2), el: it });
      }
    });
    const items = [...document.querySelectorAll(ITEMS)];
    const linkOf = {}; // item id -> menu link id, for marking the chapter being read
    const a = (id, text) => h("a", { href: `#${id}`, "data-for": id }, text);
    const story = h("ol");
    groups.filter(g => g.steps.length).forEach(g => {
      const li = h("li");
      if (g.steps.length === 1) li.append(a(g.steps[0].id, g.n || g.steps[0].t));
      else {
        li.append(h("span", { class: "gm-group" }, g.n));
        const ol = h("ol");
        g.steps.forEach(s => { const sl = h("li"); sl.append(a(s.id, s.t)); ol.append(sl); });
        li.append(ol);
      }
      story.append(li);
    });
    let last = null;
    items.forEach(it => {
      if (!it.id) it.id = `gm-${++n}`;
      if (story.querySelector(`a[data-for="${CSS.escape(it.id)}"]`)) last = it.id;
      if (last) linkOf[it.id] = last;
    });
    const more = h("ol");
    document.querySelectorAll(MORE).forEach(w => {
      const t = w.querySelector("h2");
      if (!t || w.closest(ITEMS)) return;
      if (!w.id) w.id = `gm-${++n}`;
      const ico = w.querySelector(".chap-n [aria-hidden]"), li = h("li");
      li.append(a(w.id, `${ico ? clean(ico) + " " : ""}${clean(t)}`));
      more.append(li);
      linkOf[w.id] = w.id;
    });

    // ---------------------------------------------------------------- button and panel
    const btn = h("button", { type: "button", class: "gm-btn", id: "gmBtn", "aria-expanded": "false", "aria-controls": "gmMenu", "aria-label": L.open });
    btn.innerHTML = '<span class="gm-burger" aria-hidden="true"><i></i><i></i><i></i></span>';
    const back = h("div", { class: "gm-back", id: "gmBack", hidden: "" });
    const menu = h("nav", { class: "gm-menu", id: "gmMenu", "aria-label": L.title, hidden: "" });
    const head = h("div", { class: "gm-head" });
    const close = h("button", { type: "button", class: "gm-close", id: "gmClose", "aria-label": L.close }, "✕");
    head.append(h("b", {}, `☰ ${L.title}`), close);
    const top = h("ol"), tl = h("li");
    tl.append(a("gm-top", L.start)); top.append(tl);
    menu.append(head, top);
    if (story.children.length) menu.append(h("h3", {}, L.story), story);
    if (more.children.length) menu.append(h("h3", {}, L.more), more);
    document.body.prepend(btn, back, menu);

    // colours: the page's own background and text, so the menu fits every Gem and its light or dark version
    function colours() {
      const bgOf = el => { const c = getComputedStyle(el).backgroundColor; return c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c) ? c : null; };
      const bg = bgOf(document.body) || bgOf(document.documentElement) || "#ffffff", ink = getComputedStyle(document.body).color || "#2b2118";
      [btn, menu].forEach(x => { x.style.setProperty("--gm-bg", bg); x.style.setProperty("--gm-ink", ink); });
    }
    colours();
    new MutationObserver(colours).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
    new MutationObserver(colours).observe(document.body, { attributes: true, attributeFilter: ["data-theme", "class"] });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", colours);
    function open(o) {
      colours();
      menu.hidden = !o; back.hidden = !o;
      btn.setAttribute("aria-expanded", String(o));
      document.body.classList.toggle("gm-open", o);
      if (o) (menu.querySelector("a[aria-current]") || close).focus(); else btn.focus();
    }
    // where a target should land: below the sticky map or drawing on phones, a bit down from the top otherwise
    // on phones the map or drawing sticks to the top across the whole width: how much of the screen it covers
    function covered() {
      const s = [...document.querySelectorAll(STICKY)].find(x => getComputedStyle(x).position === "sticky");
      return s && s.offsetWidth > innerWidth * 0.8 && s.offsetHeight < innerHeight * 0.75 ? (parseFloat(getComputedStyle(s).top) || 0) + s.offsetHeight : 0;
    }
    function offset(el) {
      if (!items.includes(el)) return 60;
      const c = covered();
      return c ? c + 14 : Math.round(innerHeight * 0.18);
    }
    function go(id) {
      const html = document.documentElement, sb = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      if (id === "gm-top") scrollTo(0, 0);
      else { const el = document.getElementById(id); scrollTo(0, el.getBoundingClientRect().top + scrollY - offset(el)); }
      html.style.scrollBehavior = sb;
      dispatchEvent(new Event("scroll"));
      try { history.replaceState(null, "", id === "gm-top" ? location.pathname + location.search : `#${id}`); } catch (e) { /* file:// in some browsers */ }
    }
    btn.addEventListener("click", () => open(menu.hidden));
    close.addEventListener("click", () => open(false));
    back.addEventListener("click", () => open(false));
    menu.addEventListener("click", e => {
      const l = e.target.closest("a");
      if (!l) return;
      e.preventDefault();
      open(false);
      go(l.dataset.for);
    });
    addEventListener("keydown", e => {
      if (menu.hidden) return;
      if (e.key === "Escape") open(false);
      if (e.key === "Tab") { // keep the keyboard inside the open menu
        const f = [...menu.querySelectorAll("a, button")], first = f[0], lastF = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastF.focus(); }
        else if (!e.shiftKey && document.activeElement === lastF) { e.preventDefault(); first.focus(); }
      }
    });

    // ---------------------------------------------------------------- mark what is being read
    const watched = [...items, ...[...document.querySelectorAll(MORE)].filter(w => linkOf[w.id])];
    let raf = 0;
    function mark() {
      raf = 0;
      const c = covered(), line = c ? c + (innerHeight - c) * 0.35 : innerHeight * 0.5;
      let cur = null;
      for (const el of watched) if (el.getBoundingClientRect().top < line) cur = el; // document order: last one above the line
      const id = cur ? linkOf[cur.id] : "gm-top";
      menu.querySelectorAll("a").forEach(l => (l.dataset.for === id ? l.setAttribute("aria-current", "true") : l.removeAttribute("aria-current")));
    }
    watched.sort((x, y) => (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(mark); }, { passive: true });
    addEventListener("resize", mark);
    mark();
  }
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", build); else build();
})();
