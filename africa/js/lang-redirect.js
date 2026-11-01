/*
 * Tria la llengua en obrir la pàgina.
 * Si la llengua principal del navegador és català, castellà, portuguès, italià o francès, es mostra
 * la versió catalana; si no, l'anglesa. Si la persona ha triat una llengua a la barra de dalt,
 * es respecta aquesta tria (es desa al navegador).
 * La pàgina equivalent en cada llengua surt de les etiquetes <link rel="alternate" hreflang="…">.
 * Es carrega al <head>, abans dels estils, perquè la redirecció es faci sense que es vegi la pàgina.
 */
(() => {
  const ROMANCE = ["ca", "es", "pt", "it", "fr"];
  const KEY = "africa-esquarterada-lang";
  const here = document.documentElement.lang;
  let chosen = null;
  try { chosen = localStorage.getItem(KEY); } catch {}
  const browser = (navigator.languages?.[0] || navigator.language || "").slice(0, 2).toLowerCase();
  const want = chosen || (ROMANCE.includes(browser) ? "ca" : "en");
  if (want !== here) {
    const alt = document.querySelector(`link[rel="alternate"][hreflang="${want}"]`);
    if (alt) { location.replace(alt.href + location.hash); return; }
  }
  // en triar una llengua a la barra de dalt, es recorda
  document.addEventListener("click", e => {
    const a = e.target.closest?.(".vs-langs a[hreflang]");
    if (a) try { localStorage.setItem(KEY, a.hreflang); } catch {}
  });
})();
