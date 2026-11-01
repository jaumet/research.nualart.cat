/*
 * Versió per a infants i joves: un sol mapa que canvia segons el capítol que es llegeix.
 * Fa servir les mateixes dades que la versió per a adults (GEO, HISTORY, LANGINFO).
 */
(() => {
  const G = window.GEO, H = window.HISTORY, LI = window.LANGINFO, tx = window.tx, LANG = window.LANG;
  const { STORIES: KID_STORIES, MILESTONES, FLIPS, QUIZ } = window.KIDS;
  const $ = s => document.querySelector(s);
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.append(n);
    return n;
  };
  const html = (tag, attrs = {}, text) => {
    const n = document.createElement(tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  };
  const fmt = n => n.toLocaleString(LANG);
  const cname = a3 => H.COUNTRIES[a3]?.name || a3;

  // ---------------------------------------------------------------- Dades derivades
  const A3 = Object.keys(G.countries);
  const UN54 = A3.filter(a => a !== "SOL" && a !== "SAH"); // estats reconeguts per l'ONU
  function stateAt(a3, y) {
    let r = null;
    for (const row of H.COUNTRIES[a3]?.t || []) { if (row[0] <= y) r = row; else break; }
    return r || [H.START, "PRE"];
  }
  const isPartitioned = p => p.s.length > 1 && p.s[1][1] >= 10;
  const nPart = G.peoples.filter(isPartitioned).length;

  const totalArea = A3.reduce((s, a) => s + G.countries[a].a, 0);
  const col1914 = A3.reduce((s, a) => s + (H.COLONIAL.has(stateAt(a, 1914)[1]) ? G.countries[a].a : 0), 0);
  const pct1914 = Math.round((col1914 / totalArea) * 100);

  // independents: es compten noms diferents (el Sudan del Sud forma part del Sudan fins al 2011)
  function independentAt(y) {
    const names = new Set();
    for (const a of UN54) { const [, code, name] = stateAt(a, y); if (code === "IND" || code === "AF") names.add(name); }
    return names.size;
  }

  const EURO = new Set(["FR", "EN", "PT", "ES", "DE", "IT", "NL"]);
  function langCat(a3) {
    const cats = (LI.NOW[a3]?.l || []).map(r => r[1]);
    if (cats.some(c => c === "AFR" || c === "CR")) return "afr";
    if (cats.includes("AR")) return "ar";
    return "euro";
  }
  const nEuroOnly = UN54.filter(a => langCat(a) === "euro").length;

  $("#nPeoples").textContent = fmt(G.peoples.length);
  $("#nPeoples2").textContent = fmt(G.peoples.length);
  $("#nPart").textContent = fmt(nPart);
  $("#pct1914").textContent = `${pct1914}%`;
  $("#meter1914").style.setProperty("--w", `${pct1914}%`);
  $("#nEuroOnly").textContent = nEuroOnly;

  // ---------------------------------------------------------------- Mapa
  const svg = $("#map");
  svg.setAttribute("viewBox", G.viewBox.join(" "));
  el("rect", { x: -200, y: -200, width: 1500, height: 1600, class: "sea" }, svg);
  el("path", { d: G.context, class: "context" }, svg);
  el("path", { d: G.land, class: "land" }, svg);

  const layer = name => el("g", { class: `layer layer-${name}` }, svg);
  const L = {
    p1880: layer("p1880"), peoples: layer("peoples"), p1914: layer("p1914"),
    countries: layer("countries"), borders: layer("borders"), hl: layer("hl"),
    labels: layer("labels"), draw: layer("draw")
  };

  // colors càlids per als estats africans de 1880; veïns amb colors diferents (bbox)
  const WARM = ["#e9a23b", "#d9783f", "#c9a24a", "#b8603a", "#e6c15a", "#a8744a", "#d38b5d", "#c0873a"];
  function bbox(d) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const m of d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)) {
      const x = +m[1], y = +m[2];
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    return [x0, y0, x1, y1];
  }
  const touch = (a, b, m = 3) => a[0] - m < b[2] && b[0] - m < a[2] && a[1] - m < b[3] && b[1] - m < a[3];
  function greedy(items, palette) {
    const boxes = items.map(it => bbox(it.d)), out = [];
    items.forEach((it, i) => {
      const used = new Set();
      for (let j = 0; j < i; j++) if (touch(boxes[i], boxes[j])) used.add(out[j]);
      out.push(palette.find(c => !used.has(c)) || palette[i % palette.length]);
    });
    return out;
  }

  const p1880Info = p => H.P1880[p.n] || [p.n, "AF"];
  const warm1880 = greedy(G.p1880, WARM);
  G.p1880.forEach((p, i) => {
    const [name, code] = p1880Info(p);
    const fill = code === "AF" ? warm1880[i] : H.POWERS[code].color;
    el("path", { d: p.d, fill, class: "unit", "data-tip": name }, L.p1880);
  });

  const PEOPLE_FILLS = ["#e8c27a", "#d9a35f", "#c98f5a", "#e4b37a", "#b9875a", "#dcb27a", "#c7a06a", "#e0a96a"];
  const peopleFill = greedy(G.peoples, PEOPLE_FILLS);
  const peoplePaths = G.peoples.map((p, i) => el("path", { d: p.d, fill: peopleFill[i], class: "unit people", "data-tip": p.n }, L.peoples));

  const p1914Paths = G.p1914.map(p => {
    const [name, code] = H.P1914[p.n] || [p.n, "AF"];
    return el("path", { d: p.d, fill: H.POWERS[code].color, class: "unit", "data-tip": `${name} · ${H.POWERS[code].short}`, "data-code": code }, L.p1914);
  });

  const countryPaths = {};
  for (const a of A3) {
    countryPaths[a] = el("path", { d: G.countries[a].d, class: "unit country", "data-tip": cname(a) }, L.countries);
    el("path", { d: G.countries[a].d, class: "border" }, L.borders);
  }

  function label(x, y, text, cls = "") {
    const t = el("text", { x, y, class: `lbl ${cls}` }, L.labels);
    t.textContent = text;
    return t;
  }
  const countryLabel = (a3, text, cls) => { const [x, y] = G.countries[a3].l; return label(x, y, text, cls); };
  const polityLabel = (n, text) => { const p = G.p1880.find(q => q.n === n); if (p) label(p.l[0], p.l[1], text); };
  const highlight = codes => { for (const a of codes) el("path", { d: G.countries[a].d, class: "hl" }, L.hl); };

  // ---------------------------------------------------------------- Llegendes
  const legend = $("#mapLegend");
  const sw = (c, t) => `<span><i style="background:${c}"></i>${t}</span>`;
  function setLegend(items) { legend.innerHTML = items.map(([c, t]) => sw(c, t)).join(""); legend.hidden = !items.length; }

  // ---------------------------------------------------------------- Estats del mapa
  let state = null;
  const VISIBLE = {
    "1880": ["p1880", "labels"], peoples: ["peoples"], draw: ["peoples", "draw"],
    "1914": ["p1914", "labels"], partits: ["peoples", "borders", "hl", "labels"],
    dark: ["p1914", "hl", "labels"], resist: ["p1914", "hl", "labels"],
    indep: ["countries", "labels"], langs: ["countries", "labels"]
  };
  const STATES = {
    "1880"() {
      $("#mapYear").textContent = "1880";
      polityLabel("Ethiopia", tx("Etiòpia"));
      polityLabel("Asante", "Asante");
      polityLabel("Sokoto Caliphate", "Sokoto");
      polityLabel("Kongo Kingdom", "Kongo");
      polityLabel("Zululand", tx("Zulus"));
      polityLabel("Morocco", tx("Marroc"));
      polityLabel("Lunda", "Lunda");
      polityLabel("Imerina", "Merina");
      setLegend([["#e9a23b", tx("Estats africans")], ["#3d6cb3", H.POWERS.FR.short], ["#c23b32", H.POWERS.GB.short], ["#2f8a5b", H.POWERS.PT.short], ["#a8738f", H.POWERS.OT.short], ["#efe6d2", tx("Molts pobles sense gran estat")]]);
    },
    peoples() { $("#mapYear").textContent = tx("Pobles"); setLegend([]); },
    draw() {
      $("#mapYear").textContent = "1884";
      setLegend([]);
      showHint(tx("✏️ Arrossega per traçar una línia recta"));
    },
    "1914"() {
      $("#mapYear").textContent = "1914";
      const codes = ["FR", "GB", "PT", "BE", "DE", "IT", "ES", "SET", "AF"];
      setLegend(codes.map(c => [H.POWERS[c].color, c === "AF" ? tx("Lliures") : H.POWERS[c].short]));
      countryLabel("ETH", `⭐ ${tx("Etiòpia")}`, "big");
      countryLabel("LBR", `⭐ ${tx("Libèria")}`, "big");
    },
    partits() {
      $("#mapYear").textContent = tx("Avui");
      G.peoples.forEach((p, i) => peoplePaths[i].setAttribute("fill", isPartitioned(p) ? "#d1493a" : "#e6dccb"));
      setLegend([["#d1493a", tx("Poble partit")], ["#e6dccb", tx("No partit")], ["#2b2118", tx("Fronteres actuals")]]);
      if (selectedStory) selectStory(selectedStory);
    },
    dark() {
      $("#mapYear").textContent = "1885–1908";
      p1914Paths.forEach(p => p.classList.add("dim"));
      highlight(["COD", "NAM"]);
      countryLabel("COD", "Congo", "big");
      countryLabel("NAM", tx("Namíbia"), "big");
      setLegend([]);
    },
    resist() {
      $("#mapYear").textContent = "1880–1905";
      p1914Paths.forEach(p => p.classList.add("dim"));
      highlight(["ETH", "GIN", "GHA", "TZA"]);
      countryLabel("ETH", "⚔️ Adwa", "big");
      countryLabel("GIN", "🐎 Samori", "big");
      countryLabel("GHA", "👑 Asante", "big");
      countryLabel("TZA", "💧 Maji Maji", "big");
      setLegend([]);
    },
    indep() { paintIndep(indepYear); setLegend([["#e3b23c", tx("Independent")], ["#9fb3c8", tx("Colònia")], ["#7d1d3f", tx("Minoria blanca")], ["#9aa66a", tx("Ocupat per un veí")]]); },
    langs() {
      $("#mapYear").textContent = tx("Avui");
      const C = { euro: "#3d6cb3", afr: "#e3b23c", ar: "#a8738f" };
      for (const a of A3) {
        const c = langCat(a);
        countryPaths[a].setAttribute("fill", C[c]);
        countryPaths[a].dataset.tip = `${cname(a)}: ${(LI.NOW[a]?.l || []).map(r => r[0]).join(", ")}`;
      }
      setLegend([["#3d6cb3", tx("Només llengües europees")], ["#e3b23c", tx("També llengües africanes")], ["#a8738f", tx("Àrab (sense cap altra llengua africana)")]]);
    }
  };

  function showHint(text) { const h = $("#mapHint"); h.textContent = text; h.hidden = false; }
  function setState(name) {
    if (name === state) return;
    state = name;
    stopIndep();
    L.labels.replaceChildren();
    L.hl.replaceChildren();
    p1914Paths.forEach(p => p.classList.remove("dim"));
    peoplePaths.forEach((p, i) => { p.setAttribute("fill", peopleFill[i]); p.classList.remove("cut", "sel"); });
    for (const a of A3) countryPaths[a].dataset.tip = cname(a);
    $("#mapHint").hidden = true;
    for (const k in L) L[k].style.display = VISIBLE[name].includes(k) ? "" : "none";
    svg.classList.toggle("drawing", name === "draw");
    hideTip();
    STATES[name]();
    if (name === "draw" && lastLine) redrawCut();
  }

  // ---------------------------------------------------------------- Rètol emergent
  const tip = $("#tip"), box = $("#mapBox");
  function hideTip() { tip.hidden = true; }
  function showTipAt(e, text) {
    const r = box.getBoundingClientRect();
    tip.textContent = text;
    tip.hidden = false;
    const x = Math.min(e.clientX - r.left + 12, r.width - tip.offsetWidth - 6);
    tip.style.left = `${Math.max(6, x)}px`;
    tip.style.top = `${Math.max(6, e.clientY - r.top - tip.offsetHeight - 10)}px`;
  }
  svg.addEventListener("pointermove", e => {
    if (state === "draw") return;
    const t = e.target.dataset?.tip;
    t ? showTipAt(e, t) : hideTip();
  });
  svg.addEventListener("pointerleave", hideTip);

  // ---------------------------------------------------------------- Joc: traça una frontera
  const rings = G.peoples.map(p => p.d.split("M").filter(Boolean).map(r => r.replace(/Z/g, "").split("L").map(q => q.split(",").map(Number))));
  const pBoxes = G.peoples.map(p => bbox(p.d));
  const cross = (ax, ay, bx, by, cx, cy, dx, dy) => {
    const d1 = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax), d2 = (bx - ax) * (dy - ay) - (by - ay) * (dx - ax);
    const d3 = (dx - cx) * (ay - cy) - (dy - cy) * (ax - cx), d4 = (dx - cx) * (by - cy) - (dy - cy) * (bx - cx);
    return (d1 > 0) !== (d2 > 0) && (d3 > 0) !== (d4 > 0);
  };
  function cutPeoples([ax, ay], [bx, by]) {
    const lb = [Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by)], hits = [];
    G.peoples.forEach((p, i) => {
      if (!touch(lb, pBoxes[i], 0)) return;
      for (const ring of rings[i]) for (let k = 1; k < ring.length; k++) {
        if (cross(ax, ay, bx, by, ring[k - 1][0], ring[k - 1][1], ring[k][0], ring[k][1])) { hits.push(i); return; }
      }
    });
    return hits;
  }
  const toSvg = e => { const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse()); return [pt.x, pt.y]; };
  let start = null, line = null, lastLine = null, pending = false;
  function paintCut(a, b, final) {
    const hits = cutPeoples(a, b), set = new Set(hits);
    peoplePaths.forEach((p, i) => p.classList.toggle("cut", set.has(i)));
    if (!final) return;
    const res = $("#drawResult");
    if (!hits.length) { res.innerHTML = tx("La teva línia no ha tallat cap poble. Prova-ho amb una línia més llarga! 📏"); return; }
    const names = hits.map(i => G.peoples[i].n).sort((x, y) => x.localeCompare(y, LANG));
    const shown = names.slice(0, 6).join(", ") + (names.length > 6 ? tx(" i {n} més", { n: names.length - 6 }) : "");
    res.innerHTML = `${tx(hits.length === 1 ? "<b>Has partit {n} poble</b> en dos: {list}." : "<b>Has partit {n} pobles</b> en dos: {list}.", { n: hits.length, list: shown })}<br>${tx("Cap d'ells no t'ha demanat permís. Així es van traçar moltes fronteres de veritat.")} <span aria-hidden="true">😟</span>`;
    $("#drawClear").hidden = false;
  }
  function redrawCut() { paintCut(lastLine[0], lastLine[1], false); }
  svg.addEventListener("pointerdown", e => {
    if (state !== "draw") return;
    e.preventDefault();
    try { svg.setPointerCapture(e.pointerId); } catch {}
    start = toSvg(e);
    L.draw.replaceChildren();
    line = el("line", { x1: start[0], y1: start[1], x2: start[0], y2: start[1], class: "cutline" }, L.draw);
    el("circle", { cx: start[0], cy: start[1], r: 7, class: "cutdot" }, L.draw);
    $("#mapHint").hidden = true;
  });
  svg.addEventListener("pointermove", e => {
    if (!start || state !== "draw") return;
    const p = toSvg(e);
    line.setAttribute("x2", p[0]); line.setAttribute("y2", p[1]);
    if (!pending) { pending = true; setTimeout(() => { pending = false; if (start) paintCut(start, [+line.getAttribute("x2"), +line.getAttribute("y2")], false); }, 40); }
  });
  const endDraw = e => {
    if (!start) return;
    const end = toSvg(e);
    if (Math.hypot(end[0] - start[0], end[1] - start[1]) < 15) { L.draw.replaceChildren(); start = null; return; }
    el("circle", { cx: end[0], cy: end[1], r: 7, class: "cutdot" }, L.draw);
    lastLine = [start, end];
    paintCut(start, end, true);
    start = null;
  };
  svg.addEventListener("pointerup", endDraw);
  svg.addEventListener("pointercancel", () => { start = null; });
  $("#drawClear").onclick = () => {
    L.draw.replaceChildren(); lastLine = null;
    peoplePaths.forEach(p => p.classList.remove("cut"));
    $("#drawResult").innerHTML = `${tx("Esperant la teva línia…")} <span aria-hidden="true">📏</span>`;
    $("#drawClear").hidden = true;
    showHint(tx("✏️ Arrossega per traçar una línia recta"));
  };

  // ---------------------------------------------------------------- Pobles partits
  const storyBtns = $("#storyBtns");
  let selectedStory = null;
  function selectStory(s) {
    selectedStory = s;
    storyBtns.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.id === s.id));
    const idx = G.peoples.map((p, i) => [p, i]).filter(([p]) => (s.g ? p.g === s.id : p.n === s.id)).map(([, i]) => i);
    const countries = new Map();
    idx.forEach(i => G.peoples[i].s.forEach(([a, pct]) => countries.set(a, (countries.get(a) || 0) + pct * G.peoples[i].a)));
    const list = [...countries].filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([a]) => cname(a));
    $("#storyCard").innerHTML = `<h3><span aria-hidden="true">${s.ico}</span> ${s.label}</h3><p>${s.d}</p><p class="small">${tx("Al mapa, en vermell fosc. Països on viuen segons el mapa:")} ${list.join(", ")}.</p>`;
    if (state !== "partits") return;
    peoplePaths.forEach(p => p.classList.remove("sel"));
    idx.forEach(i => peoplePaths[i].classList.add("sel"));
    L.labels.replaceChildren();
    const big = idx.reduce((b, i) => (G.peoples[i].a > (b == null ? 0 : G.peoples[b].a) ? i : b), null);
    if (big != null) label(G.peoples[big].l[0], G.peoples[big].l[1], `${s.ico} ${s.label}`, "big");
  }
  KID_STORIES.forEach(s => {
    const b = html("button", { type: "button", "data-id": s.id, "aria-pressed": "false" });
    b.innerHTML = `<span aria-hidden="true">${s.ico}</span> ${s.label}`;
    b.onclick = () => selectStory(s);
    storyBtns.append(b);
  });

  // ---------------------------------------------------------------- Independències
  const IND_COLORS = { IND: "#e3b23c", AF: "#e3b23c", SET: "#7d1d3f", OCC: "#9aa66a", OT: "#a8738f", PRE: "#9fb3c8" };
  let indepYear = 1950, timer = null;
  const slider = $("#indepSlider");
  function paintIndep(y) {
    indepYear = y;
    slider.value = y;
    $("#indepYear").textContent = y;
    $("#indepCount").textContent = independentAt(y);
    let m = MILESTONES[0];
    for (const row of MILESTONES) if (row[0] <= y) m = row;
    $("#indepCaption").textContent = m[1];
    if (state !== "indep") return;
    $("#mapYear").textContent = y;
    for (const a of A3) {
      const [, code, name] = stateAt(a, y);
      countryPaths[a].setAttribute("fill", IND_COLORS[code] || "#9fb3c8");
      countryPaths[a].dataset.tip = name || cname(a);
    }
  }
  function stopIndep() { clearTimeout(timer); timer = null; $("#playIndep").textContent = tx("▶ Reprodueix"); }
  function stepIndep() {
    if (indepYear >= 2011) { stopIndep(); return; }
    paintIndep(indepYear + 1);
    timer = setTimeout(stepIndep, [1957, 1960, 1975, 1994].includes(indepYear) ? 1400 : 260);
  }
  $("#playIndep").onclick = () => {
    if (timer) { stopIndep(); return; }
    if (state !== "indep") $("#cap8").scrollIntoView({ behavior: "smooth", block: "center" });
    if (indepYear >= 2011) paintIndep(1950);
    $("#playIndep").textContent = tx("⏸ Pausa");
    timer = setTimeout(stepIndep, 300);
  };
  slider.oninput = () => { stopIndep(); paintIndep(+slider.value); };
  paintIndep(1950);

  // ---------------------------------------------------------------- Capítols i desplaçament
  const chapters = [...document.querySelectorAll(".chap")];
  // el capítol actiu és l'últim que ha passat la línia de lectura (en mòbil, una mica sota el mapa enganxat)
  function readingLine() {
    if (innerWidth >= 900) return innerHeight * 0.5;
    const mapBottom = $(".map-col").getBoundingClientRect().bottom;
    return mapBottom + (innerHeight - mapBottom) * 0.35;
  }
  function updateChapter() {
    const line = readingLine();
    let cur = chapters[0];
    for (const c of chapters) if (c.getBoundingClientRect().top < line) cur = c;
    chapters.forEach(c => c.classList.toggle("active", c === cur));
    setState(cur.dataset.map);
  }

  const bar = $("#progressBar");
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = `${(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100}%`;
    updateChapter();
  };
  addEventListener("resize", updateChapter);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------------------------------------------------------------- Targetes de noms
  const flips = $("#flips");
  FLIPS.forEach(f => {
    const b = html("button", { type: "button", class: "flip", "aria-pressed": "false", "aria-label": tx("Abans: {old}. Gira per veure el nom d'ara.", f) });
    b.innerHTML = `<span class="flip-in"><span class="face front"><span class="ico" aria-hidden="true">${f.ico}</span><small>${tx("Abans es deia")}</small><b>${f.old}</b><span class="turn" aria-hidden="true">${tx("↻ gira")}</span></span><span class="face back"><small>${tx("Des de {y}", f)}</small><b>${f.now}</b><span>${f.why}</span></span></span>`;
    b.onclick = () => {
      const on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", on);
      b.setAttribute("aria-label", tx(on ? "Ara: {now}, des de {y}. {why}" : "Abans: {old}. Gira per veure el nom d'ara.", f));
    };
    flips.append(b);
  });

  // ---------------------------------------------------------------- Repte
  const quiz = $("#quiz");
  let score = 0, answered = 0;
  function buildQuiz() {
    quiz.replaceChildren(); score = 0; answered = 0; $("#quizEnd").hidden = true;
    QUIZ.forEach((item, qi) => {
      const box = html("fieldset", { class: "qz" });
      box.append(html("legend", {}, `${qi + 1}. ${item.q}`));
      const opts = html("div", { class: "qz-opts" }), fb = html("p", { class: "qz-fb", "aria-live": "polite" });
      item.a.forEach((txt, ai) => {
        const b = html("button", { type: "button" }, txt);
        b.onclick = () => {
          if (box.classList.contains("done")) return;
          box.classList.add("done");
          const right = ai === item.ok;
          if (right) score++;
          b.classList.add(right ? "ok" : "ko");
          opts.children[item.ok].classList.add("ok");
          fb.innerHTML = `${right ? tx("✅ Molt bé!") : tx("❌ No ben bé.")} ${item.why}`;
          if (++answered === QUIZ.length) finish();
        };
        opts.append(b);
      });
      box.append(opts, fb);
      quiz.append(box);
    });
  }
  function finish() {
    const medal = score === QUIZ.length ? "🏆" : score >= 4 ? "🏅" : "🌱";
    $("#quizScore").innerHTML = `${medal} ${tx("Has encertat <b>{n} de {total}</b>!", { n: score, total: QUIZ.length })}`;
    $("#quizEnd").hidden = false;
  }
  $("#quizAgain").onclick = buildQuiz;
  buildQuiz();
})();
