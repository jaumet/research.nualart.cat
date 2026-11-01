/*
 * Traducció de la interfície.
 * El codi escriu els textos en català dins de tx("…"). Una pàgina en una altra llengua carrega
 * abans un diccionari window.I18N (text català → text traduït); si un text no hi és, es mostra
 * en català. Les variables s'escriuen {nom}: tx("Partit entre {n} estats", { n: 3 }).
 */
window.LANG = document.documentElement.lang || "ca";
window.tx = (s, vars) => {
  let out = (window.I18N && window.I18N[s]) || s;
  if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return out;
};
