(() => {
  "use strict";

  const G = window.GEO;
  const H = window.HISTORY;
  const NS = "http://www.w3.org/2000/svg";
  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.append(e);
    return e;
  };
  const html = (tag, attrs = {}, text) => {
    const e = document.createElement(tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    return e;
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shortName = s => s.replace(/\s*\(.*?\)\s*/g, " ").trim();
  const P = H.POWERS;
  const countryName = a3 => H.COUNTRIES[a3]?.name || a3;
  const tx = window.tx, LANG = window.LANG;
  const fmtPct = n => `${Math.round(n)}%`;

  // ---------------------------------------------------------------- Notes
  const NOTE_IDS = Object.keys(H.NOTES);
  const noteNum = id => NOTE_IDS.indexOf(id) + 1;
  const uniq = ids => [...new Set((ids || []).filter(id => H.NOTES[id]))];
  const noteRefs = ids => uniq(ids).map(id => `<a class="nref" href="#nota-${noteNum(id)}">[${noteNum(id)}]</a>`).join("");
  const noteBlock = ids => {
    const list = uniq(ids);
    return list.length ? `<ol class="notes-inline">${list.map(id => `<li value="${noteNum(id)}">${H.NOTES[id]}</li>`).join("")}</ol>` : "";
  };
  const tipNotes = ids => {
    const list = uniq(ids);
    return list.length ? `<div class="tt-notes">${list.map(id => `<p><b>[${noteNum(id)}]</b> ${H.NOTES[id]}</p>`).join("")}</div>` : "";
  };

  // ================================================================ Escena SVG
  const svg = $("#map");
  const wrap = $("#mapWrap");
  const [, , VW, VH] = G.viewBox;
  svg.setAttribute("viewBox", G.viewBox.join(" "));
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const defs = el("defs", {}, svg);
  const hatch = el("pattern", { id: "hatch", width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(35)" }, defs);
  el("rect", { width: 6, height: 6, fill: "#4a3f33" }, hatch);
  el("line", { x1: 0, y1: 0, x2: 0, y2: 6, stroke: "#6b5b48", "stroke-width": 1.6 }, hatch);
  const clip = el("clipPath", { id: "swipeClip" }, defs);
  const clipRect = el("rect", { x: -5000, y: -5000, width: 5000, height: 20000 }, clip);

  el("rect", { class: "sea", x: -5000, y: -5000, width: 20000, height: 20000 }, svg);
  const stage = el("g", {}, svg);
  el("path", { class: "graticule", d: G.graticule }, stage);
  for (const k of ["equator", "cancer", "capricorn"]) el("path", { class: "gline", d: G.lines[k] }, stage);
  el("path", { class: "context", d: G.context }, stage);

  const snap = {
    y1880: el("g", { "data-snap": "y1880" }, stage),
    y1914: el("g", { "data-snap": "y1914" }, stage),
    peoples: el("g", { "data-snap": "peoples" }, stage),
    today: el("g", { "data-snap": "today" }, stage)
  };
  const gLangHex = el("g", {}, stage);
  const gLangPts = el("g", {}, stage);
  const gFuture = el("g", {}, stage);
  const gOverlay = el("g", {}, stage);
  const gOverlay1914 = el("g", {}, stage);
  const gHL = el("g", {}, stage);
  const gCities = el("g", {}, stage);

  // ---------------------------------------------------------------- Colors per veïnatge
  const EARTH = ["#a65a3f", "#c4884a", "#8b7d3a", "#b8733a", "#6e7f4a", "#94664f", "#a8854b", "#7d5c3e", "#b39060", "#8a4f3a"];
  const PALE = ["#e9dcc0", "#e3cfa6", "#efe4cf", "#dccaa2", "#e7d6b3", "#d9c49a"];
  function greedyColors(paths, palette) {
    const boxes = paths.map(p => p.getBBox());
    const near = (a, b) => a.x <= b.x + b.width + 2 && b.x <= a.x + a.width + 2 && a.y <= b.y + b.height + 2 && b.y <= a.y + a.height + 2;
    const order = boxes.map((b, i) => i).sort((i, j) => boxes[j].width * boxes[j].height - boxes[i].width * boxes[i].height);
    const out = [];
    for (const i of order) {
      const used = new Set();
      for (let j = 0; j < boxes.length; j++) if (out[j] !== undefined && near(boxes[i], boxes[j])) used.add(out[j]);
      let c = 0;
      while (used.has(c) && c < palette.length - 1) c++;
      out[i] = c;
    }
    return out.map(i => palette[i]);
  }

  // ---------------------------------------------------------------- Etiquetes
  const labels = [];
  function addLabel(parent, item, text, cls = "lbl") {
    const t = el("text", { class: cls, x: item.l[0], y: item.l[1] }, parent);
    const L = { el: t, a: item.a, x: item.l[0], y: item.l[1], text: "" };
    setLabelText(L, text);
    labels.push(L);
    return L;
  }
  function setLabelText(L, text) {
    if (L.text === text) return;
    L.text = text;
    L.el.replaceChildren();
    let lines = [text];
    if (text.length > 14 && text.includes(" ")) {
      const mid = text.length / 2;
      let best = -1;
      for (let i = 0; i < text.length; i++) if (text[i] === " " && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
      lines = [text.slice(0, best), text.slice(best + 1)];
    }
    L.lines = lines.length;
    L.len = Math.max(...lines.map(s => s.length));
    lines.forEach((s, i) => {
      const ts = el("tspan", { x: L.x, dy: i === 0 ? `${-(lines.length - 1) * 0.55}em` : "1.1em" }, L.el);
      ts.textContent = s;
    });
  }

  // ---------------------------------------------------------------- 1880
  el("path", { class: "land-hatch", d: G.land }, snap.y1880);
  const polityPaths = G.p1880.map((p, i) => el("path", { class: "polity", d: p.d, "data-k": "p1880", "data-i": i }, snap.y1880));
  const l1880 = el("g", {}, snap.y1880);
  const polityLabels = G.p1880.map(p => addLabel(l1880, p, shortName((H.P1880[p.n] || [p.n])[0]), "lbl serif"));
  {
    const colors = greedyColors(polityPaths, EARTH);
    G.p1880.forEach((p, i) => {
      const code = (H.P1880[p.n] || [null, "AF"])[1];
      polityPaths[i].setAttribute("fill", code === "AF" ? colors[i] : P[code].color);
    });
  }

  // ---------------------------------------------------------------- 1914
  const unitPaths = G.p1914.map((p, i) => {
    const code = (H.P1914[p.n] || [null, "AF"])[1];
    return el("path", { class: "u1914", d: p.d, fill: P[code].color, "data-fill": P[code].color, "data-k": "p1914", "data-i": i }, snap.y1914);
  });
  const l1914 = el("g", {}, snap.y1914);
  const unitLabels = G.p1914.map(p => addLabel(l1914, p, shortName((H.P1914[p.n] || [p.n])[0])));
  const restore1914 = () => G.p1914.forEach((p, i) => { unitPaths[i].setAttribute("fill", unitPaths[i].dataset.fill); setLabelText(unitLabels[i], shortName((H.P1914[p.n] || [p.n])[0])); });
  G.p1914.forEach((p, i) => {
    const o = el("path", { class: "overlay-border", d: p.d }, gOverlay1914);
    o.setAttribute("stroke-dasharray", "4 2");
  });

  // ---------------------------------------------------------------- Pobles
  const peoplePaths = G.peoples.map((p, i) => el("path", { class: "people", d: p.d, "data-k": "people", "data-i": i }, snap.peoples));
  const lPeoples = el("g", {}, snap.peoples);
  G.peoples.forEach(p => addLabel(lPeoples, p, p.n));
  const isPartitioned = (p, key = "s") => p[key].length > 1 && p[key][1][1] >= 10;
  function paintPeoples(key) {
    G.peoples.forEach((p, i) => {
      const n = p[key].filter(s => s[1] >= 10).length;
      let fill;
      if (isPartitioned(p, key)) fill = n >= 4 ? "#6e1a16" : n === 3 ? "#9e2a22" : "#c9452f";
      else fill = ["#5d5248", "#665a4e", "#574d44", "#6b6054"][i % 4];
      peoplePaths[i].setAttribute("fill", fill);
    });
  }

  // ---------------------------------------------------------------- Països actuals
  const A3 = Object.keys(G.countries);
  const countryPaths = {};
  const countryLabels = {};
  const lCountriesG = el("g", {}, snap.today);
  for (const a3 of A3) {
    const c = G.countries[a3];
    countryPaths[a3] = el("path", { class: "country", d: c.d, "data-k": "country", "data-a3": a3 }, snap.today);
    el("path", { class: "future-border", d: c.d, "data-a3": a3 }, gFuture);
    el("path", { class: "overlay-border", d: c.d }, gOverlay);
  }
  snap.today.append(lCountriesG);
  for (const a3 of A3) countryLabels[a3] = addLabel(lCountriesG, G.countries[a3], countryName(a3));
  const futurePaths = Object.fromEntries([...gFuture.children].map(p => [p.dataset.a3, p]));
  const todayColors = Object.fromEntries(greedyColors(A3.map(a => countryPaths[a]), PALE).map((c, i) => [A3[i], c]));
  const totalArea = A3.reduce((s, a) => s + G.countries[a].a, 0);
  // Petjada colonial del mapa de 1880 dins de cada país actual (per als anys "PRE")
  const footprint1880 = {};
  for (const p of G.p1880) {
    const code = (H.P1880[p.n] || [null, "AF"])[1];
    if (!H.COLONIAL.has(code)) continue;
    for (const [a3, pct] of p.today) footprint1880[a3] = (footprint1880[a3] || 0) + p.a * pct / 100;
  }
  for (const a3 in footprint1880) footprint1880[a3] = Math.min(footprint1880[a3], G.countries[a3]?.a || 0);

  // ---------------------------------------------------------------- Ciutats
  function project(lon, lat) {
    const R = 6371, { lon0, lat0, scale, ox, oy } = G.proj;
    const l = lon * Math.PI / 180, p = lat * Math.PI / 180, l0 = lon0 * Math.PI / 180, p0 = lat0 * Math.PI / 180;
    const k = Math.sqrt(2 / (1 + Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0)));
    return [R * k * Math.cos(p) * Math.sin(l - l0) * scale - ox, -R * k * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l - l0)) * scale - oy];
  }
  const cityEls = H.CITIES.map(c => {
    const [x, y] = project(c.lon, c.lat);
    const g = el("g", {}, gCities);
    const dot = el("circle", { class: "city-dot", cx: x, cy: y, r: 2.2 }, g);
    const t = el("text", { class: "city-lbl", x: x + 4, y: y + 1.2 }, g);
    return { c, g, dot, t, x, y };
  });

  const zoomHooks = [];

  // ================================================================ Vista (zoom i desplaçament)
  let view = { x: 0, y: 0, w: VW, h: VH };
  const applyView = () => {
    svg.setAttribute("viewBox", `${view.x} ${view.y} ${view.w} ${view.h}`);
    scheduleLabels();
    updateSwipe();
  };
  const ppu = () => {
    const r = svg.getBoundingClientRect();
    return Math.min(r.width / view.w, r.height / view.h) || 1;
  };
  function toSvg(clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }
  function zoomAt(factor, cx, cy) {
    const r = svg.getBoundingClientRect();
    const p = toSvg(cx ?? r.left + r.width / 2, cy ?? r.top + r.height / 2);
    const w = clamp(view.w / factor, VW / 14, VW * 1.2);
    const f = w / view.w;
    view = { x: p.x - (p.x - view.x) * f, y: p.y - (p.y - view.y) * f, w, h: view.h * f };
    applyView();
  }
  let anim = null;
  function flyTo(box, pad = 0.25) {
    const aspect = VW / VH;
    let w = box.width * (1 + pad * 2), h = box.height * (1 + pad * 2);
    if (w / h > aspect) h = w / aspect; else w = h * aspect;
    w = clamp(w, VW / 10, VW); h = w * VH / VW;
    const target = { x: box.x + box.width / 2 - w / 2, y: box.y + box.height / 2 - h / 2, w, h };
    const from = { ...view }, t0 = performance.now(), dur = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650;
    cancelAnimationFrame(anim);
    const step = t => {
      const k = dur ? clamp((t - t0) / dur, 0, 1) : 1, e = 1 - Math.pow(1 - k, 3);
      for (const key of ["x", "y", "w", "h"]) view[key] = from[key] + (target[key] - from[key]) * e;
      applyView();
      if (k < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }
  const resetView = () => flyTo({ x: 0, y: 0, width: VW, height: VH }, 0);
  function unionBox(els) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const e of els) { const b = e.getBBox(); x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); }
    return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
  }

  svg.addEventListener("wheel", e => { e.preventDefault(); zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY); }, { passive: false });
  $("#zoomIn").onclick = () => zoomAt(1.4);
  $("#zoomOut").onclick = () => zoomAt(1 / 1.4);
  $("#zoomReset").onclick = resetView;
  const pointers = new Map();
  let drag = null, pinch = null, moved = false;
  svg.addEventListener("pointerdown", e => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    svg.setPointerCapture(e.pointerId);
    moved = false;
    if (pointers.size === 1) drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), w: view.w };
      drag = null;
    }
  });
  svg.addEventListener("pointermove", e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt(view.w / (pinch.w * pinch.d / d), (a.x + b.x) / 2, (a.y + b.y) / 2);
      moved = true;
    } else if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) { moved = true; svg.classList.add("dragging"); hideTip(); }
      const k = ppu();
      view.x = drag.vx - dx / k; view.y = drag.vy - dy / k;
      applyView();
    }
  });
  const endPointer = e => { pointers.delete(e.pointerId); if (pointers.size < 2) pinch = null; if (!pointers.size) { drag = null; svg.classList.remove("dragging"); } };
  svg.addEventListener("pointerup", endPointer);
  svg.addEventListener("pointercancel", endPointer);
  svg.addEventListener("dblclick", e => zoomAt(1.8, e.clientX, e.clientY));
  // al mòbil el mapa s'enganxa just a sota de la barra de pestanyes
  const setTabsH = () => document.documentElement.style.setProperty("--tabs-h", `${$(".tabs").offsetHeight}px`);
  new ResizeObserver(() => { scheduleLabels(); updateSwipe(); setTabsH(); }).observe(wrap);

  // ---------------------------------------------------------------- Escalat d'etiquetes
  let labelsQueued = false;
  function scheduleLabels() {
    if (labelsQueued) return;
    labelsQueued = true;
    requestAnimationFrame(() => { labelsQueued = false; updateLabels(); });
  }
  function updateLabels() {
    const k = ppu();
    for (const L of labels) {
      if (L.forceHidden) { L.el.style.display = "none"; continue; }
      const s = Math.sqrt(L.a) * k;
      const px = clamp(s * 0.11, 9.5, L.big ? 18 : 15);
      const need = Math.max(28, L.len * px * 0.52);
      const show = L.force || s > need;
      L.el.style.display = show ? "" : "none";
      if (show) {
        L.el.setAttribute("font-size", (px / k).toFixed(2));
        L.el.setAttribute("stroke-width", (2.8 / k).toFixed(2));
      }
    }
    const cityPx = 11 / k;
    const showCityNames = VW / view.w >= 1.6;
    for (const c of cityEls) {
      c.t.style.display = showCityNames ? "" : "none";
      c.dot.setAttribute("r", (3 / k).toFixed(2));
      c.dot.setAttribute("stroke-width", (1 / k).toFixed(2));
      c.t.setAttribute("font-size", cityPx.toFixed(2));
      c.t.setAttribute("stroke-width", (2.6 / k).toFixed(2));
      c.t.setAttribute("x", c.x + 5 / k);
    }
    for (const p of svg.querySelectorAll(".overlay-border, .hl-border")) p.style.strokeWidth = `${(p.classList.contains("hl-border") ? 2.2 : 1.3) / k}px`;
    for (const p of gFuture.children) p.style.strokeWidth = `${1.2 / k}px`;
    for (const fn of zoomHooks) fn(k);
  }

  // Botó de llegenda (només es veu al mòbil, on la llegenda tapa massa mapa)
  const legendBtn = html("button", { type: "button", class: "legend-btn", "aria-expanded": "false" }, tx("Llegenda"));
  legendBtn.onclick = () => legendBtn.setAttribute("aria-expanded", wrap.classList.toggle("legend-open"));
  wrap.append(legendBtn);

  // ================================================================ Tooltip
  const tip = $("#tooltip");
  function showTip(e, content) {
    tip.innerHTML = content;
    tip.hidden = false;
    const r = wrap.getBoundingClientRect();
    let x = e.clientX - r.left + 14, y = e.clientY - r.top + 14;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    if (x + tw > r.width - 8) x = e.clientX - r.left - tw - 14;
    if (y + th > r.height - 8) y = e.clientY - r.top - th - 14;
    tip.style.left = `${Math.max(6, x)}px`;
    tip.style.top = `${Math.max(6, y)}px`;
  }
  const hideTip = () => { tip.hidden = true; };
  const swatch = code => `<span class="legend-swatch" style="background:${P[code].color || "transparent"}"></span>`;
  const todayList = arr => arr.filter(t => t[1] >= 6).slice(0, 5).map(([a3, pct]) => `${esc(countryName(a3))} ${Math.round(pct)}%`).join(" · ");

  let hovered = null;
  svg.addEventListener("pointerover", e => {
    const t = e.target;
    if (!t.dataset || !t.dataset.k) return;
    hovered?.classList.remove("hover");
    hovered = t;
    t.classList.add("hover");
  });
  svg.addEventListener("pointerout", e => { if (e.target === hovered) { hovered.classList.remove("hover"); hovered = null; hideTip(); } });
  svg.addEventListener("pointermove", e => {
    if (drag && moved) return;
    const t = e.target;
    if (!t.dataset || !t.dataset.k) return hideTip();
    showTip(e, tipContent(t));
  });
  const noHover = matchMedia("(hover: none)");
  svg.addEventListener("click", e => {
    if (moved) return;
    const t = e.target;
    // a les pantalles tàctils no hi ha «passar per sobre»: un toc mostra el rètol
    if (noHover.matches) { if (t.dataset?.k) showTip(e, tipContent(t)); else hideTip(); }
    if (t.dataset?.k === "people" && mode === "peoples") selectPeople([+t.dataset.i], null, false);
    if (t.dataset?.k === "lang") selectLang(+t.dataset.i, null, false);
  });

  function tipContent(t) {
    const k = t.dataset.k;
    if (k === "country" && mode === "loff") return officialTip(t.dataset.a3);
    if (k === "country" && mode === "ldiv") return langCountryTip(t.dataset.a3);
    if (k === "p1914" && mode === "loff") return official1914Tip(+t.dataset.i);
    if (k === "country") {
      const a3 = t.dataset.a3;
      if (mode === "timeline") {
        const [, code, name] = stateAt(a3, year);
        const cur = stateAt(a3, year);
        const hist = (H.COUNTRIES[a3]?.t || []).map(r => `<li class="${r === cur ? "now" : ""}"><span>${r[0]}</span><span>${r[1] === "PRE" ? tx("Abans de la conquesta formal") : esc(r[2])}${noteRefs(r[3])}</span></li>`).join("");
        return `<strong>${esc(name)}</strong><span class="tt-power">${swatch(code)}${esc(P[code].name)}</span><div class="tt-sub">${tx("Avui:")} ${esc(countryName(a3))}</div><ol>${hist}</ol>${tipNotes(cur[3])}`;
      }
      if (mode === "names") {
        const lc = lastColonial(a3);
        return `<strong>${esc(countryName(a3))}</strong><span class="tt-power">${swatch(lc[1])}${tx("abans:")} ${esc(lc[2])}</span>`;
      }
      return `<strong>${esc(countryName(a3))}</strong>`;
    }
    if (k === "p1880") {
      const p = G.p1880[+t.dataset.i];
      const [name, code, notes] = H.P1880[p.n] || [p.n, "AF"];
      return `<strong>${esc(name)}</strong><span class="tt-power">${swatch(code)}${code === "AF" ? tx("Entitat política africana") : esc(P[code].name)}</span><div class="tt-sub">${tx("Mapa de 1880 · avui dins de:")} ${todayList(p.today) || "—"}</div>${tipNotes(notes)}`;
    }
    if (k === "p1914") {
      const p = G.p1914[+t.dataset.i];
      const [name, code, notes] = H.P1914[p.n] || [p.n, "AF"];
      return `<strong>${esc(name)}</strong><span class="tt-power">${swatch(code)}${esc(P[code].name)}</span><div class="tt-sub">${tx("Mapa de 1914 · avui:")} ${todayList(p.today) || "—"}</div>${tipNotes(notes)}`;
    }
    if (k === "lang") return langTip(+t.dataset.i);
    if (k === "people") {
      const p = G.peoples[+t.dataset.i];
      const key = $("#peoples1914").checked ? "s14" : "s";
      const list = p[key].filter(s => s[1] >= 1).map(([u, pct]) => `${esc(key === "s" ? countryName(u) : shortName((H.P1914[u] || [u])[0]))} ${Math.round(pct)}%`).join(" · ");
      return `<strong>${esc(p.n)}</strong><div class="tt-sub">${tx("Grup cultural:")} ${esc(p.g || "—")}</div><div>${list}</div>${isPartitioned(p, key) ? `<div class="tt-sub" style="color:#f08c78">${tx("Poble partit")}</div>` : ""}`;
    }
    return "";
  }

  // ================================================================ Cronologia
  const START = H.START, END = H.END;
  let year = START;
  function stateAt(a3, y) {
    const rows = H.COUNTRIES[a3]?.t;
    if (!rows) return [START, "PRE"];
    let r = null;
    for (const row of rows) { if (row[0] <= y) r = row; else break; }
    return r || [START, "PRE"];
  }
  const ticks = $("#ticks");
  const KIND_COLORS = { violencia: "#c23b32", resistencia: "#e9a23b", independencia: "#efe0bb", frontera: "#8aa0b8", conquesta: "#9b6a4c" };
  const KIND_NAMES = { violencia: tx("violència"), resistencia: tx("resistència"), independencia: tx("independència"), frontera: tx("fronteres"), conquesta: tx("conquesta") };
  H.EVENTS.forEach(ev => {
    const b = html("button", { title: `${ev.y} · ${ev.t}`, "aria-label": `${ev.y}: ${ev.t}` });
    b.style.left = `${((ev.y - START) / (END - START)) * 100}%`;
    b.style.background = KIND_COLORS[ev.k];
    b.onclick = () => { stop(); setYear(ev.y, ev); };
    ticks.append(b);
  });
  const evList = $("#eventList");
  H.EVENTS.forEach(ev => {
    const li = html("li"), b = html("button");
    b.innerHTML = `<span class="y">${ev.y}</span><span class="dot" style="background:${KIND_COLORS[ev.k]}"></span><span>${esc(ev.t)}</span>`;
    b.onclick = () => { stop(); setYear(ev.y, ev); };
    li.append(b); evList.append(li);
  });
  const vList = $("#violenceList");
  H.EVENTS.filter(ev => ev.k === "violencia").forEach(ev => {
    const li = html("li"), b = html("button");
    b.innerHTML = `<span class="y">${ev.y}</span><span><span class="t">${esc(ev.t)}</span>${esc(ev.d)}${uniq(ev.n).map(id => ` <sup>[${noteNum(id)}]</sup>`).join("")}</span>`;
    b.onclick = () => { setMode("timeline"); stop(); setYear(ev.y, ev); $(".atlas").scrollIntoView({ behavior: "smooth" }); };
    li.append(b); vList.append(li);
  });

  function currentEvent(y) {
    let ev = null;
    for (const e of H.EVENTS) if (e.y <= y) ev = e;
    return ev;
  }
  function renderEvent(ev) {
    const card = $("#eventCard");
    card.className = `event-card k-${ev.k}`;
    card.innerHTML = `<div class="ev-year">${ev.y}<span class="kind">${KIND_NAMES[ev.k]}</span></div><h3>${esc(ev.t)}</h3><p>${esc(ev.d)}${noteRefs(ev.n)}</p>${noteBlock(ev.n)}`;
  }
  function flash(codes) {
    gHL.replaceChildren();
    if (!codes?.length) return;
    for (const a3 of codes) if (G.countries[a3]) el("path", { class: "hl-border", d: G.countries[a3].d }, gHL);
    scheduleLabels();
  }

  let shownEvent = null;
  function setYear(y, focusEvent) {
    year = clamp(Math.round(y), START, END);
    $("#yearSlider").value = year;
    $("#yearBadge").textContent = year;
    paintTimeline();
    const ev = focusEvent || currentEvent(year);
    if (ev && ev !== shownEvent) {
      shownEvent = ev;
      renderEvent(ev);
      flash(ev.y === year ? ev.c : []);
    } else if (ev && ev.y !== year) {
      gHL.replaceChildren();
    }
  }

  function paintTimeline() {
    const future = $("#futureBorders").checked;
    let pre = 0, col = 0, ind = 0, oth = 0;
    for (const a3 of A3) {
      const [, code, name] = stateAt(a3, year);
      const p = countryPaths[a3];
      const isPre = code === "PRE";
      p.classList.toggle("pre", isPre);
      if (!isPre) p.setAttribute("fill", P[code].color);
      p.style.fillOpacity = isPre ? 0 : code === "IND" ? 0.9 : 0.94;
      p.style.pointerEvents = isPre ? "none" : "";
      futurePaths[a3].classList.toggle("on", future && isPre);
      const L = countryLabels[a3];
      L.forceHidden = isPre;
      if (!isPre) setLabelText(L, shortName(name));
      L.el.classList.toggle("dark", code === "IND");
      const a = G.countries[a3].a;
      if (isPre) { const f = footprint1880[a3] || 0; col += f; pre += a - f; }
      else if (code === "IND" || code === "AF") ind += a;
      else if (H.COLONIAL.has(code)) col += a;
      else oth += a; // otomà / egipci o ocupació per un estat veí
    }
    // etiquetes de 1880: amagades si el seu territori principal ja ha estat conquerit
    G.p1880.forEach((p, i) => {
      const main = p.today[0]?.[0];
      polityLabels[i].forceHidden = main ? stateAt(main, year)[1] !== "PRE" : false;
    });
    const tot = pre + col + ind + oth || 1;
    $("#colonizedPct").textContent = fmtPct((col / tot) * 100);
    $("#prePct").textContent = fmtPct((pre / tot) * 100);
    $("#indPct").textContent = fmtPct((ind / tot) * 100);
    $("#othPct").textContent = fmtPct((oth / tot) * 100);
    $("#segOth").style.width = `${(oth / tot) * 100}%`;
    $("#segPre").style.width = `${(pre / tot) * 100}%`;
    $("#segCol").style.width = `${(col / tot) * 100}%`;
    $("#segInd").style.width = `${(ind / tot) * 100}%`;
    scheduleLabels();
  }
  function colonizedShare(y) {
    let col = 0;
    for (const a3 of A3) if (H.COLONIAL.has(stateAt(a3, y)[1])) col += G.countries[a3].a;
    return (col / totalArea) * 100;
  }

  // reproducció
  let playing = false, last = 0, acc = 0, holdUntil = 0;
  const playBtn = $("#playButton");
  function play() {
    if (year >= END) setYear(START);
    playing = true; playBtn.textContent = "❚❚"; playBtn.setAttribute("aria-label", tx("Atura"));
    last = performance.now(); acc = 0;
    setTimeout(loop, 40);
  }
  function stop() { playing = false; playBtn.textContent = "▶"; playBtn.setAttribute("aria-label", tx("Reprodueix")); }
  function loop() {
    if (!playing) return;
    const t = performance.now();
    if (t < holdUntil) { last = t; return setTimeout(loop, 40); }
    acc += ((t - last) / 1000) * Number($("#speedSelect").value);
    last = t;
    // avança un any per cada unitat acumulada (robust si els fotogrames arriben lents)
    let steps = Math.min(Math.floor(acc), 10);
    acc -= steps;
    while (steps-- > 0) {
      setYear(year + 1);
      if (year >= END) return stop();
      const ev = H.EVENTS.find(e => e.y === year);
      if (ev && $("#pauseEvents").checked) { holdUntil = t + 1400 + ev.d.length * 18; acc = 0; break; }
    }
    setTimeout(loop, 40);
  }
  playBtn.onclick = () => (playing ? stop() : play());
  $("#yearSlider").addEventListener("input", e => { stop(); setYear(+e.target.value); });
  $("#futureBorders").addEventListener("change", paintTimeline);
  document.addEventListener("keydown", e => {
    if (mode !== "timeline" || e.target.closest("input, select, textarea")) return;
    if (e.key === " ") { e.preventDefault(); playing ? stop() : play(); }
    if (e.key === "ArrowRight") { stop(); setYear(year + 1); }
    if (e.key === "ArrowLeft") { stop(); setYear(year - 1); }
  });

  // ================================================================ Comparar
  const SNAPS = {
    y1880: { label: tx("1880 · regnes i pobles abans del repartiment"), tag: "1880" },
    y1914: { label: tx("1914 · el continent repartit"), tag: "1914" },
    today: { label: tx("Avui · estats independents"), tag: tx("Avui") },
    peoples: { label: tx("Pobles · mapa de Murdock (1959)"), tag: tx("Pobles") }
  };
  const PRESETS = [["y1880", "y1914", "1880 ↔ 1914"], ["y1914", "today", tx("1914 ↔ avui")], ["y1880", "today", tx("1880 ↔ avui")], ["peoples", "today", tx("Pobles ↔ estats")], ["peoples", "y1914", tx("Pobles ↔ colònies")]];
  const NOTES = {
    "y1880|y1914": tx("En 34 anys, el mosaic de regnes, califats i ciutats estat queda substituït per unes poques grans colònies."),
    "y1914|today": tx("Les fronteres actuals són, en gran part, les de les colònies. Les grans federacions franceses es van dividir, però les línies es van mantenir."),
    "y1880|today": tx("Compara les entitats polítiques africanes amb els estats actuals: poques fronteres d'avui coincideixen amb les d'abans de la conquesta."),
    "peoples|today": tx("Els territoris dels pobles no coincideixen amb les fronteres dels estats: molts queden partits entre dos o més països."),
    "peoples|y1914": tx("Les fronteres colonials ja tallaven els territoris dels pobles el 1914.")
  };
  let cmp = { left: "y1880", right: "today", x: 0.5 };
  const selL = $("#compareLeft"), selR = $("#compareRight");
  for (const [k, v] of Object.entries(SNAPS)) { selL.append(new Option(v.label, k)); selR.append(new Option(v.label, k)); }
  PRESETS.forEach(([l, r, label]) => {
    const b = html("button", {}, label);
    b.onclick = () => { cmp.left = l; cmp.right = r; renderCompare(); };
    $("#comparePresets").append(b);
  });
  selL.onchange = () => { cmp.left = selL.value; if (cmp.left === cmp.right) cmp.right = Object.keys(SNAPS).find(k => k !== cmp.left); renderCompare(); };
  selR.onchange = () => { cmp.right = selR.value; if (cmp.left === cmp.right) cmp.left = Object.keys(SNAPS).find(k => k !== cmp.right); renderCompare(); };
  $("#overlayBorders").onchange = () => renderCompare();
  $("#compareLabels").onchange = () => renderCompare();

  function paintToday() {
    for (const a3 of A3) {
      const p = countryPaths[a3];
      p.classList.remove("pre");
      p.style.pointerEvents = "";
      p.setAttribute("fill", todayColors[a3]);
      p.style.fillOpacity = 1;
      countryLabels[a3].forceHidden = false;
      setLabelText(countryLabels[a3], countryName(a3));
      countryLabels[a3].el.classList.add("dark");
    }
  }
  function renderCompare() {
    selL.value = cmp.left; selR.value = cmp.right;
    paintToday();
    paintPeoples("s");
    for (const [k, g] of Object.entries(snap)) {
      g.style.display = k === cmp.left || k === cmp.right ? "" : "none";
      g.removeAttribute("clip-path");
    }
    for (const L of polityLabels) L.forceHidden = false;
    stage.insertBefore(snap[cmp.right], gLangHex);
    stage.insertBefore(snap[cmp.left], gLangHex);
    snap[cmp.left].setAttribute("clip-path", "url(#swipeClip)");
    gOverlay.style.display = $("#overlayBorders").checked ? "" : "none";
    const showLabels = $("#compareLabels").checked;
    for (const g of [l1880, l1914, lPeoples, lCountriesG]) g.style.display = showLabels ? "" : "none";
    $("#swipeLeftTag").textContent = SNAPS[cmp.left].tag;
    $("#swipeRightTag").textContent = SNAPS[cmp.right].tag;
    $("#compareNote").textContent = NOTES[`${cmp.left}|${cmp.right}`] || NOTES[`${cmp.right}|${cmp.left}`] || "";
    renderLegend();
    updateSwipe();
    scheduleLabels();
  }
  function updateSwipe() {
    if (mode !== "compare") return;
    const r = wrap.getBoundingClientRect();
    const px = r.left + cmp.x * r.width;
    const p = toSvg(px, r.top);
    clipRect.setAttribute("x", -5000);
    clipRect.setAttribute("width", Math.max(0, p.x + 5000));
    $("#swipe").style.setProperty("--x", `${cmp.x * 100}%`);
  }
  {
    const handle = $("#swipeHandle");
    let dragging = false;
    handle.addEventListener("pointerdown", e => { dragging = true; handle.setPointerCapture(e.pointerId); e.stopPropagation(); });
    handle.addEventListener("pointermove", e => {
      if (!dragging) return;
      const r = wrap.getBoundingClientRect();
      cmp.x = clamp((e.clientX - r.left) / r.width, 0.02, 0.98);
      updateSwipe();
    });
    handle.addEventListener("pointerup", () => { dragging = false; });
    handle.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") cmp.x = clamp(cmp.x - 0.04, 0.02, 0.98);
      if (e.key === "ArrowRight") cmp.x = clamp(cmp.x + 0.04, 0.02, 0.98);
      updateSwipe();
    });
  }

  // ================================================================ Pobles partits
  const partCount = G.peoples.filter(p => isPartitioned(p)).length;
  $("#peopleTotal").textContent = G.peoples.length;
  $("#peoplePart").textContent = partCount;
  $("#statPartitioned").textContent = partCount;
  $("#statColonized1914").textContent = fmtPct(colonizedShare(1914));
  const dl = $("#peopleNames");
  [...new Set(G.peoples.map(p => p.n))].sort((a, b) => a.localeCompare(b, LANG)).forEach(n => dl.append(new Option(n)));
  $("#peopleSearch").addEventListener("change", e => {
    const q = e.target.value.trim().toLowerCase();
    const idx = G.peoples.map((p, i) => [p, i]).filter(([p]) => p.n.toLowerCase() === q).map(([, i]) => i);
    if (idx.length) selectPeople(idx, null, true);
  });
  const storyBtns = H.STORIES.map(s => {
    const b = html("button", {}, s.label);
    b.onclick = () => {
      const idx = G.peoples.map((p, i) => [p, i]).filter(([p]) => (s.g ? p.g === s.id : p.n === s.id)).map(([, i]) => i);
      if (idx.length) selectPeople(idx, s, true);
    };
    $("#stories").append(b);
    return [s, b];
  });
  $("#peoples1914").onchange = () => { renderPeoples(); if (selectedPeople) selectPeople(selectedPeople.idx, selectedPeople.story, false); };

  let selectedPeople = null;
  function aggregateShares(idx, key) {
    const acc = {};
    let tot = 0;
    for (const i of idx) {
      const p = G.peoples[i];
      tot += p.a;
      for (const [u, pct] of p[key]) acc[u] = (acc[u] || 0) + p.a * pct / 100;
    }
    return Object.entries(acc).map(([u, a]) => [u, (a / tot) * 100]).sort((a, b) => b[1] - a[1]);
  }
  function selectPeople(idx, story, fly) {
    selectedPeople = { idx, story };
    const key = $("#peoples1914").checked ? "s14" : "s";
    const set = new Set(idx);
    peoplePaths.forEach((p, i) => { p.classList.toggle("sel", set.has(i)); p.classList.toggle("dim", !set.has(i)); });
    for (const [s, b] of storyBtns) b.classList.toggle("on", s === story);
    const sh = aggregateShares(idx, key).filter(s => s[1] >= 0.5);
    const first = G.peoples[idx[0]];
    const title = story ? story.label : first.n;
    const sub = story?.g ? tx("{n} grups del mapa de Murdock", { n: idx.length }) : `${tx("Grup cultural:")} ${first.g || "—"}`;
    const unitName = u => (key === "s" ? countryName(u) : shortName((H.P1914[u] || [u])[0]));
    const nUnits = sh.filter(s => s[1] >= 10).length;
    $("#peopleDetail").innerHTML = `<h3>${esc(title)}</h3><div class="grp">${esc(sub)}</div>
      ${story ? `<p>${esc(story.d)}</p>` : ""}
      <p><strong>${nUnits > 1 ? tx(key === "s" ? "Partit entre {n} estats" : "Partit entre {n} unitats colonials", { n: nUnits }) : tx(key === "s" ? "Majoritàriament dins d'un sol estat" : "Majoritàriament dins d'un sol territori")}</strong> ${key === "s" ? tx("(fronteres actuals)") : tx("(fronteres de 1914)")}:</p>
      <div class="shares">${sh.map(([u, pct]) => `<div class="share"><span>${esc(unitName(u))}</span><span class="share-bar"><span style="width:${pct}%"></span></span><span class="share-pct">${Math.round(pct)}%</span></div>`).join("")}</div>`;
    if (fly) flyTo(unionBox(idx.map(i => peoplePaths[i])), 0.35);
  }
  function clearPeople() {
    selectedPeople = null;
    peoplePaths.forEach(p => p.classList.remove("sel", "dim"));
    for (const [, b] of storyBtns) b.classList.remove("on");
    $("#peopleDetail").innerHTML = `<p class="note">${tx("Passa per sobre d'un territori o fes-hi clic per veure com el van repartir les fronteres.")}</p>`;
  }
  function renderPeoples() {
    const use1914 = $("#peoples1914").checked;
    paintPeoples(use1914 ? "s14" : "s");
    gOverlay.style.display = use1914 ? "none" : "";
    gOverlay1914.style.display = use1914 ? "" : "none";
    renderLegend();
  }

  // ================================================================ Noms
  let namesMode = "colonial";
  function lastColonial(a3) {
    if (a3 === "ETH") return [0, "AF", tx("Abissínia")];
    const rows = H.COUNTRIES[a3]?.t || [];
    const col = rows.filter(r => H.COLONIAL.has(r[1]));
    return col.length ? col[col.length - 1] : rows[0] || [0, "IND", countryName(a3)];
  }
  const renameList = $("#renames");
  const renameBtns = H.RENAMES.map(r => {
    const li = html("li"), b = html("button");
    b.innerHTML = `<span class="from">${r.from.map(esc).join(" → ")}</span> → <span class="to">${esc(r.to)}</span><span class="yr">${r.y}</span><span class="why">${esc(r.why)}</span>`;
    b.onclick = () => {
      renameBtns.forEach(x => x.classList.toggle("on", x === b));
      const codes = r.a3 === "RWA" ? ["RWA", "BDI"] : r.a3 === "SOM" ? ["SOM", "SOL"] : r.a3 === "TZA" ? ["TZA"] : [r.a3];
      flash(codes);
      flyTo(unionBox(codes.map(c => countryPaths[c])), 0.8);
    };
    li.append(b); renameList.append(li);
    return b;
  });
  $$("[data-names]").forEach(b => b.onclick = () => { namesMode = b.dataset.names; renderNames(); });
  $("#showCities").onchange = () => renderNames();

  function renderNames() {
    $$("[data-names]").forEach(b => b.setAttribute("aria-pressed", b.dataset.names === namesMode));
    for (const a3 of A3) {
      const p = countryPaths[a3], L = countryLabels[a3];
      p.classList.remove("pre");
      p.style.pointerEvents = "";
      p.style.fillOpacity = 1;
      L.forceHidden = false;
      if (namesMode === "colonial") {
        const [, code, name] = lastColonial(a3);
        p.setAttribute("fill", P[code].color);
        setLabelText(L, shortName(name));
        L.el.classList.toggle("dark", code === "IND" || code === "AF");
      } else {
        p.setAttribute("fill", todayColors[a3]);
        setLabelText(L, countryName(a3));
        L.el.classList.add("dark");
      }
    }
    gCities.style.display = $("#showCities").checked ? "" : "none";
    for (const c of cityEls) {
      c.t.textContent = namesMode === "colonial" ? c.c.old : c.c.now;
      c.t.classList.toggle("old", namesMode === "colonial");
    }
    renderLegend();
    scheduleLabels();
  }

  // ================================================================ Llegenda
  function legendItems(codes) {
    return codes.map(c => `<div class="legend-item"><span class="legend-swatch" style="background:${P[c].color}"></span>${esc(P[c].short)}</div>`).join("");
  }
  function renderLegend() {
    const lg = $("#legend");
    if (mode === "timeline") {
      lg.innerHTML = `<div class="legend-title">${tx("Qui governa")}</div>${legendItems(["FR", "GB", "PT", "BE", "LEO", "DE", "IT", "ES", "SET", "OT", "OCC", "AF", "IND"])}<div class="legend-item"><span class="legend-swatch" style="background:#a65a3f"></span>${tx("Regnes i pobles (1880)")}</div><div class="legend-item"><span class="legend-swatch" style="background:url(#hatch);background:repeating-linear-gradient(35deg,#4a3f33 0 3px,#6b5b48 3px 5px)"></span>${tx("No representat al mapa")}${noteRefs(["hatch"])}</div>`;
    } else if (mode === "compare") {
      const parts = [];
      if ([cmp.left, cmp.right].includes("y1880") || [cmp.left, cmp.right].includes("y1914")) parts.push(legendItems(["FR", "GB", "PT", "BE", "DE", "IT", "ES", "SET", "OT", "AF"]));
      if ([cmp.left, cmp.right].includes("peoples")) parts.push(`<div class="legend-item"><span class="legend-swatch" style="background:#c9452f"></span>${tx("Poble partit")}</div>`);
      if ($("#overlayBorders").checked) parts.push(`<div class="legend-item"><span class="legend-swatch" style="background:transparent;border-color:#fff"></span>${tx("Fronteres actuals")}</div>`);
      lg.innerHTML = `<div class="legend-title">${tx("Llegenda")}</div>${parts.join("")}`;
    } else if (mode === "peoples") {
      lg.innerHTML = `<div class="legend-title">${tx("Territoris dels pobles")}</div>
        <div class="legend-item"><span class="legend-swatch" style="background:#c9452f"></span>${tx($("#peoples1914").checked ? "Partit entre 2 colònies" : "Partit entre 2 estats")}</div>
        <div class="legend-item"><span class="legend-swatch" style="background:#9e2a22"></span>${tx("Partit entre 3")}</div>
        <div class="legend-item"><span class="legend-swatch" style="background:#6e1a16"></span>${tx("Partit entre 4 o més")}</div>
        <div class="legend-item"><span class="legend-swatch" style="background:#5d5248"></span>${tx("Dins d'un sol territori")}</div>
        <div class="legend-item"><span class="legend-swatch" style="background:transparent;border-color:#fff"></span>${tx($("#peoples1914").checked ? "Fronteres de 1914" : "Fronteres actuals")}</div>`;
    } else if (mode.startsWith("l")) {
      lg.innerHTML = langLegend();
    } else {
      lg.innerHTML = namesMode === "colonial"
        ? `<div class="legend-title">${tx("Últim poder colonial")}</div>${legendItems(["FR", "GB", "PT", "BE", "DE", "IT", "ES", "SET", "AF"])}`
        : `<div class="legend-title">${tx("Noms actuals")}</div><div class="legend-item">${tx("Ciutats: nom actual")}</div>`;
    }
  }


  // ================================================================ Llengües
  const LI = window.LANGINFO;
  const LANGS = window.LANGS || [];
  const LV = LANGS.filter(d => d[5] !== 6);
  const EXTRA_PLACES = Object.fromEntries(Object.entries({ RE: "la Reunió", YT: "Maiotte", FR: "França", ISR: "Israel", USA: "Estats Units", ESP: "Espanya", JOR: "Jordània", PSX: "Palestina", SAU: "Aràbia Saudita", ARE: "Emirats Àrabs Units", YEM: "Iemen" }).map(([k, v]) => [k, tx(v)]));
  const langCountries = d => (d[6] ? d[6].split(",").map(c => (G.countries[c] ? countryName(c) : EXTRA_PLACES[c] || c)).join(", ") : "—");
  const langEra = d => (d[7] === null ? "unknown" : d[7] < 1500 ? "old" : d[7] < 1880 ? "mid" : "recent");
  const ERA = { old: { name: tx("antigues (abans de 1500)"), color: "#9a8f80" }, mid: { name: tx("documentades per darrer cop entre 1500 i 1879"), color: "#e9a23b" }, recent: { name: tx("documentades per darrer cop després de 1880"), color: "#ff5a45" }, unknown: { name: tx("data de documentació desconeguda"), color: "#cfc6b8" } };
  let ldivMode = "count", lextMode = "extinct", loffMode = "now";

  $("#langLiving").textContent = LV.length.toLocaleString(LANG);
  $("#langNga").textContent = tx("{n} llengües", { n: LV.filter(d => d[6].split(",").includes("NGA")).length });
  $("#lextCount").textContent = LANGS.filter(d => d[5] === 6).length;
  $("#lextAfter").textContent = LANGS.filter(d => d[5] === 6 && langEra(d) === "recent").length;
  $("#lextDanger").textContent = LANGS.filter(d => d[5] === 4 || d[5] === 5).length;

  // ---------------------------------------------------------------- Punts
  const ptEls = [];
  const storyLabelEls = [];
  function buildPoints() {
    if (ptEls.length) return;
    LANGS.forEach((d, i) => ptEls.push(el("circle", { class: "lang-pt", cx: d[0], cy: d[1], r: 2, "data-k": "lang", "data-i": i }, gLangPts)));
    const lg = el("g", {}, gLangPts);
    for (const st of LI.STORIES) {
      const i = LANGS.findIndex(d => d[2] === st.id);
      if (i < 0) continue;
      const L = addLabel(lg, { l: [LANGS[i][0], LANGS[i][1] - 7], a: 9e4 }, st.label, "lbl serif");
      L.force = true;
      storyLabelEls.push(L);
    }
    zoomHooks.push(k => {
      if (gLangPts.style.display === "none") return;
      for (const c of ptEls) {
        const big = c.classList.contains("big");
        c.setAttribute("r", ((big ? 4.2 : 2.6) / Math.max(k, 0.6)).toFixed(2));
        c.setAttribute("stroke-width", (1 / k).toFixed(2));
      }
      for (const L of storyLabelEls) L.el.setAttribute("y", L.y - 4 / k);
    });
  }
  function paintPoints(kind) {
    buildPoints();
    LANGS.forEach((d, i) => {
      const c = ptEls[i];
      let show = true, fill, stroke = "none", big = false;
      if (kind === "family") { fill = LI.GROUPS[d[3]].color; if (d[5] === 6) { stroke = fill; fill = "none"; } }
      else if (kind === "extinct") {
        show = d[5] >= 5; big = true;
        if (d[5] === 6) { fill = ERA[langEra(d)].color; stroke = "#111"; }
        else { fill = "none"; stroke = "#ff5a45"; }
      } else { fill = LI.AES[d[5]].color; if (d[5] === 6) stroke = "#f3e7d3"; big = d[5] >= 4; }
      c.style.display = show ? "" : "none";
      c.setAttribute("fill", fill);
      c.setAttribute("stroke", stroke);
      c.classList.toggle("big", big);
    });
    for (const L of storyLabelEls) L.forceHidden = kind === "family";
  }

  // ---------------------------------------------------------------- Llengües per país
  // Es compta per països (llista de Glottolog), no per punts: una llengua com el kikongo
  // compta a Angola, la RD del Congo i el Congo.
  const africanCodes = d => d[6].split(",").filter(c => G.countries[c]);
  const LBC = {};
  LANGS.forEach((d, i) => { if (d[5] !== 6) for (const c of africanCodes(d)) (LBC[c] ||= []).push(i); });
  const langsOf = a3 => LBC[a3] || (a3 === "SOL" ? LBC.SOM || [] : []);
  const sharedOf = a3 => langsOf(a3).filter(i => africanCodes(LANGS[i]).length > 1);
  const COUNT_STEPS = [[1, "#4a3a2c"], [11, "#6e4a26"], [31, "#9a5e22"], [61, "#c97b1f"], [121, "#eba23a"], [251, "#ffd98a"]];
  const SHARE_STEPS = [[0, "#3c3530"], [20, "#5b3a33"], [40, "#87423a"], [60, "#b54a3c"], [80, "#e3583f"]];
  const stepColor = (steps, n) => { let c = steps[0][1]; for (const [min, col] of steps) if (n >= min) c = col; return c; };
  const famCache = {};
  function familyFill(a3) {
    const idx = langsOf(a3);
    if (!idx.length) return "#555";
    const cnt = {};
    for (const i of idx) cnt[LANGS[i][3]] = (cnt[LANGS[i][3]] || 0) + 1;
    let parts = Object.entries(cnt).map(([g, c]) => [g, c / idx.length]).sort((x, y) => y[1] - x[1]);
    const small = parts.filter(([, f]) => f < 0.08).reduce((t, [, f]) => t + f, 0);
    parts = parts.filter(([, f]) => f >= 0.08);
    if (small) parts.push(["ot", small]);
    if (parts.length === 1) return LI.GROUPS[parts[0][0]].color;
    const id = `fp-${a3}`;
    if (!famCache[id]) {
      const W = 24, pat = el("pattern", { id, width: W, height: 10, patternUnits: "userSpaceOnUse", patternTransform: "rotate(40)" }, defs);
      const tot = parts.reduce((t, [, f]) => t + f, 0);
      let x = 0;
      for (const [g, f] of parts) { const w = (f / tot) * W; el("rect", { x: x.toFixed(2), y: 0, width: (w + 0.05).toFixed(2), height: 10, fill: LI.GROUPS[g].color }, pat); x += w; }
      famCache[id] = `url(#${id})`;
    }
    return famCache[id];
  }
  function langCountryTip(a3) {
    const idx = langsOf(a3), sh = sharedOf(a3);
    const nat = LI.NATIONAL[a3];
    const off = LI.NOW[a3] ? LI.NOW[a3].l.map(r => r[0]).join(", ") : "—";
    const byFam = {};
    for (const i of idx) (byFam[LANGS[i][3]] ||= []).push(i);
    const famRows = Object.entries(byFam).sort((x, y) => y[1].length - x[1].length)
      .map(([g, list]) => `<li><span class="legend-swatch" style="background:${LI.GROUPS[g].color}"></span>${list.length} · ${esc(LI.GROUPS[g].name)}</li>`).join("");
    const listHtml = idx.map(i => LANGS[i]).sort((x, y) => x[2].localeCompare(y[2], LANG))
      .map(d => { const others = africanCodes(d).filter(c => c !== a3 && !(a3 === "SOL" && c === "SOM")); return `<span class="lang-chip${others.length ? " shared" : ""}" title="${others.length ? tx("També a:") + " " + esc(others.map(countryName).join(", ")) : ""}">${esc(d[2])}${LI.ALIAS[d[2]] ? ` (${esc(LI.ALIAS[d[2]])})` : ""}</span>`; }).join(" ");
    $("#langCountryDetail").innerHTML = `<h3>${esc(countryName(a3))}</h3>
      <div class="grp">${tx("{n} llengües vives segons Glottolog · {s} també es parlen en altres estats africans", { n: idx.length, s: sh.length })}${a3 === "SOL" ? ` ${tx("(Glottolog no separa Somalilàndia de Somàlia)")}` : ""}</div>
      <p><strong>${tx("Oficials:")}</strong> ${esc(off)}${nat ? `<br><strong>${tx("Nacionals o reconegudes:")}</strong> ${esc(nat)}` : ""}</p>
      <ol class="tt-langs">${famRows}</ol>
      <p class="note">${tx("Subratllades, les llengües compartides amb altres estats (passa-hi per sobre per veure on).")}</p>
      <div class="lang-chips">${listHtml}</div>`;
    return `<strong>${esc(countryName(a3))}</strong><div class="tt-sub">${tx("{n} llengües vives · {s} compartides amb altres estats ({p}%)", { n: idx.length, s: sh.length, p: idx.length ? Math.round((sh.length / idx.length) * 100) : 0 })}</div>
      <div class="tt-sub">${tx("Oficials:")} ${esc(off)}</div>${nat ? `<div class="tt-sub">${tx("Nacionals:")} ${esc(nat)}</div>` : ""}`;
  }

  // ---------------------------------------------------------------- Detall i històries
  function langTip(i) {
    const d = LANGS[i];
    const st = LI.AES[d[5]];
    return `<strong>${esc(d[2])}${LI.ALIAS[d[2]] ? ` (${esc(LI.ALIAS[d[2]])})` : ""}</strong><span class="tt-power"><span class="legend-swatch" style="background:${LI.GROUPS[d[3]].color}"></span>${esc(tx(d[4]))}</span>
      <div class="tt-sub">${tx("Estat:")} ${esc(st.name)}${d[7] !== null ? ` · ${tx("darrera documentació:")} ${d[7] < 0 ? tx("{y} aC", { y: -d[7] }) : d[7]}` : ""}</div><div class="tt-sub">${esc(langCountries(d))}</div>`;
  }
  const langStoryBtns = LI.STORIES.map(st => {
    const b = html("button", {}, st.label);
    b.onclick = () => { const i = LANGS.findIndex(d => d[2] === st.id); if (i >= 0) selectLang(i, st, true); };
    $("#langStories").append(b);
    return [st, b];
  });
  function selectLang(i, story, fly) {
    const d = LANGS[i];
    story = story || LI.STORIES.find(s => s.id === d[2]) || null;
    for (const [s, b] of langStoryBtns) b.classList.toggle("on", s === story);
    gHL.replaceChildren();
    el("circle", { class: "hl-border", cx: d[0], cy: d[1], r: 9 }, gHL);
    $("#langDetail").innerHTML = `<h3>${esc(story ? story.label : d[2])}</h3>
      <div class="grp">${esc(tx(d[4]))} · ${esc(LI.AES[d[5]].name)}${d[7] !== null ? ` · ${tx("darrera documentació:")} ${d[7] < 0 ? tx("{y} aC", { y: -d[7] }) : d[7]}` : ""} · ${esc(langCountries(d))}</div>
      ${story ? `<p>${esc(story.d)}${noteRefs(story.n)}</p>${noteBlock(story.n)}` : ""}
      <p class="note"><a href="https://glottolog.org/resource/languoid/id/${esc(d[8])}" target="_blank" rel="noopener">${tx("Fitxa a Glottolog")}</a></p>`;
    if (fly) flyTo({ x: d[0] - 40, y: d[1] - 40, width: 80, height: 80 }, 0.6);
    scheduleLabels();
  }
  {
    const list = LANGS.filter(d => d[5] === 6 && langEra(d) === "recent").sort((a, b) => (a[7] || 0) - (b[7] || 0));
    for (const d of list) {
      const li = html("li"), b = html("button");
      b.innerHTML = `<span class="y">${d[7] ?? "?"}</span><span>${esc(d[2])} <span class="note">· ${esc(langCountries(d))}</span></span>`;
      b.onclick = () => selectLang(LANGS.indexOf(d), null, true);
      li.append(b); $("#extinctList").append(li);
    }
  }

  // ---------------------------------------------------------------- Mapa de punts / hexàgons
  function neutralCountries(showLabels) {
    for (const a3 of A3) {
      const p = countryPaths[a3];
      p.classList.remove("pre");
      p.style.pointerEvents = "none";
      p.setAttribute("fill", "#2c2621");
      p.style.fillOpacity = 1;
      countryLabels[a3].forceHidden = !showLabels;
      setLabelText(countryLabels[a3], countryName(a3));
      countryLabels[a3].el.classList.remove("dark");
    }
  }
  function renderLangMap() {
    snap.today.style.display = "";
    gOverlay.style.display = "";
    gLangHex.style.display = "none";
    if (mode === "ldiv") {
      gLangPts.style.display = "none";
      for (const a3 of A3) {
        const p = countryPaths[a3], n = langsOf(a3).length, sh = sharedOf(a3).length;
        p.classList.remove("pre");
        p.style.pointerEvents = "";
        p.style.fillOpacity = 1;
        p.setAttribute("fill", ldivMode === "count" ? stepColor(COUNT_STEPS, n) : ldivMode === "shared" ? stepColor(SHARE_STEPS, n ? (sh / n) * 100 : 0) : familyFill(a3));
        const L = countryLabels[a3];
        L.forceHidden = false;
        setLabelText(L, ldivMode === "family" ? countryName(a3) : `${countryName(a3)} ${ldivMode === "count" ? n : `${n ? Math.round((sh / n) * 100) : 0}%`}`);
        L.el.classList.toggle("dark", ldivMode === "count" && n >= 121);
      }
    } else {
      neutralCountries(false);
      gLangPts.style.display = "";
      paintPoints(lextMode);
    }
    $$("[data-ldiv]").forEach(b => b.setAttribute("aria-pressed", b.dataset.ldiv === ldivMode));
    $$("[data-lext]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lext === lextMode));
    $("#ldivNote").textContent = {
      count: tx("Nombre de llengües vives que es parlen a cada estat, segons Glottolog. Nigèria, el Camerun i la RD del Congo són dels estats lingüísticament més diversos del món."),
      shared: tx("Percentatge de les llengües de cada estat que també es parlen en algun altre estat africà: una mesura de com les fronteres travessen comunitats lingüístiques."),
      family: tx("Proporció de llengües de cada família a cada estat (franges proporcionals). Allà on hi ha diverses franges conviuen famílies lingüístiques diferents.")
    }[ldivMode];
    renderLegend();
    zoomHooks.forEach(fn => fn(ppu()));
    scheduleLabels();
  }
  $$("[data-ldiv]").forEach(b => b.onclick = () => { ldivMode = b.dataset.ldiv; renderLangMap(); });
  $$("[data-lext]").forEach(b => b.onclick = () => { lextMode = b.dataset.lext; renderLangMap(); });

  // ---------------------------------------------------------------- Llengües oficials
  const CAT_ORDER = Object.keys(LI.CATS);
  const patCache = {};
  function langFill(rows) {
    const cats = [...new Set(rows.map(r => r[1]))].sort((a, b) => CAT_ORDER.indexOf(a) - CAT_ORDER.indexOf(b));
    if (cats.length === 1) return LI.CATS[cats[0]].color;
    const id = `lp-${cats.join("-")}`;
    if (!patCache[id]) {
      const w = 5, pat = el("pattern", { id, width: w * cats.length, height: 10, patternUnits: "userSpaceOnUse", patternTransform: "rotate(40)" }, defs);
      cats.forEach((c, i) => el("rect", { x: i * w, y: 0, width: w, height: 10, fill: LI.CATS[c].color }, pat));
      patCache[id] = `url(#${id})`;
    }
    return patCache[id];
  }
  const langLabel = rows => rows.map(r => r[0]).join(" · ");
  const roleList = rows => rows.map(r => `<li><span class="legend-swatch" style="background:${LI.CATS[r[1]].color}"></span>${esc(r[0])}${r[2] === "t" ? ` <i>${tx("(llengua de treball)")}</i>` : ""}</li>`).join("");
  function officialTip(a3) {
    const info = LI.NOW[a3];
    if (!info) return `<strong>${esc(countryName(a3))}</strong>`;
    return `<strong>${esc(countryName(a3))}</strong><ol class="tt-langs">${roleList(info.l)}</ol>${tipNotes(info.n)}`;
  }
  function official1914Tip(i) {
    const p = G.p1914[i], rows = LI.Y1914[p.n] || [];
    return `<strong>${esc((H.P1914[p.n] || [p.n])[0])}</strong><div class="tt-sub">${tx("Administració colonial cap al 1914")}</div><ol class="tt-langs">${roleList(rows)}</ol>${tipNotes(["l1914gen", ...(LI.Y1914_NOTES[p.n] || [])])}`;
  }
  const EURO = new Set(["FR", "EN", "PT", "ES"]);
  {
    const vals = Object.entries(LI.NOW);
    const withEuro = vals.filter(([, v]) => v.l.some(r => EURO.has(r[1])));
    const onlyEuro = vals.filter(([, v]) => v.l.every(r => EURO.has(r[1])));
    const noEuro = vals.filter(([, v]) => !v.l.some(r => EURO.has(r[1])));
    $("#loffEuro").textContent = withEuro.length;
    $("#loffStats").innerHTML = `<div class="meter-row"><span>${tx("Només una o més llengües europees")}</span><strong>${onlyEuro.length}</strong></div>
      <div class="meter-row"><span>${tx("Llengua europea i llengua africana o àrab")}</span><strong>${withEuro.length - onlyEuro.length}</strong></div>
      <div class="meter-row"><span>${tx("Sense llengua europea oficial")}</span><strong>${noEuro.length}</strong></div>
      <p class="note">${noEuro.map(([a3]) => esc(countryName(a3))).join(", ")}</p>`;
  }
  function renderOfficial() {
    $$("[data-loff]").forEach(b => b.setAttribute("aria-pressed", b.dataset.loff === loffMode));
    if (loffMode === "now") {
      snap.today.style.display = "";
      for (const a3 of A3) {
        const p = countryPaths[a3], info = LI.NOW[a3];
        p.classList.remove("pre");
        p.style.pointerEvents = "";
        p.style.fillOpacity = 1;
        p.setAttribute("fill", info ? langFill(info.l) : "#555");
        const L = countryLabels[a3];
        L.forceHidden = false;
        setLabelText(L, info ? langLabel(info.l) : countryName(a3));
        L.el.classList.remove("dark");
      }
      $("#loffNote").innerHTML = `${tx("Passa per sobre d'un país per veure'n les llengües oficials i de treball.")} ${noteRefs(["loff", "lsahel"])}`;
    } else {
      snap.y1914.style.display = "";
      gOverlay.style.display = "";
      G.p1914.forEach((p, i) => {
        const rows = LI.Y1914[p.n] || [];
        unitPaths[i].setAttribute("fill", rows.length ? langFill(rows) : "#555");
        setLabelText(unitLabels[i], langLabel(rows));
      });
      $("#loffNote").innerHTML = `${tx("Llengua de l'administració colonial cap al 1914, amb les fronteres d'aleshores.")} ${noteRefs(["l1914gen", "map1914"])}`;
    }
    renderLegend();
    scheduleLabels();
  }
  $$("[data-loff]").forEach(b => b.onclick = () => { loffMode = b.dataset.loff; setMode("loff"); });

  function langLegend() {
    const item = (color, label, extra = "") => `<div class="legend-item"><span class="legend-swatch" style="background:${color};${extra}"></span>${esc(label)}</div>`;
    if (mode === "loff") {
      const used = new Set();
      const src = loffMode === "now" ? Object.values(LI.NOW).flatMap(v => v.l) : Object.values(LI.Y1914).flat();
      src.forEach(r => used.add(r[1]));
      return `<div class="legend-title">${tx(loffMode === "now" ? "Llengües oficials avui" : "Llengua de l'administració, 1914")}</div>${CAT_ORDER.filter(c => used.has(c)).map(c => item(LI.CATS[c].color, LI.CATS[c].name)).join("")}${item("repeating-linear-gradient(40deg,#3d6cb3 0 4px,#c23b32 4px 8px)", tx("Ratllat: diverses llengües"))}`;
    }
    if (mode === "ldiv") {
      if (ldivMode === "count") return `<div class="legend-title">${tx("Llengües vives per estat")}${noteRefs(["lcountries"])}</div>${COUNT_STEPS.map(([min, c], i) => item(c, i === COUNT_STEPS.length - 1 ? tx("{n} o més", { n: min }) : `${min}–${COUNT_STEPS[i + 1][0] - 1}`)).join("")}`;
      if (ldivMode === "shared") return `<div class="legend-title">${tx("Llengües compartides amb altres estats")}</div>${SHARE_STEPS.map(([min, c], i) => item(c, i === SHARE_STEPS.length - 1 ? tx("{n}% o més", { n: min }) : `${min}–${SHARE_STEPS[i + 1][0]}%`)).join("")}`;
      return `<div class="legend-title">${tx("Famílies lingüístiques")}${noteRefs(["lgroups"])}</div>${Object.values(LI.GROUPS).map(g => item(g.color, g.name)).join("")}`;
    }
    if (lextMode === "extinct") return `<div class="legend-title">${tx("Llengües extingides")}</div>${Object.values(ERA).map(e => item(e.color, e.name, "border-radius:50%")).join("")}${item("transparent", tx("Quasi extingida (pocs parlants)"), "border:1.5px solid #ff5a45;border-radius:50%")}`;
    return `<div class="legend-title">${tx("Vitalitat")}${noteRefs(["lstatus"])}</div>${[1, 2, 3, 4, 5, 6, 0].map(k => item(LI.AES[k].color, LI.AES[k].name, "border-radius:50%")).join("")}`;
  }

  // ================================================================ Modes
  let mode = "timeline";
  function setMode(m) {
    mode = m;
    stop();
    $$(".tabs [role=tab]").forEach(b => b.setAttribute("aria-selected", b.dataset.mode === m));
    $$(".panel-mode").forEach(p => { p.hidden = p.dataset.panel !== m; });
    $("#swipe").hidden = m !== "compare";
    $("#yearBadge").hidden = m !== "timeline";
    for (const g of Object.values(snap)) { g.removeAttribute("clip-path"); g.style.display = "none"; }
    for (const g of [l1880, l1914, lPeoples, lCountriesG]) g.style.display = "";
    gFuture.style.display = m === "timeline" ? "" : "none";
    gOverlay.style.display = "none";
    gOverlay1914.style.display = "none";
    gCities.style.display = "none";
    gHL.replaceChildren();
    stage.insertBefore(snap.y1880, gLangHex);
    stage.insertBefore(snap.today, gLangHex);
    for (const L of polityLabels) L.forceHidden = false;
    restore1914();
    gLangHex.style.display = "none";
    gLangPts.style.display = "none";
    hideTip();
    if (m === "timeline") {
      snap.y1880.style.display = "";
      snap.today.style.display = "";
      shownEvent = null;
      setYear(year);
    } else if (m === "compare") {
      renderCompare();
    } else if (m === "peoples") {
      snap.peoples.style.display = "";
      renderPeoples();
      if (!selectedPeople) clearPeople(); else selectPeople(selectedPeople.idx, selectedPeople.story, false);
    } else if (m === "names") {
      snap.today.style.display = "";
      renderNames();
    } else if (m === "ldiv" || m === "lext") {
      renderLangMap();
    } else if (m === "loff") {
      renderOfficial();
    }
    renderLegend();
    scheduleLabels();
  }
  $$(".tabs [role=tab]").forEach(b => b.onclick = () => {
    setMode(b.dataset.mode);
    const bar = b.parentElement; // al mòbil la barra es desplaça: centra la pestanya triada
    bar.scrollLeft = b.offsetLeft - (bar.clientWidth - b.offsetWidth) / 2;
  });

  // Llista completa de notes i referències estàtiques de l'HTML
  $("#notesList").innerHTML = NOTE_IDS.map((id, i) => `<li id="nota-${i + 1}" value="${i + 1}">${H.NOTES[id]}</li>`).join("");
  $$("[data-nref]").forEach(e => { e.innerHTML = noteRefs([e.dataset.nref]); });

  setMode("timeline");
  setYear(START);
})();
