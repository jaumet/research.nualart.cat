"""The maps of each era, built from today's land with simple rules.

Each unit of an era is "a piece of today's land": an admin-1 unit, a colour area read from an old map
(georef.py), a hand-drawn polygon in longitude/latitude, or an intersection of these. Units are taken
in order and each one only keeps the land that no earlier unit has taken. Small leftovers are given to
the neighbour they share most border with.

Hand-drawn polygons are simplifications made for this atlas from the sources in README.md; they are
meant for a school map at the scale of the whole subcontinent, not for local detail.
"""
from functools import lru_cache

from shapely.ops import unary_union

import geo
from geo import adm, ctry, bbox, poly, clean, polys
import georef


@lru_cache(None)
def mask(key):
    return georef.masks(key)


class Builder:
    def __init__(self, land):
        self.rest = clean(land)
        self.units = []

    def add(self, uid, name, cat, g, info="", **kw):
        part = clean(g.intersection(self.rest))
        if part.is_empty or part.area < 1e-4:
            return None
        self.rest = clean(self.rest.difference(part))
        u = {"id": uid, "name": name, "cat": cat, "g": part, "info": info, **kw}
        self.units.append(u)
        return u

    def finish(self, min_area=0.02):
        """Give leftovers to neighbours; drop crumbs of units that are tiny pieces of a bigger unit."""
        for piece in polys(self.rest):
            if piece.area < 1e-5:
                continue
            best, score = None, 0
            grown = piece.buffer(0.02)
            for u in self.units:
                s = grown.intersection(u["g"]).area
                if s > score:
                    best, score = u, s
            if best is None:  # an island nobody claims: nearest unit
                best = min(self.units, key=lambda u: u["g"].distance(piece))
            best["g"] = clean(unary_union([best["g"], piece]))
        self.rest = clean(bbox(0, 0, 0, 0))
        # merge units that share an id (a polity made of several rules)
        merged = {}
        for u in self.units:
            if u["id"] in merged:
                m = merged[u["id"]]
                m["g"] = clean(unary_union([m["g"], u["g"]]))
            else:
                merged[u["id"]] = u
        return list(merged.values())


def lat_above(lat):
    return bbox(55, lat, 105, 40)


def lat_below(lat):
    return bbox(55, 0, 105, lat)


def lon_east(lon):
    return bbox(lon, 0, 105, 40)


def lon_west(lon):
    return bbox(55, 0, lon, 40)


def dnhdd(part):
    g = adm("Dadra and Nagar Haveli and Daman and Diu")
    if part == "diu":
        return g.intersection(lon_west(71.6))
    if part == "daman":
        return g.intersection(bbox(72.6, 20.36, 72.98, 20.6))
    return g.difference(lon_west(71.6)).difference(bbox(72.6, 20.36, 72.98, 20.6))


# Hill areas that moved from Punjab to Himachal Pradesh in 1966 (Kangra, Kullu, Lahaul and Spiti,
# Shimla hills, Una, Hamirpur). Approximate outline.
HP_1966 = poly([(75.55, 32.15), (76.0, 32.35), (76.45, 32.25), (76.7, 32.45), (76.8, 32.85), (77.4, 32.95),
                (78.4, 32.65), (78.45, 31.95), (77.9, 31.75), (77.6, 31.5), (77.25, 31.55), (77.05, 31.95),
                (76.75, 32.0), (76.6, 31.7), (76.6, 31.45), (76.3, 31.25), (75.9, 31.35), (75.55, 31.75)])


# Gilgit-Baltistan, the north-western part of Ladakh in the official map of India
GILGIT = poly([(72.4, 34.6), (73.6, 34.65), (74.1, 34.7), (75.0, 34.85), (75.9, 34.6), (76.7, 34.7), (77.3, 35.5),
               (77.8, 35.6), (77.8, 37.2), (72.4, 37.2)], soft=0)
JAMMU = poly([(73.0, 32.2), (73.0, 33.4), (74.2, 33.45), (75.0, 33.25), (75.5, 33.15), (76.0, 33.0), (76.0, 32.2)])
THANJAVUR = poly([(78.75, 10.9), (79.0, 11.25), (79.6, 11.35), (79.9, 11.1), (79.85, 10.3), (79.3, 10.1), (78.9, 10.3)])
CHOLA = poly([(78.4, 10.3), (78.3, 11.2), (78.6, 12.0), (79.3, 13.0), (80.4, 13.6), (80.6, 10.2)])

# ---------------------------------------------------------------- 250 BCE
MAURYA = poly([(61.6, 25.0), (62.6, 27.6), (63.4, 29.6), (64.2, 31.6), (65.2, 33.4), (67.6, 35.2), (69.6, 35.5),
               (71.4, 35.9), (73.4, 35.5), (75.3, 34.9), (76.0, 34.0), (77.0, 32.6), (78.5, 31.0), (80.3, 29.9),
               (82.5, 28.2), (85.0, 27.3), (87.5, 26.6), (88.9, 26.3), (89.7, 25.0), (90.0, 23.0), (89.6, 21.0),
               (88.0, 19.0), (84.0, 17.0), (81.4, 15.6), (80.2, 15.1), (78.6, 14.2), (77.2, 13.7), (75.9, 13.7),
               (74.9, 14.2), (74.3, 14.6), (70.0, 14.0), (60.0, 23.5)])
KALINGA = poly([(84.3, 21.9), (86.1, 22.4), (87.5, 21.6), (87.0, 20.3), (85.3, 19.0), (84.3, 18.1), (83.4, 17.7),
                (83.0, 18.4), (83.8, 19.6), (84.0, 21.0)])
MAGADHA = poly([(83.4, 25.2), (84.2, 26.0), (86.2, 25.9), (87.4, 25.4), (86.8, 24.3), (85.4, 24.0), (84.0, 24.3)])


