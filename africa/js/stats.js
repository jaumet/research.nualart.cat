/*
 * Estadístiques de visites amb GoatCounter (goatcounter.com): anònimes, sense galetes.
 * Compta la visita i mostra el total de visites de l'atles al peu de pàgina (#visitCount).
 * Mentre CODE sigui buit no fa res. GoatCounter no compta les visites des de localhost.
 * Perquè es vegi el total cal activar al compte «Allow adding visitor counts on your website».
 */
(function () {
  var CODE = "jaumetet"; // codi del compte: https://CODE.goatcounter.com
  var PATHS = ["/africa/", "/africa/index.html", "/africa/detallada.html", "/africa/en/", "/africa/en/index.html", "/africa/en/detailed.html"];
  if (!CODE) return;
  var base = "https://" + CODE + ".goatcounter.com";
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", base + "/count");
  document.head.appendChild(s);

  var out = document.getElementById("visitCount");
  if (!out || !window.fetch) return;
  var num = function (j) { return j && j.count ? +String(j.count).replace(/\D/g, "") : 0; };
  Promise.all(PATHS.map(function (p) {
    return fetch(base + "/counter/" + encodeURIComponent(p) + ".json").then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  })).then(function (res) {
    var total = res.reduce(function (a, j) { return a + num(j); }, 0);
    if (!total) return;
    out.querySelector("[data-n]").textContent = total.toLocaleString(document.documentElement.lang || "ca");
    out.hidden = false;
  });
})();
