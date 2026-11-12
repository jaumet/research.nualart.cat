#!/usr/bin/env python3
"""Browser tests without external network (headless Chrome or Chromium, DevTools protocol over a pipe).

At 1280 and 390 px, it checks: every chapter becomes active and draws its map, console errors, failed or
404 resources, requests to other servers (external name resolution is disabled), horizontal overflow, and
the interactive parts (nations, the 1850 game, frontier places, ruler lines, land rights places, years
slider, your place through time, name cards, quiz). With a folder as argument it also saves a screenshot of the map of each
chapter, for review by eye.

Usage: python3 tests/browser.py [browser] [screenshot folder]
"""
import base64
import http.server
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
from functools import partial
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CANDIDATES = ["google-chrome", "google-chrome-stable", "chromium-browser", "chromium"]
fails = 0


def ok(cond, msg):
    global fails
    print(("ok   " if cond else "FAIL ") + msg)
    fails += not cond


def evaluate(c, s, expr):
    r = c.send("Runtime.evaluate", {"expression": expr, "awaitPromise": True, "returnByValue": True}, s)
    if "exceptionDetails" in r:
        raise RuntimeError(f"{expr[:60]}…: {r['exceptionDetails'].get('exception', {}).get('description')}")
    return r["result"].get("value")


class CDP:
    """Minimal DevTools protocol client over --remote-debugging-pipe (fd 3: in, fd 4: out)."""

    def __init__(self, exe):
        self.prof = tempfile.mkdtemp()
        r_in, self.w = os.pipe()
        self.r, w_out = os.pipe()

        def child():
            os.dup2(r_in, 3)
            os.dup2(w_out, 4)
        self.p = subprocess.Popen(
            [exe, "--headless=new", "--remote-debugging-pipe", "--no-first-run", "--no-default-browser-check",
             f"--user-data-dir={self.prof}", "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1",
             "--disable-background-networking", "--disable-component-update", "--disable-sync", "about:blank"],
            # close_fds=False: otherwise subprocess would close fds 3 and 4 after preexec_fn
            close_fds=False, preexec_fn=child, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        os.close(r_in)
        os.close(w_out)
        self.buf, self.n, self.events = b"", 0, []

    def _read(self):
        while b"\0" not in self.buf:
            chunk = os.read(self.r, 1 << 20)
            if not chunk:
                raise RuntimeError("the browser closed")
            self.buf += chunk
        msg, self.buf = self.buf.split(b"\0", 1)
        return json.loads(msg)

    def send(self, method, params=None, session=None):
        self.n += 1
        m = {"id": self.n, "method": method, "params": params or {}}
        if session:
            m["sessionId"] = session
        os.write(self.w, json.dumps(m).encode() + b"\0")
        while True:
            r = self._read()
            if r.get("id") == self.n:
                if "error" in r:
                    raise RuntimeError(f"{method}: {r['error']}")
                return r.get("result", {})
            self.events.append(r)

    def pump(self, seconds):
        """Let time pass while reading events."""
        end = time.time() + seconds
        while time.time() < end:
            self.send("Browser.getVersion")
            time.sleep(0.05)

    def close(self):
        try:
            self.send("Browser.close")
        except Exception:
            pass
        self.p.wait(timeout=10)
        shutil.rmtree(self.prof, ignore_errors=True)



PAGES = ["index.html"]

CHAPTERS = r"""(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  document.documentElement.style.scrollBehavior = 'auto';
  const out = [];
  for (const c of document.querySelectorAll('.chap')) {
    window.scrollTo(0, c.getBoundingClientRect().top + scrollY - innerHeight * (innerWidth < 900 ? 0.55 : 0.45)); dispatchEvent(new Event('scroll'));
    await wait(80);
    const visible = [...document.querySelectorAll('#map .unit, #map .pt')].filter(n => n.getBoundingClientRect().width > 0 && getComputedStyle(n).opacity > 0.2).length;
    out.push({ id: c.id, map: c.dataset.map, active: c.classList.contains('active'), visible,
      year: document.querySelector('#mapYear').textContent, legend: document.querySelector('#mapLegend').textContent.length,
      nan: document.querySelector('#map').innerHTML.includes('NaN') });
  }
  return out;
})()"""

CHECKS = r"""(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const go = sel => { const el = document.querySelector(sel); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * (innerWidth < 900 ? 0.55 : 0.45)); dispatchEvent(new Event('scroll')); };
  const out = {};
  out.overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  go('#cap1'); await wait(50);
  document.querySelectorAll('#countryChips button')[4].click(); await wait(30);
  out.country = document.querySelector('#countryCard').textContent;
  out.countryOn = document.querySelectorAll('.layer-points .pt.on').length;
  go('#cap2'); await wait(50);
  out.claim = document.querySelectorAll('.layer-lines .claim-line').length;
  go('#cap4'); await wait(50);
  const rows = [...document.querySelectorAll('.guess-row')];
  rows.forEach(r => r.querySelectorAll('button')[0].click());
  out.guessDone = rows.filter(r => r.querySelector('.fb').textContent.length > 10).length;
  out.guessRows = rows.length;
  out.guessOk = rows.filter(r => r.querySelector('button.ok')).map(r => r.querySelector('b').textContent).join(',');
  out.hl = document.querySelectorAll('.layer-hl path').length;
  go('#cap5'); await wait(50);
  document.querySelectorAll('#frontierChips button')[4].click(); await wait(30);
  out.frontier = document.querySelector('#frontierCard').textContent;
  go('#cap6'); await wait(50);
  document.querySelector('#rulerChips button[data-k="129E"]').click(); await wait(30);
  out.ruler = document.querySelectorAll('.layer-lines .ruler-line').length + '/' + document.querySelectorAll('.layer-lines .ruler-line.on').length;
  out.rulerCard = document.querySelector('#rulerCard').textContent;
  go('#cap9'); await wait(50);
  document.querySelectorAll('#rightsChips button')[4].click(); await wait(30);
  out.rights = document.querySelector('#rightsCard').textContent;
  go('#cap10'); await wait(50);
  const sl = document.querySelector('#yearSlider');
  const at = async y => { sl.value = y; sl.dispatchEvent(new Event('input')); await wait(30); return document.querySelector('#yearCount').textContent; };
  out.years = [await at(1788), await at(1836), await at(1850), await at(1863), await at(1901), await at(1911), await at(1930), await at(2026)];
  out.mapYear = document.querySelector('#mapYear').textContent;
  const sel = document.querySelector('#placeSel'); sel.value = 'Melbourne'; sel.dispatchEvent(new Event('change'));
  out.placeRows = [...document.querySelectorAll('#placeTable tbody tr')].map(r => r.textContent);
  document.querySelectorAll('.flip')[4].click();
  out.flip = document.querySelectorAll('.flip')[4].getAttribute('aria-label');
  for (const fs of document.querySelectorAll('.qz')) fs.querySelector('button').click();
  out.quizEnd = !document.querySelector('#quizEnd').hidden;
  out.tables = [...document.querySelectorAll('.map-table table')].map(t => t.rows.length);
  out.overflowEnd = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  return out;
})()"""


def main():
    args = sys.argv[1:]
    exe = next((x for x in [a for a in args[:1] if shutil.which(a)] + CANDIDATES if shutil.which(x)), None)
    shots = Path(args[-1]) if args and not shutil.which(args[-1]) else None
    if not exe:
        print("No Chrome or Chromium found: browser tests skipped")
        return 2

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), partial(Quiet, directory=str(ROOT)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_address[1]}/"
    c = CDP(exe)
    try:
        for page, width, height in [(p, w, h) for p in PAGES for (w, h) in [(1280, 900), (390, 844)]]:
            tid = c.send("Target.createTarget", {"url": "about:blank"})["targetId"]
            s = c.send("Target.attachToTarget", {"targetId": tid, "flatten": True})["sessionId"]
            for d in ("Runtime", "Network", "Log", "Page"):
                c.send(f"{d}.enable", {}, s)
            c.send("Emulation.setDeviceMetricsOverride", {"width": width, "height": height, "deviceScaleFactor": 1, "mobile": width < 500}, s)
            c.events.clear()
            c.send("Page.navigate", {"url": base + page}, s)
            c.pump(2.5)
            lang = "en"
            tag = f"{page} {width}px"
            chaps = evaluate(c, s, CHAPTERS)
            ok(all(x["active"] for x in chaps), f"{tag}: each of {len(chaps)} chapters becomes active when scrolled to")
            empty = [x["id"] for x in chaps if x["visible"] < 5]
            ok(not empty, f"{tag}: every chapter draws a map" + (f" ({empty})" if empty else ""))
            ok(all(x["year"] for x in chaps), f"{tag}: every chapter shows its date on the map")
            ok(not any(x["nan"] for x in chaps), f"{tag}: no NaN in the map")
            if shots:
                shots.mkdir(parents=True, exist_ok=True)
                for x in chaps:
                    evaluate(c, s, f"(async () => {{ const el = document.getElementById('{x['id']}'); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * (innerWidth < 900 ? 0.55 : 0.45)); dispatchEvent(new Event('scroll')); await new Promise(r => setTimeout(r, 900)); }})()")
                    if width < 900:
                        img = c.send("Page.captureScreenshot", {"format": "png"}, s)
                    else:
                        rect = evaluate(c, s, "(() => { const r = document.querySelector('#mapBox').getBoundingClientRect(); return [r.x + scrollX, r.y + scrollY, r.width, r.height]; })()")
                        img = c.send("Page.captureScreenshot", {"format": "png", "clip": {"x": rect[0], "y": rect[1], "width": rect[2], "height": rect[3], "scale": 1}}, s)
                    (shots / f"{lang}-{width}-{x['id']}-{x['map']}.png").write_bytes(base64.b64decode(img["data"]))
            res = evaluate(c, s, CHECKS)
            ok(res["overflow"] <= 0 and res["overflowEnd"] <= 0, f"{tag}: no horizontal scroll ({res['overflow']}, {res['overflowEnd']})")
            ok("Kaurna" in res["country"] and res["countryOn"] == 1, f"{tag}: nations chips show a card and a dot ({res['country'][:30]})")
            ok(res["claim"] == 1, f"{tag}: the 135° East line is drawn in 1788")
            ok(res["guessDone"] == res["guessRows"] == 8 and res["hl"] > 0, f"{tag}: 1850 game answers all 8 places and highlights the colony ({res['guessDone']}, {res['hl']})")
            ok(set(res["guessOk"].split(",")) == {"Melbourne", "Brisbane", "Alice Springs", "Darwin"}, f"{tag}: in 1850 these were in New South Wales ({res['guessOk']})")
            ok("1838" in res["frontier"], f"{tag}: frontier places ({res['frontier'][:30]})")
            ok(res["ruler"] == "6/1" and "km" in res["rulerCard"], f"{tag}: ruler lines are drawn and one lights up ({res['ruler']})")
            ok("1992" in res["rights"], f"{tag}: land rights places ({res['rights'][:30]})")
            want = ["1 British colonies", "4 British colonies", "4 British colonies", "6 British colonies", "6 states and 0 territories",
                    "6 states and 2 territories", "6 states and 3 territories", "6 states and 3 territories"]
            ok(res["years"] == want, f"{tag}: slider counts colonies, states and territories ({res['years']})")
            ok(res["mapYear"] == "2026", f"{tag}: slider changes the map year")
            ok(len(res["placeRows"]) == 9 and "New South Wales" in res["placeRows"][3] and "Victoria" in res["placeRows"][4],
               f"{tag}: your place through time ({res['placeRows'][3:5] if len(res['placeRows']) > 4 else res['placeRows']})")
            ok(res["flip"].startswith("Now: Uluru"), f"{tag}: name cards flip ({res['flip'][:20]})")
            ok(res["quizEnd"], f"{tag}: quiz shows the score at the end")
            ok(all(n > 2 for n in res["tables"]) and len(res["tables"]) == 7, f"{tag}: every map has a table version ({res['tables']})")
            ev = [e for e in c.events if e.get("sessionId") == s]
            errors = [e["params"]["exceptionDetails"].get("exception", {}).get("description", "") for e in ev if e.get("method") == "Runtime.exceptionThrown"]
            errors += [str(e["params"]["args"][0].get("value")) for e in ev if e.get("method") == "Runtime.consoleAPICalled" and e["params"]["type"] == "error"]
            errors += [e["params"]["entry"]["text"] for e in ev if e.get("method") == "Log.entryAdded" and e["params"]["entry"]["level"] == "error"]
            ok(not errors, f"{tag}: no console errors" + (f" ({errors[:3]})" if errors else ""))
            reqs = {e["params"]["requestId"]: e["params"]["request"]["url"] for e in ev if e.get("method") == "Network.requestWillBeSent"}
            bad = [e["params"]["response"]["url"] for e in ev if e.get("method") == "Network.responseReceived" and e["params"]["response"]["status"] >= 400]
            bad += [reqs.get(e["params"]["requestId"], "?") for e in ev if e.get("method") == "Network.loadingFailed"]
            ok(not bad, f"{tag}: no failed or 404 resources" + (f" ({bad[:3]})" if bad else ""))
            ext = [u for u in reqs.values() if not u.startswith((base, "data:", "blob:"))]
            ok(not ext, f"{tag}: no requests to other servers (works offline)" + (f" ({ext[:3]})" if ext else ""))
            c.send("Target.closeTarget", {"targetId": tid})
    finally:
        c.close()
        srv.shutdown()
    print(f"\n{'ALL OK' if not fails else f'{fails} FAILED'}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