def era_maurya():
    L = clean(unary_union([geo.land(), ctry("AFG")]))
    b = Builder(L)
    b.add("bactria", "Greek kingdom of Bactria", "other", ctry("AFG").intersection(lat_above(35.2)).union(
        ctry("AFG").intersection(lon_west(62.6))),
          "Greek kings ruled here after Alexander the Great. Ashoka sent messengers to Greek kings too.")
    b.add("tamraparni", "Tamraparni (Sri Lanka)", "kingdom", ctry("LKA"),
          "Named in Ashoka's edicts. Ashoka's son Mahinda is said to have taken Buddhism to the island.")
    b.add("maldives", "Maldive islands", "free", ctry("MDV"), "")
    b.add("magadha", "Magadha, the heart of the empire", "core", MAGADHA,
          "The capital, Pataliputra (today Patna), was one of the biggest cities in the world.")
    b.add("kalinga", "Kalinga (conquered in 261 BCE)", "conquered", KALINGA,
          "Ashoka's army conquered Kalinga in a terrible war. Afterwards he wrote that he felt deep sorrow.")
    b.add("maurya", "Maurya Empire", "maurya", MAURYA,
          "Ruled by Ashoka from Pataliputra. Away from the cities and the roads, many forests and hills "
          "were only loosely under the emperor's control.")
    b.add("chera", "Keralaputras (Cheras)", "kingdom", adm("Kerala", "Lakshadweep"),
          "A southern kingdom named in Ashoka's edicts as a friendly neighbour.")
    b.add("pandya", "Pandyas", "kingdom", adm("Tamil Nadu").intersection(lat_below(10.4)),
          "A southern kingdom named in Ashoka's edicts as a friendly neighbour.")
    b.add("chola", "Cholas", "kingdom", adm("Tamil Nadu", "Puducherry").intersection(CHOLA),
          "A southern kingdom named in Ashoka's edicts as a friendly neighbour.")
    b.add("south", "Southern chiefdoms (Satiyaputras?)", "free",
          adm("Tamil Nadu", "Karnataka", "Andhra Pradesh", "Kerala"),
          "Ashoka's edicts also name the Satiyaputras. Historians are not sure where they lived.")
    b.add("free", "Peoples outside the empire", "free", L,
          "Hill and forest peoples who ruled themselves. We know little about them from this time.")
    units = b.finish()
    points = [
        # [name, lon, lat, kind, script/note]
        ("Pataliputra", 85.14, 25.61, "capital", "The capital of the empire, today Patna."),
        ("Kandahar", 65.71, 31.61, "rock", "Written in Greek and Aramaic, for the people of the west."),
        ("Shahbazgarhi", 72.17, 34.22, "rock", "Written in Kharosthi script."),
        ("Mansehra", 73.20, 34.33, "rock", "Written in Kharosthi script."),
        ("Kalsi", 77.85, 30.52, "rock", "Written in Brahmi script, near the Yamuna river."),
        ("Girnar", 70.48, 21.53, "rock", "Written in Brahmi script, near Junagadh."),
        ("Sopara", 72.82, 19.42, "rock", "Written in Brahmi script, at an old port near Mumbai."),
        ("Dhauli", 85.84, 20.19, "rock", "In Kalinga, near Bhubaneswar. Here Ashoka asks his officers to treat people fairly."),
        ("Jaugada", 84.83, 19.52, "rock", "In Kalinga, in Brahmi script."),
        ("Sannati", 76.92, 16.93, "rock", "On the Bhima river, in Brahmi script."),
        ("Erragudi", 77.56, 15.22, "rock", "In Brahmi script; some lines are written right to left."),
        ("Maski", 76.65, 15.96, "minor", "This edict uses the name 'Ashoka', which helped historians identify the king."),
        ("Brahmagiri", 76.82, 14.82, "minor", "One of the southernmost edicts, in Brahmi script."),
        ("Rupnath", 80.08, 23.43, "minor", "A short edict in Brahmi script."),
        ("Sasaram", 84.03, 24.95, "minor", "A short edict in Brahmi script."),
        ("Bairat", 76.20, 27.45, "minor", "A short edict near Jaipur."),
        ("Lumbini", 83.28, 27.47, "pillar", "A pillar where the Buddha was born, today in Nepal."),
        ("Sarnath", 83.03, 25.38, "pillar", "Its lion capital is India's national emblem today."),
        ("Sanchi", 77.74, 23.48, "pillar", "Next to the great stupa of Sanchi."),
        ("Vaishali", 85.13, 25.99, "pillar", "A pillar topped by a single lion."),
        ("Lauriya Nandangarh", 84.41, 27.10, "pillar", "One of the best-kept pillars, still standing."),
        ("Topra (now in Delhi)", 77.27, 30.07, "pillar", "Moved to Delhi in the 14th century by Sultan Firuz Shah Tughlaq."),
    ]
    return {"units": units, "points": [dict(zip(("name", "lon", "lat", "kind", "note"), p)) for p in points]}


# ---------------------------------------------------------------- 1707
MARATHA_1707 = poly([(72.8, 20.25), (73.6, 20.05), (74.2, 18.6), (74.45, 17.0), (74.3, 15.8), (73.7, 15.6),
                     (73.3, 16.8), (72.85, 18.9)])
GOND = poly([(79.0, 23.4), (81.9, 23.5), (83.2, 23.9), (84.1, 23.2), (84.0, 21.9), (83.2, 20.5), (82.4, 18.9),
             (81.4, 17.8), (80.2, 18.9), (79.3, 19.6), (78.9, 21.3), (79.2, 22.3)], soft=0.3)
PASHTUN_1707 = poly([(69.3, 31.0), (69.9, 33.9), (70.9, 34.3), (71.0, 33.0), (70.6, 31.2), (69.9, 30.6)])
SOUTH_1707 = poly([(74.0, 11.6), (75.8, 11.2), (77.2, 11.2), (78.5, 11.0), (79.9, 11.0), (80.5, 11.0), (80.5, 7.5),
                   (74.0, 7.5)])


def ceylon_1700s(b, dutch="Dutch East India Company (VOC)"):
    kandy = poly([(80.25, 8.65), (80.9, 8.8), (81.25, 8.15), (81.65, 7.4), (81.6, 6.75), (81.1, 6.35),
                  (80.5, 6.55), (80.2, 7.2), (80.15, 8.0)])
    b.add("kandy", "Kingdom of Kandy", "kingdom", kandy.intersection(ctry("LKA")),
          "The kingdom in the hills of the island kept its freedom until 1815.")
    b.add("voc_lanka", f"{dutch}: coasts of Sri Lanka", "euro", ctry("LKA"),
          "The Dutch took the coasts of the island from the Portuguese between 1638 and 1658.")


