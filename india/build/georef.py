"""Colour areas read from two old printed maps (public domain), georeferenced by hand.

  ref/gazetteer_1909.jpg  Imperial Gazetteer Atlas of India (1909), plate 20, "Political divisions of
                          the Indian Empire". Native states are printed in yellow, British India in red.
  ref/colbeck_1760.jpg    C. Colbeck, The Public Schools Historical Atlas (Longmans, 1884; 1905 edition),
                          "India in the time of Clive, 1760". Maratha states in yellow, other states in
                          green, Oudh in blue-grey, Bengal and Mysore in pink.

Control points are crossings of the printed graticule (longitude, latitude, pixel x, pixel y), read at
2x zoom. A quadratic polynomial maps longitude/latitude to pixels; the mean error is
2-3 px (about 5 km) for 1909 and 4 px (about 15 km) for 1760, where the old map itself is less exact.
The result is only used for the borders between colours: coasts and outer borders always come from
Natural Earth.
"""
import numpy as np
from PIL import Image
from shapely.geometry import box
from shapely.ops import unary_union

from geo import ROOT, clean

GCP = {
    "1909": [(64, 20, 127, 664), (68, 20, 270, 678), (72, 20, 410, 688), (64, 16, 115, 816), (68, 16, 260, 830),
             (72, 16, 402, 840), (64, 12, 102, 967), (68, 12, 249, 980), (72, 12, 395, 988), (84, 16, 835, 845),
             (88, 16, 979, 839), (92, 16, 1124, 831), (84, 12, 835, 994), (88, 12, 982, 989), (92, 12, 1130, 981),
             (96, 12, 1275, 971), (84, 32, 825, 243), (88, 32, 952, 240), (92, 32, 1085, 232), (84, 28, 831, 387),
             (88, 28, 960, 384), (92, 28, 1095, 381)],
    "1760": [(70, 20, 163, 750), (75, 20, 344, 761), (70, 15, 156, 944), (75, 15, 341, 954), (70, 10, 148, 1139),
             (75, 10, 338, 1147), (85, 15, 710, 950), (90, 15, 902, 942), (85, 10, 712, 1145), (90, 10, 905, 1137),
             (85, 20, 710, 762), (90, 20, 900, 751), (70, 35, 216, 163), (75, 35, 371, 169), (70, 30, 199, 358),
             (75, 30, 362, 364), (75, 25, 353, 559), (70, 25, 182, 554), (85, 30, 698, 371), (85, 25, 701, 567),
             (90, 30, 866, 363), (90, 25, 878, 558)],
}
IMAGE = {"1909": "gazetteer_1909.jpg", "1760": "colbeck_1760.jpg"}


def _design(a, b):
    return np.stack([np.ones_like(a), a, b, a * a, a * b, b * b], -1)


def transform(key):
    g = np.array(GCP[key], float)
    A = _design(g[:, 0] - 80, g[:, 1] - 20)
    cx = np.linalg.lstsq(A, g[:, 2], rcond=None)[0]
    cy = np.linalg.lstsq(A, g[:, 3], rcond=None)[0]
    return lambda lon, lat: (_design(lon - 80, lat - 20) @ cx, _design(lon - 80, lat - 20) @ cy)


def classify_1909(rgb):
    r, g, b = (rgb[..., i].astype(int) for i in range(3))
    out = np.zeros(r.shape, np.int8)
    out[(g - b > 38) & (g > 0.84 * r) & (r > 150)] = 1  # yellow: native states
    out[(r - g > 28) & (r > 150)] = 2  # red: British India
    out[(r - g > 14) & (r - g <= 28) & (g - b < 30) & (r > 200)] = 2  # pink: also administered by Britain
    return out


def classify_1760(rgb):
    r, g, b = (rgb[..., i].astype(int) for i in range(3))
    out = np.zeros(r.shape, np.int8)
    out[(r - b > 38) & (g - b > 26) & (r - g < 26) & (r > 170)] = 1  # yellow: Maratha states
    out[(g >= r - 4) & (g - b > 12) & (g > 120)] = 2  # green
    out[(abs(r - g) < 9) & (abs(g - b) < 10) & (r > 150) & (r < 190)] = 3  # blue-grey: Oudh
    out[(r - b > 22) & (r - b < 45) & (g - b < 22) & (r - g > 12) & (r > 195) & (r < 225)] = 4  # pink
    return out


def masks(key, step=0.025, window=9):
    """Return {class: polygon in lon/lat} for one reference map."""
    im = np.asarray(Image.open(ROOT / "ref" / IMAGE[key]).convert("RGB")).astype(np.int16)
    lons = np.arange(60.0, 100.0, step) + step / 2
    lats = np.arange(38.0, 4.0, -step) - step / 2
    LON, LAT = np.meshgrid(lons, lats)
    px, py = transform(key)(LON, LAT)
    px = np.clip(np.round(px).astype(int), 1, im.shape[1] - 2)
    py = np.clip(np.round(py).astype(int), 1, im.shape[0] - 2)
    acc = np.zeros(LON.shape + (3,), float)
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            acc += im[py + dy, px + dx]
    cls = (classify_1909 if key == "1909" else classify_1760)(acc / 9)
    ncls = int(cls.max())
    # majority filter: each cell takes the most common colour around it (removes text and lines)
    h = window // 2
    counts = []
    for c in range(1, ncls + 1):
        m = np.pad((cls == c).astype(np.int32), h)
        s = m.cumsum(0).cumsum(1)
        s = np.pad(s, ((1, 0), (1, 0)))
        n = s[window:, window:] - s[:-window, window:] - s[window:, :-window] + s[:-window, :-window]
        counts.append(n)
    counts = np.stack(counts)
    best = counts.argmax(0) + 1
    best[counts.max(0) == 0] = 0
    out = {}
    for c in range(1, ncls + 1):
        rects = []
        for i in range(best.shape[0]):
            row = best[i] == c
            if not row.any():
                continue
            d = np.diff(np.concatenate([[0], row.astype(np.int8), [0]]))
            for j0, j1 in zip(np.where(d == 1)[0], np.where(d == -1)[0]):
                rects.append(box(lons[j0] - step / 2, lats[i] - step / 2, lons[j1 - 1] + step / 2, lats[i] + step / 2))
        g = unary_union(rects).buffer(step * 0.6).buffer(-step * 0.6)
        out[c] = clean(g.simplify(step * 0.8))
    return out
