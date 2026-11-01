#!/usr/bin/env node
/*
 * Comprova que les traduccions tenen la mateixa estructura que l'original català:
 * mateixes claus, anys, poders, notes i respostes. Llista també els textos de la interfície
 * (tx("…") a js/app.js i js/infants.js) que falten al diccionari de cada llengua.
 *
 *   node build/check_i18n.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ROOT = path.join(__dirname, "..");
const LANGS = ["en"];

function load(files) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
  return ctx.window;
}

// Treu els textos i deixa l'esquelet: claus, números, codis i identificadors
let CODES = new Set();
function skeleton(v, key = "") {
  if (v instanceof Set) return [...v].sort();
  if (Array.isArray(v)) return v.map(x => skeleton(x));
  if (v && typeof v === "object") return Object.fromEntries(Object.keys(v).sort().map(k => [k, skeleton(v[k], k)]));
  if (typeof v === "string") return CODES.has(v) || key === "id" ? v : "·";
  return v;
}

const problems = [];
function compare(a, b, where) {
  const sa = JSON.stringify(a), sb = JSON.stringify(b);
  if (sa === sb) return;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) { problems.push(`${where}: ${sa} ≠ ${sb}`); return; }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (!(k in a)) problems.push(`${where}.${k}: només a la traducció`);
    else if (!(k in b)) problems.push(`${where}.${k}: falta a la traducció`);
    else compare(a[k], b[k], `${where}.${k}`);
  }
}

const ca = load(["js/history.js", "js/languages.js", "js/infants-content.js"]);
CODES = new Set([...Object.keys(ca.HISTORY.NOTES), ...Object.keys(ca.HISTORY.POWERS), ...Object.keys(ca.HISTORY.COUNTRIES),
  ...Object.keys(ca.LANGINFO.CATS), ...Object.keys(ca.LANGINFO.GROUPS), ...ca.HISTORY.EVENTS.map(e => e.k), "t"]);
const uiKeys = new Set();
for (const f of ["js/app.js", "js/infants.js"]) {
  const s = fs.readFileSync(path.join(ROOT, f), "utf8");
  for (const m of s.matchAll(/tx\(((?:[^()]|\((?:[^()]|\([^()]*\))*\))*)\)/g))
    for (const q of m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)) if (/[a-zà-ú]{2}/i.test(q[1]) && !/^#|^(now|NGA)$/.test(q[1])) uiKeys.add(JSON.parse(`"${q[1]}"`));
}

for (const lang of LANGS) {
  const tr = load([`${lang}/js/history.js`, `${lang}/js/languages.js`, `${lang}/js/kids.js`, `${lang}/js/ui.js`]);
  compare(skeleton(ca.HISTORY), skeleton(tr.HISTORY), `${lang} HISTORY`);
  compare(skeleton(ca.LANGINFO), skeleton(tr.LANGINFO), `${lang} LANGINFO`);
  compare(skeleton(ca.KIDS), skeleton(tr.KIDS), `${lang} KIDS`);
  for (const k of uiKeys) if (!(k in tr.I18N)) problems.push(`${lang} I18N: falta «${k}»`);
}

if (problems.length) { console.log(problems.join("\n")); process.exit(1); }
console.log(`D'acord: ${LANGS.join(", ")} té la mateixa estructura que el català i ${uiKeys.size} textos d'interfície traduïts.`);