def era_1707():
    afg_mughal = adm("AFG:Kabul", "AFG:Kapisa", "AFG:Parwan", "AFG:Logar", "AFG:Wardak", "AFG:Laghman",
                     "AFG:Nangarhar", "AFG:Kunar", "AFG:Paktya", "AFG:Khost", "AFG:Nuristan", "AFG:Ghazni")
    L = clean(unary_union([geo.land(), ctry("AFG")]))
    b = Builder(L)
    b.add("safavid", "Safavid Empire (Persia)", "other", ctry("AFG").difference(afg_mughal).intersection(lat_below(35.0)),
          "Kandahar changed hands between the Mughals and the Persians several times; the Persians held it from 1649.")
    b.add("bukhara", "Khanate of Bukhara", "other", ctry("AFG").difference(afg_mughal),
          "")
    ceylon_1700s(b)
    b.add("maldives", "Maldive Sultanate", "kingdom", ctry("MDV"), "")
    b.add("portuguese", "Portuguese India", "euro", adm("Goa").union(dnhdd("daman")).union(dnhdd("diu")).union(
        bbox(72.75, 19.25, 72.95, 19.5).intersection(adm("Maharashtra"))),
          "Goa, Daman, Diu and Bassein (Vasai) belonged to Portugal.")
    b.add("nepal", "Kingdoms of Nepal", "kingdom", ctry("NPL"),
          "Many small kingdoms: Kathmandu, Patan and Bhaktapur in the valley, and dozens in the hills.")
    b.add("bhutan", "Bhutan", "kingdom", ctry("BTN"), "")
    b.add("sikkim", "Sikkim", "kingdom", adm("Sikkim"), "")
    b.add("ladakh", "Ladakh (paid tribute to the Mughals)", "ally",
          adm("Ladakh").difference(GILGIT),
          "A Buddhist kingdom in the high mountains, with Leh as its capital.")
    b.add("gilgit", "Mountain kingdoms of Gilgit and Baltistan", "kingdom", adm("Ladakh"), "")
    b.add("ahom", "Ahom kingdom (Assam)", "kingdom", adm("Assam"),
          "The Ahoms defeated the Mughal navy at the battle of Saraighat (1671) on the Brahmaputra.")
    b.add("manipur", "Manipur", "kingdom", adm("Manipur"), "")
    b.add("tripura", "Tripura", "kingdom", adm("Tripura"), "")
    b.add("northeast", "Hill peoples of the northeast (self-governing)", "free",
          adm("Arunachal Pradesh", "Nagaland", "Mizoram", "Meghalaya"), "")
    b.add("pashtun", "Pashtun tribes (self-governing)", "free", PASHTUN_1707,
          "The Mughals never fully controlled these mountain valleys.")
    b.add("kalat", "Khanate of Kalat (Baloch)", "ally", adm("PAK:Baluchistan").intersection(lon_west(67.3)), "")
    b.add("marathas", "Marathas", "maratha", MARATHA_1707,
          "After Shivaji (died 1680), the Marathas kept fighting the Mughals from their hill forts. "
          "In 1707 they were led by Tarabai, a queen regent.")
    b.add("travancore", "Venad (Travancore)", "kingdom",
          adm("Kerala", "Tamil Nadu").intersection(lat_below(9.4)).intersection(lon_west(77.5)), "")
    b.add("cochin", "Cochin", "kingdom", adm("Kerala").intersection(bbox(75.9, 9.4, 76.8, 10.6)), "")
    b.add("calicut", "Calicut (Zamorin) and Malabar chiefs", "kingdom", adm("Kerala", "Lakshadweep"), "")
    b.add("madurai", "Madurai Nayaks", "kingdom", adm("Tamil Nadu").intersection(lat_below(10.4)).union(
        adm("Tamil Nadu").intersection(bbox(77.0, 10.4, 78.6, 11.2))),
          "Rulers of the far south, famous for the temple city of Madurai.")
    b.add("thanjavur", "Thanjavur (Maratha kings)", "kingdom", adm("Tamil Nadu", "Puducherry").intersection(THANJAVUR),
          "Ruled by a branch of Shivaji's family.")
    b.add("mysore", "Mysore (paid tribute to the Mughals)", "ally",
          mask("1760")[4].intersection(adm("Karnataka", "Tamil Nadu")).intersection(lat_below(13.6)), "")
    b.add("keladi", "Keladi (Bednur)", "kingdom", adm("Karnataka").intersection(
        poly([(74.0, 14.6), (75.4, 14.6), (75.8, 13.9), (75.6, 12.6), (74.8, 12.6), (74.6, 13.5)])), "")
    b.add("rajputs", "Rajput kingdoms (allies of the Mughals)", "ally", adm("Rajasthan"),
          "Rajput kings commanded Mughal armies, but they kept their own kingdoms. In 1707 some had rebelled.")
    b.add("hills", "Hill kingdoms (Garhwal, Kumaon, Kangra…)", "ally", adm("Himachal Pradesh", "Uttarakhand"), "")
    b.add("gond", "Gond kingdoms (paid tribute)", "ally", GOND.intersection(
        adm("Madhya Pradesh", "Chhattisgarh", "Maharashtra", "Odisha", "Telangana")), "")
    b.add("mughal", "Mughal Empire", "mughal", L,
          "Emperor Aurangzeb (died 1707) ruled from Delhi, Agra and his camps in the Deccan. "
          "The empire was divided into about 20 provinces called subahs.")
    units = b.finish()
    points = [
        ("Delhi", 77.21, 28.66, "capital", "Shahjahanabad (Old Delhi), Mughal capital."),
        ("Agra", 78.01, 27.18, "capital", "Mughal capital, home of the Taj Mahal."),
        ("Lahore", 74.33, 31.58, "city", "A great Mughal city."),
        ("Aurangabad", 75.34, 19.88, "city", "Aurangzeb's base in the Deccan; he is buried nearby."),
        ("Dhaka", 90.41, 23.71, "city", "Capital of the Mughal province of Bengal."),
        ("Raigad", 73.44, 18.23, "fort", "Shivaji's hill fort and capital."),
        ("Bombay", 72.83, 18.94, "british", "An English East India Company town since 1668."),
        ("Madras", 80.29, 13.08, "british", "Fort St George, English since 1639."),
        ("Calcutta", 88.35, 22.57, "british", "English trading post founded in 1690."),
        ("Pondicherry", 79.83, 11.93, "french", "French trading town."),
        ("Cochin", 76.24, 9.97, "dutch", "Dutch fort since 1663."),
    ]
    return {"units": units, "points": [dict(zip(("name", "lon", "lat", "kind", "note"), p)) for p in points]}


# ---------------------------------------------------------------- 1760
ROHILKHAND = poly([(78.0, 29.4), (78.5, 29.9), (79.6, 29.1), (80.3, 28.6), (80.1, 27.9), (79.3, 27.7), (78.4, 28.2),
                   (78.0, 28.8)])
