"""Quick PNG preview of an era (for checking the build by eye): python3 preview.py 1909 out.png"""
import sys
import colorsys

from PIL import Image, ImageDraw

import geo


W = 1100


def render(units, out, extra=()):
    fb = geo.project(geo.FRAME).bounds
    s = W / (fb[2] - fb[0])
    H = int((fb[3] - fb[1]) * s)
    im = Image.new("RGB", (W, H), (214, 236, 242))
    d = ImageDraw.Draw(im)
    T = lambda x, y: ((x - fb[0]) * s, (y - fb[1]) * s)
    for a3 in geo.CONTEXT:
        if a3 in geo.countries():
            for p in geo.polys(geo.project(geo.country(a3))):
                d.polygon([T(*c) for c in p.exterior.coords], fill=(227, 220, 203), outline=(180, 170, 150))
    for i, u in enumerate(units):
        h = (i * 0.618) % 1
        col = tuple(int(255 * v) for v in colorsys.hsv_to_rgb(h, 0.35, 0.95))
        m = Image.new("L", im.size, 0)
        md = ImageDraw.Draw(m)
        ps = geo.polys(geo.project(u["g"]))
        for p in ps:
            md.polygon([T(*c) for c in p.exterior.coords], fill=255)
            for r in p.interiors:
                md.polygon([T(*c) for c in r.coords], fill=0)
        im.paste(col, mask=m)
        for p in ps:
            for r in [p.exterior, *p.interiors]:
                d.line([T(*c) for c in r.coords], fill=(60, 50, 40), width=1)
    for u in units:
        g = geo.project(u["g"])
        if g.is_empty:
            continue
        big = max(geo.polys(g), key=lambda p: p.area)
        pt = big.representative_point()
        d.text(T(pt.x, pt.y), u["name"][:22], fill=(0, 0, 0), anchor="mm")
    for lon, lat, name in extra:
        x, y = geo.laea(lon, lat)
        x, y = T(float(x), float(y))
        d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=(200, 0, 0))
        d.text((x + 5, y), name, fill=(120, 0, 0))
    im.save(out)


if __name__ == "__main__":
    import eras
    era = eras.ERAS[sys.argv[1]]()
    render(era["units"], sys.argv[2], [(p["lon"], p["lat"], p["name"]) for p in era.get("points", [])])