COMPANY_1760 = unary_union([
    # 24 Parganas (1757), Burdwan and Midnapore (1760)
    poly([(86.6, 22.4), (86.9, 23.6), (87.6, 23.65), (88.4, 23.3), (88.95, 22.9), (89.0, 21.65), (88.0, 21.6),
          (87.5, 21.6), (86.9, 21.8)]),
    # Chittagong (1760)
    poly([(91.6, 22.95), (92.0, 22.7), (92.2, 21.9), (92.3, 21.2), (91.95, 21.2), (91.7, 21.9), (91.45, 22.6)], soft=0.05),
])


def era_1760():
    yellow, green, blue, pink = (mask("1760")[i] for i in (1, 2, 3, 4))
    L = clean(unary_union([geo.land(), ctry("AFG")]))
    b = Builder(L)
    ceylon_1700s(b)
    b.add("maldives", "Maldive Sultanate", "kingdom", ctry("MDV"), "")
    b.add("portuguese", "Portuguese India", "euro", adm("Goa").union(dnhdd("daman")).union(dnhdd("diu")),
          "Goa, Daman and Diu.")
    b.add("french", "French India", "euro", adm("Puducherry"),
          "Pondicherry, Karikal, Mahé and Yanam. The British captured Pondicherry in January 1761.")
    b.add("company", "British East India Company lands", "company", COMPANY_1760.intersection(adm("West Bengal").union(ctry("BGD"))),
          "After the battle of Plassey (1757) the Company took the land around Calcutta, and in 1760 "
          "Burdwan, Midnapore and Chittagong.")
    b.add("nepal", "Gorkha and the Nepal hill kingdoms", "kingdom", ctry("NPL"),
          "The Gorkha king Prithvi Narayan Shah was conquering the other kingdoms; he took Kathmandu in 1768.")
    b.add("bhutan", "Bhutan", "kingdom", ctry("BTN"), "")
    b.add("sikkim", "Sikkim", "kingdom", adm("Sikkim"), "")
    b.add("gilgit", "Mountain kingdoms of Gilgit and Baltistan", "kingdom",
          adm("Ladakh").intersection(GILGIT), "")
    b.add("ladakh", "Ladakh", "kingdom", adm("Ladakh"), "")
    b.add("jammu", "Jammu (Dogra kingdom)", "kingdom", adm("Jammu and Kashmir").intersection(JAMMU), "")
    b.add("durrani", "Durrani Empire (Afghan)", "afghan", ctry("AFG").union(adm("Jammu and Kashmir")).union(
        adm("PAK:K.P.", "PAK:F.A.T.A.")).union(green.intersection(adm("PAK:Punjab", "PAK:F.C.T.", "Punjab"))),
          "Ahmad Shah Durrani (Abdali) ruled from Kandahar and took Punjab and Kashmir. "
          "In Punjab, Sikh bands (misls) were fighting him and would soon rule the land themselves.")
    b.add("kalat", "Khanate of Kalat (Baloch)", "kingdom", adm("PAK:Baluchistan"), "")
    b.add("sindh", "Sindh (Kalhora rulers)", "kingdom", adm("PAK:Sind"), "")
    b.add("kutch", "Kutch", "kingdom", adm("Gujarat").intersection(bbox(68, 22.75, 71.6, 25)), "")
    b.add("kathiawar", "Kathiawar chiefs", "kingdom", adm("Gujarat").intersection(bbox(68, 20, 72.2, 22.75)),
          "Dozens of small kingdoms that paid tribute to the Marathas.")
    b.add("rajputs", "Rajput kingdoms", "kingdom", adm("Rajasthan"),
          "Jaipur, Jodhpur, Udaipur and others. They had to pay tribute (chauth) to the Marathas.")
    b.add("hills", "Hill kingdoms (Garhwal, Kumaon, Kangra…)", "kingdom",
          adm("Himachal Pradesh", "Uttarakhand").union(adm("Punjab", "Haryana", "Chandigarh").intersection(lat_above(31.0))), "")
    b.add("rohilkhand", "Rohilkhand (Rohilla Afghans)", "kingdom", ROHILKHAND.intersection(adm("Uttar Pradesh")), "")
    b.add("awadh", "Awadh (Nawab)", "kingdom", blue.intersection(adm("Uttar Pradesh", "Bihar")),
          "The Nawabs of Awadh ruled from Faizabad and later Lucknow.")
    b.add("ahom", "Ahom kingdom (Assam)", "kingdom", adm("Assam"), "")
    b.add("manipur", "Manipur", "kingdom", adm("Manipur"), "")
    b.add("tripura", "Tripura", "kingdom", adm("Tripura").union(ctry("BGD").intersection(bbox(91.7, 21.4, 92.7, 23.8))), "")
    b.add("koch", "Koch Bihar", "kingdom", adm("West Bengal").intersection(bbox(88.75, 25.9, 89.9, 26.6)), "")
    b.add("northeast", "Hill peoples of the northeast (self-governing)", "free",
          adm("Arunachal Pradesh", "Nagaland", "Mizoram", "Meghalaya"), "")
    b.add("bengal", "Bengal (Nawab)", "kingdom",
          adm("Bihar", "Jharkhand", "West Bengal").union(ctry("BGD")).difference(yellow),
          "The richest province of India. After Plassey (1757) the Company chose who would be Nawab.")
    b.add("travancore", "Travancore", "kingdom", adm("Kerala", "Tamil Nadu").intersection(lat_below(9.75)).intersection(lon_west(77.6)),
          "King Marthanda Varma had beaten the Dutch at Colachel in 1741.")
    b.add("cochin", "Cochin", "kingdom", adm("Kerala").intersection(bbox(75.9, 9.75, 76.9, 10.6)), "")
    b.add("calicut", "Calicut (Zamorin) and Malabar chiefs", "kingdom", adm("Kerala", "Lakshadweep"), "")
    b.add("thanjavur", "Thanjavur (Maratha kings)", "kingdom", adm("Tamil Nadu").intersection(THANJAVUR), "")
    b.add("keladi", "Keladi (Bednur)", "kingdom", adm("Karnataka").intersection(
        poly([(74.0, 14.6), (75.4, 14.6), (75.8, 13.9), (75.6, 12.6), (74.8, 12.6), (74.6, 13.5)])),
          "Conquered by Hyder Ali of Mysore in 1763.")
    b.add("mysore", "Mysore", "kingdom", pink.intersection(adm("Karnataka", "Tamil Nadu", "Kerala").intersection(lat_below(15.2))),
          "Hyder Ali, a commander of the Mysore army, took power in 1761.")
    b.add("nizam", "Hyderabad (Nizam)", "kingdom", green.intersection(bbox(74, 15.5, 86, 22.5)),
          "The Nizam had been the Mughal governor of the Deccan and became an independent ruler.")
    b.add("carnatic", "Carnatic (Nawab of Arcot)", "kingdom", green.intersection(lat_below(15.5)),
          "The British and the French fought three wars here (1746–1763), each backing a different Nawab.")
    b.add("maratha", "Maratha Confederacy", "maratha", L,
          "The Peshwa ruled from Pune, with the Scindia, Holkar, Gaekwad and Bhonsle families. "
          "In January 1761 the Marathas lost the third battle of Panipat to Ahmad Shah Durrani.")
    units = b.finish()
    points = [
        ("Pune", 73.86, 18.52, "capital", "Capital of the Peshwas, leaders of the Marathas."),
        ("Delhi", 77.21, 28.66, "capital", "The Mughal emperor still had his throne, but little power."),
        ("Panipat", 76.97, 29.39, "battle", "Third battle of Panipat, 14 January 1761."),
        ("Plassey", 88.25, 23.8, "battle", "Battle of Plassey, 1757: the Company beat Nawab Siraj-ud-Daulah."),
        ("Bombay", 72.83, 18.94, "british", "British East India Company."),
        ("Madras", 80.29, 13.08, "british", "British East India Company (Fort St George)."),
        ("Calcutta", 88.35, 22.57, "british", "British East India Company (Fort William)."),
        ("Tellicherry", 75.49, 11.75, "british", "British East India Company."),
        ("Chandernagore", 88.37, 22.87, "french", "French, captured by the British in 1757."),
        ("Chinsurah", 88.39, 22.9, "dutch", "Dutch East India Company."),
        ("Cochin", 76.24, 9.97, "dutch", "Dutch East India Company."),
        ("Nagapattinam", 79.84, 10.77, "dutch", "Dutch East India Company."),
        ("Tranquebar", 79.86, 11.03, "danish", "Danish East India Company."),
        ("Serampore", 88.34, 22.75, "danish", "Danish East India Company."),
    ]
    return {"units": units, "points": [dict(zip(("name", "lon", "lat", "kind", "note"), p)) for p in points]}


# ---------------------------------------------------------------- 1909
HYDERABAD = poly([(74.9, 20.65), (78.2, 20.65), (81.5, 19.0), (81.4, 16.5), (78.5, 15.4), (76.2, 15.2), (75.6, 16.4),
                  (74.9, 17.5)])


def era_1909():
    Y = mask("1909")[1]
    L = clean(unary_union([geo.land(), ctry("MMR")]))
    b = Builder(L)
    P = lambda uid, name, region, info="": b.add(uid, name, "prince", Y.intersection(region), info)
    b.add("nepal", "Nepal (independent kingdom)", "free", ctry("NPL"), "")
    b.add("bhutan", "Bhutan", "free", ctry("BTN"), "")
    b.add("ceylon", "Ceylon (British crown colony)", "colony", ctry("LKA"),
          "Ruled by Britain, but not part of British India.")
    b.add("maldives", "Maldive Islands (British protectorate)", "colony", ctry("MDV"), "")
    b.add("portuguese", "Portuguese India", "euro", adm("Goa", "Dadra and Nagar Haveli and Daman and Diu"),
          "Goa, Daman, Diu, Dadra and Nagar Haveli.")
    b.add("french", "French India", "euro", adm("Puducherry"), "Pondicherry, Karikal, Mahé, Yanam and Chandernagore.")
    b.add("kashmir", "Jammu and Kashmir", "prince", adm("Jammu and Kashmir", "Ladakh"),
          "The biggest princely state, ruled by a Dogra Maharaja.")
    b.add("sikkim", "Sikkim", "prince", adm("Sikkim"), "")
    b.add("manipur", "Manipur", "prince", adm("Manipur"), "")
    b.add("tripura", "Hill Tippera (Tripura)", "prince", adm("Tripura"), "")
    b.add("andaman", "Andaman and Nicobar Islands", "brit", adm("Andaman and Nicobar"),
          "The British built a prison here, the Cellular Jail, for freedom fighters.")
    P("shan", "Shan States", ctry("MMR"))
    b.add("burma", "Burma (a province of British India)", "brit", ctry("MMR"), "Burma was separated from India in 1937.")
    P("hyderabad", "Hyderabad", HYDERABAD, "Ruled by the Nizam. The richest princely state, as big as Britain.")
    P("mysore", "Mysore", bbox(74.5, 11.5, 78.7, 15.1).intersection(adm("Karnataka", "Andhra Pradesh", "Tamil Nadu")), "")
    P("travancore", "Travancore", adm("Kerala", "Tamil Nadu").intersection(lat_below(9.85)), "")
    P("cochin", "Cochin", adm("Kerala").intersection(lat_below(10.9)), "")
    P("pudukkottai", "Pudukkottai", adm("Tamil Nadu"), "")
    P("deccan", "Kolhapur and the Deccan States", adm("Maharashtra", "Karnataka").intersection(lon_west(76.0)), "")
    P("rajputana", "Rajputana Agency", adm("Rajasthan"), "About 20 states, such as Jaipur, Jodhpur, Udaipur and Bikaner.")
    P("central", "Central India Agency", adm("Madhya Pradesh", "Uttar Pradesh").intersection(lat_above(21.3)),
      "Gwalior, Indore, Bhopal and many smaller states.")
    P("baroda", "Baroda", adm("Gujarat").intersection(bbox(72.6, 21.7, 74.0, 22.9)), "Ruled by the Gaekwad.")
    P("cutch", "Cutch", adm("Gujarat").intersection(bbox(68, 22.75, 71.8, 25)), "")
    P("kathiawar", "Kathiawar States", adm("Gujarat").intersection(lon_west(72.35)), "More than 200 states, some as small as a village.")
    P("gujarat", "Gujarat States", adm("Gujarat"), "")
    P("punjabst", "Punjab States", adm("Punjab", "Haryana", "Delhi", "Chandigarh"), "Patiala, Nabha, Jind, Kapurthala and others.")
    P("hillst", "Punjab Hill States", adm("Himachal Pradesh"), "")
    P("tehri", "Tehri Garhwal", adm("Uttarakhand"), "")
    P("rampur", "Rampur", adm("Uttar Pradesh"), "")
    P("bahawalpur", "Bahawalpur", adm("PAK:Punjab"), "")
    P("khairpur", "Khairpur", adm("PAK:Sind"), "")
    P("kalat", "Kalat and the Baluchistan States", adm("PAK:Baluchistan"), "")
    P("frontier", "Chitral, Dir and Swat", adm("PAK:K.P.", "PAK:F.A.T.A."), "")
    P("orissa", "Orissa Tributary States", adm("Odisha"), "")
    P("cpstates", "Chhattisgarh States", adm("Chhattisgarh", "Madhya Pradesh", "Maharashtra"), "Bastar, Kanker, Raigarh and others.")
    P("chotanagpur", "Chota Nagpur States", adm("Jharkhand", "Bihar"), "")
    P("coochbehar", "Cooch Behar", adm("West Bengal"), "")
    P("khasi", "Khasi States", adm("Meghalaya", "Assam"), "")
    P("other", "Smaller princely states", L, "")
    R = lambda uid, name, region, info="": b.add(uid, name, "brit", region, info)
    R("coorg", "Coorg", bbox(75.35, 11.95, 76.15, 12.8).intersection(adm("Karnataka")), "")
    R("ajmer", "Ajmer-Merwara", adm("Rajasthan"), "")
    R("nwfp", "North-West Frontier Province", adm("PAK:K.P.", "PAK:F.A.T.A."), "")
    R("baluchistan", "Baluchistan", adm("PAK:Baluchistan"), "")
    R("punjab", "Punjab", adm("PAK:Punjab", "PAK:F.C.T.", "Punjab", "Haryana", "Delhi", "Chandigarh", "Himachal Pradesh"),
      "Delhi was part of Punjab until 1912, when it became the new capital of British India.")
    R("up", "United Provinces of Agra and Oudh", adm("Uttar Pradesh", "Uttarakhand"), "")
    R("cp", "Central Provinces and Berar", adm("Madhya Pradesh", "Chhattisgarh").union(
        adm("Maharashtra").intersection(bbox(76.2, 18.7, 81, 22.5))), "")
    R("ebengal", "Eastern Bengal and Assam", ctry("BGD").union(adm("Assam", "Meghalaya", "Nagaland", "Mizoram", "Arunachal Pradesh")).union(
        adm("West Bengal").intersection(bbox(87.9, 24.9, 90, 26.6))),
      "Made in 1905, when the British cut Bengal in two. After huge protests it was undone in 1911.")
    R("bengal", "Bengal", adm("West Bengal", "Bihar", "Jharkhand").union(adm("Odisha").intersection(lat_above(19.6))),
      "In 1909 Bengal also included Bihar and Orissa. Calcutta was the capital of British India until 1911.")
    R("madras", "Madras Presidency", adm("Tamil Nadu", "Andhra Pradesh", "Kerala", "Lakshadweep", "Odisha", "Telangana").union(
        adm("Karnataka").intersection(lat_below(14.3))).union(adm("Karnataka").intersection(lon_east(75.9))), "")
    R("bombay", "Bombay Presidency", L,
      "It stretched from Sind in the north to Kanara in the south.")
    units = b.finish()
    points = [
        ("Calcutta", 88.35, 22.57, "capital", "Capital of British India until 1911."),
        ("Simla", 77.17, 31.10, "capital", "Summer capital: the government moved up to the cool hills every year."),
        ("Delhi", 77.21, 28.66, "city", "Became the capital of British India in 1911–1912."),
        ("Bombay", 72.83, 18.94, "city", ""),
        ("Madras", 80.29, 13.08, "city", ""),
        ("Chandernagore", 88.37, 22.87, "french", "French."),
    ]
    return {"units": units, "points": [dict(zip(("name", "lon", "lat", "kind", "note"), p)) for p in points]}


# ---------------------------------------------------------------- 1947 and after: pieces of today's map
def pieces():
    """Today's units, cut where a border moved after 1947. Each piece keeps one owner at a time."""
    A = geo.admin1()
    out = {}
    for k, g in A.items():
        a3, name = k.split(":", 1)
        if a3 != "IND":
            continue
        if name == "Himachal Pradesh":
            out["HP_OLD"] = g.difference(HP_1966)
            out["HP_1966"] = g.intersection(HP_1966)
        elif name == "Dadra and Nagar Haveli and Daman and Diu":
            out["DNH"] = dnhdd("dnh")
            out["DAMAN"] = dnhdd("daman")
            out["DIU"] = dnhdd("diu")
        else:
            out[name] = g
    out["PK_PUNJAB"] = adm("PAK:Punjab", "PAK:F.C.T.")
    out["PK_SINDH"] = adm("PAK:Sind")
    out["PK_KP"] = adm("PAK:K.P.", "PAK:F.A.T.A.")
    out["PK_BALOCH"] = adm("PAK:Baluchistan")
    for a3 in ("BGD", "NPL", "BTN", "LKA", "MDV"):
        out[a3] = ctry(a3)
    return {k: clean(v) for k, v in out.items() if not v.is_empty}


# Units after 1947: key -> (name, category, main language(s) for Indian states)
UNITS = {
    "IN": ("Dominion of India", "india", ""),
    "PK_W": ("Pakistan (West)", "foreign", ""),
    "PK_E": ("East Pakistan", "foreign", ""),
    "W_PAK": ("West Pakistan", "foreign", ""),
    "PK_PUNJAB": ("Punjab (Pakistan)", "foreign", ""),
    "PK_SINDH": ("Sindh (Pakistan)", "foreign", ""),
    "PK_NWFP": ("North-West Frontier Province (Pakistan)", "foreign", ""),
    "PK_KP": ("Khyber Pakhtunkhwa (Pakistan)", "foreign", ""),
    "PK_BALOCH": ("Balochistan (Pakistan)", "foreign", ""),
    "BGD": ("Bangladesh", "foreign", ""),
    "NPL": ("Nepal", "foreign", ""),
    "BTN": ("Bhutan", "foreign", ""),
    "CEYLON": ("Ceylon", "foreign", ""),
    "LKA": ("Sri Lanka", "foreign", ""),
    "MDV_P": ("Maldive Islands (British protectorate)", "foreign", ""),
    "MDV": ("Maldives", "foreign", ""),
    "SIKKIM_K": ("Kingdom of Sikkim (protected by India)", "foreign", ""),
    "PORT": ("Portuguese India", "euro", ""),
    "FR": ("French India", "euro", ""),
    "DNH_FREE": ("Free Dadra and Nagar Haveli (joined India in 1961)", "area", "Gujarati, Marathi"),
    "PONDY_DF": ("Pondicherry (under India from 1954, officially from 1962)", "area", "Tamil, Malayalam, Telugu, French"),
    # Indian states and union territories
    "ANDHRA": ("Andhra Pradesh", "state", "Telugu"),
    "ANDHRA_STATE": ("Andhra State", "state", "Telugu"),
    "HYDERABAD": ("Hyderabad State", "state", "Telugu, Marathi, Kannada, Urdu"),
    "TELANGANA": ("Telangana", "state", "Telugu"),
    "ASSAM": ("Assam", "state", "Assamese"),
    "NEFA": ("North-East Frontier Agency (governed through Assam)", "area", "Many languages"),
    "ARUNACHAL_UT": ("Arunachal Pradesh (union territory)", "ut", "Many languages"),
    "ARUNACHAL": ("Arunachal Pradesh", "state", "Many languages"),
    "BIHAR": ("Bihar", "state", "Hindi, Maithili"),
    "JHARKHAND": ("Jharkhand", "state", "Hindi, Santali"),
    "BOMBAY": ("Bombay State", "state", "Marathi, Gujarati"),
    "MAHARASHTRA": ("Maharashtra", "state", "Marathi"),
    "GUJARAT": ("Gujarat", "state", "Gujarati"),
    "JK": ("Jammu and Kashmir", "state", "Kashmiri, Dogri, Urdu"),
    "JK_UT": ("Jammu and Kashmir (union territory)", "ut", "Kashmiri, Dogri, Urdu, Hindi"),
    "LADAKH": ("Ladakh (union territory)", "ut", "Ladakhi, Hindi"),
    "KERALA": ("Kerala", "state", "Malayalam"),
    "TRAVANCORE_COCHIN": ("Travancore-Cochin", "state", "Malayalam, Tamil"),
    "MP": ("Madhya Pradesh", "state", "Hindi"),
    "CHHATTISGARH": ("Chhattisgarh", "state", "Hindi, Chhattisgarhi"),
    "MADRAS": ("Madras State", "state", "Tamil"),
    "TAMILNADU": ("Tamil Nadu", "state", "Tamil"),
    "MYSORE": ("Mysore State", "state", "Kannada"),
    "KARNATAKA": ("Karnataka", "state", "Kannada"),
    "ORISSA": ("Orissa", "state", "Odia"),
    "ODISHA": ("Odisha", "state", "Odia"),
    "PUNJAB_BIG": ("Punjab", "state", "Punjabi, Hindi"),
    "PUNJAB": ("Punjab", "state", "Punjabi"),
    "HARYANA": ("Haryana", "state", "Hindi"),
    "CHANDIGARH": ("Chandigarh", "ut", "Punjabi, Hindi"),
    "RAJASTHAN": ("Rajasthan", "state", "Hindi, Rajasthani"),
    "UP": ("Uttar Pradesh", "state", "Hindi"),
    "UTTARAKHAND": ("Uttarakhand", "state", "Hindi, Garhwali, Kumaoni"),
    "WB": ("West Bengal", "state", "Bengali"),
    "DELHI": ("Delhi", "ut", "Hindi"),
    "HP_UT": ("Himachal Pradesh (union territory)", "ut", "Hindi, Pahari"),
    "HP": ("Himachal Pradesh", "state", "Hindi, Pahari"),
    "MANIPUR_UT": ("Manipur (union territory)", "ut", "Meitei (Manipuri)"),
    "MANIPUR": ("Manipur", "state", "Meitei (Manipuri)"),
    "TRIPURA_UT": ("Tripura (union territory)", "ut", "Bengali, Kokborok"),
    "TRIPURA": ("Tripura", "state", "Bengali, Kokborok"),
    "MEGHALAYA": ("Meghalaya", "state", "Khasi, Garo"),
    "NAGALAND": ("Nagaland", "state", "Many Naga languages, English"),
    "MIZORAM_UT": ("Mizoram (union territory)", "ut", "Mizo"),
    "MIZORAM": ("Mizoram", "state", "Mizo"),
    "SIKKIM": ("Sikkim", "state", "Nepali, Sikkimese, Lepcha"),
    "GOA_UT": ("Goa, Daman and Diu", "ut", "Konkani, Marathi, Gujarati"),
    "GOA": ("Goa", "state", "Konkani"),
    "DAMANDIU": ("Daman and Diu", "ut", "Gujarati"),
    "DNH": ("Dadra and Nagar Haveli", "ut", "Gujarati, Marathi"),
    "DNHDD": ("Dadra and Nagar Haveli and Daman and Diu", "ut", "Gujarati, Marathi"),
    "PONDY": ("Pondicherry", "ut", "Tamil, Malayalam, Telugu, French"),
    "PUDUCHERRY": ("Puducherry", "ut", "Tamil, Malayalam, Telugu"),
    "ANDAMAN": ("Andaman and Nicobar Islands", "ut", "Hindi, Bengali, Tamil, English"),
    "LACCADIVE": ("Laccadive, Minicoy and Amindivi Islands", "ut", "Malayalam"),
    "LAKSHADWEEP": ("Lakshadweep", "ut", "Malayalam"),
}

# piece -> [(from year, unit)] ; the first row is the situation in 1947 (after 15 August)
TIMELINE = {
    "Andhra Pradesh": [(1947, "IN"), (1953, "ANDHRA_STATE"), (1956, "ANDHRA")],
    "Telangana": [(1947, "IN"), (1956, "ANDHRA"), (2014, "TELANGANA")],
    "Assam": [(1947, "IN"), (1956, "ASSAM")],
    "Meghalaya": [(1947, "IN"), (1956, "ASSAM"), (1972, "MEGHALAYA")],
    "Mizoram": [(1947, "IN"), (1956, "ASSAM"), (1972, "MIZORAM_UT"), (1987, "MIZORAM")],
    "Nagaland": [(1947, "IN"), (1956, "ASSAM"), (1963, "NAGALAND")],
    "Arunachal Pradesh": [(1947, "IN"), (1956, "NEFA"), (1972, "ARUNACHAL_UT"), (1987, "ARUNACHAL")],
    "Bihar": [(1947, "IN"), (1956, "BIHAR")],
    "Jharkhand": [(1947, "IN"), (1956, "BIHAR"), (2000, "JHARKHAND")],
    "Maharashtra": [(1947, "IN"), (1956, "BOMBAY"), (1960, "MAHARASHTRA")],
    "Gujarat": [(1947, "IN"), (1956, "BOMBAY"), (1960, "GUJARAT")],
    "Jammu and Kashmir": [(1947, "IN"), (1956, "JK"), (2019, "JK_UT")],
    "Ladakh": [(1947, "IN"), (1956, "JK"), (2019, "LADAKH")],
    "Kerala": [(1947, "IN"), (1956, "KERALA")],
    "Madhya Pradesh": [(1947, "IN"), (1956, "MP")],
    "Chhattisgarh": [(1947, "IN"), (1956, "MP"), (2000, "CHHATTISGARH")],
    "Tamil Nadu": [(1947, "IN"), (1956, "MADRAS"), (1969, "TAMILNADU")],
    "Karnataka": [(1947, "IN"), (1956, "MYSORE"), (1973, "KARNATAKA")],
    "Odisha": [(1947, "IN"), (1956, "ORISSA"), (2011, "ODISHA")],
    "Punjab": [(1947, "IN"), (1956, "PUNJAB_BIG"), (1966, "PUNJAB")],
    "Haryana": [(1947, "IN"), (1956, "PUNJAB_BIG"), (1966, "HARYANA")],
    "Chandigarh": [(1947, "IN"), (1956, "PUNJAB_BIG"), (1966, "CHANDIGARH")],
    "HP_1966": [(1947, "IN"), (1956, "PUNJAB_BIG"), (1966, "HP_UT"), (1971, "HP")],
    "HP_OLD": [(1947, "IN"), (1956, "HP_UT"), (1971, "HP")],
    "Rajasthan": [(1947, "IN"), (1956, "RAJASTHAN")],
    "Uttar Pradesh": [(1947, "IN"), (1956, "UP")],
    "Uttarakhand": [(1947, "IN"), (1956, "UP"), (2000, "UTTARAKHAND")],
    "West Bengal": [(1947, "IN"), (1956, "WB")],
    "Delhi": [(1947, "IN"), (1956, "DELHI")],
    "Manipur": [(1947, "IN"), (1956, "MANIPUR_UT"), (1972, "MANIPUR")],
    "Tripura": [(1947, "IN"), (1956, "TRIPURA_UT"), (1972, "TRIPURA")],
    "Sikkim": [(1947, "SIKKIM_K"), (1975, "SIKKIM")],
    "Goa": [(1947, "PORT"), (1961, "GOA_UT"), (1987, "GOA")],
    "DAMAN": [(1947, "PORT"), (1961, "GOA_UT"), (1987, "DAMANDIU"), (2020, "DNHDD")],
    "DIU": [(1947, "PORT"), (1961, "GOA_UT"), (1987, "DAMANDIU"), (2020, "DNHDD")],
    "DNH": [(1947, "PORT"), (1954, "DNH_FREE"), (1961, "DNH"), (2020, "DNHDD")],
    "Puducherry": [(1947, "FR"), (1954, "PONDY_DF"), (1962, "PONDY"), (2006, "PUDUCHERRY")],
    "Andaman and Nicobar": [(1947, "IN"), (1956, "ANDAMAN")],
    "Lakshadweep": [(1947, "IN"), (1956, "LACCADIVE"), (1973, "LAKSHADWEEP")],
    "PK_PUNJAB": [(1947, "PK_W"), (1955, "W_PAK"), (1970, "PK_PUNJAB")],
    "PK_SINDH": [(1947, "PK_W"), (1955, "W_PAK"), (1970, "PK_SINDH")],
    "PK_KP": [(1947, "PK_W"), (1955, "W_PAK"), (1970, "PK_NWFP"), (2010, "PK_KP")],
    "PK_BALOCH": [(1947, "PK_W"), (1955, "W_PAK"), (1970, "PK_BALOCH")],
    "BGD": [(1947, "PK_E"), (1971, "BGD")],
    "NPL": [(1947, "NPL")],
    "BTN": [(1947, "BTN")],
    "LKA": [(1947, "CEYLON"), (1972, "LKA")],
    "MDV": [(1947, "MDV_P"), (1965, "MDV")],
}

# What happened in each year of the slider (shown under it)
MILESTONES = [
    (1947, "15 August 1947: India and Pakistan become independent. More than 560 princely states have to join one of them."),
    (1953, "Andhra State is created for Telugu speakers, after Potti Sriramulu dies on hunger strike asking for it."),
    (1954, "The French hand over Pondicherry. Dadra and Nagar Haveli free themselves from Portugal."),
    (1955, "Pakistan joins its western provinces into one: West Pakistan."),
    (1956, "1 November 1956: the States Reorganisation Act redraws the map, mostly by language."),
    (1960, "Bombay State is split into Maharashtra (Marathi) and Gujarat (Gujarati)."),
    (1961, "India takes Goa, Daman and Diu from Portugal."),
    (1963, "Nagaland becomes a state."),
    (1966, "Punjab is split: Punjab (Punjabi), Haryana (Hindi) and hill areas for Himachal Pradesh."),
    (1969, "Madras State is renamed Tamil Nadu, 'land of the Tamils'."),
    (1970, "Pakistan splits West Pakistan into four provinces again."),
    (1971, "East Pakistan becomes independent as Bangladesh after a war."),
    (1972, "New states in the northeast: Meghalaya, Manipur and Tripura. Ceylon renames itself Sri Lanka."),
    (1973, "Mysore State is renamed Karnataka."),
    (1975, "Sikkim joins India as a state."),
    (1987, "Goa, Mizoram and Arunachal Pradesh become states."),
    (2000, "Three new states: Chhattisgarh, Uttarakhand and Jharkhand."),
    (2011, "Orissa changes the spelling of its name to Odisha."),
    (2014, "Telangana is separated from Andhra Pradesh."),
    (2019, "Jammu and Kashmir becomes two union territories: Jammu and Kashmir, and Ladakh."),
    (2020, "Dadra and Nagar Haveli and Daman and Diu are joined into one union territory."),
]


def unit_at(piece, year):
    cur = None
    for y, u in TIMELINE[piece]:
        if y <= year:
            cur = u
    return cur


ERAS = {"-250": era_maurya, "1707": era_1707, "1760": era_1760, "1909": era_1909}
