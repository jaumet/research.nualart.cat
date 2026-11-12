"""The map of every year, from 1788 to today, as "pieces" of today's land.

Today's states and territories are cut along the old lines (129°, 132°, 135°, 141° East; 20° and 26° South;
the tip of Cape York). Each piece has a timeline that says which colony, state or territory it belonged
to from each year on. The British claims are drawn as they were written in London: on paper, the
lines crossed the Country of hundreds of Aboriginal nations who had not been asked.
"""
from shapely.ops import unary_union

import geo
from geo import clean, west_of, east_of, north_of, south_of


def pieces():
    S = geo.states()
    out = {}
    wa, nt, sa, qld = S["Western Australia"], S["Northern Territory"], S["South Australia"], S["Queensland"]
    out["WA"] = wa
    out["SA_W"] = sa.intersection(west_of(132))
    out["SA_M"] = sa.intersection(east_of(132)).intersection(west_of(135))
    out["SA_E"] = sa.intersection(east_of(135))
    for side, half in (("W", west_of(135)), ("E", east_of(135))):
        out[f"NT_{side}N"] = nt.intersection(half).intersection(north_of(-20))
        out[f"NT_{side}S"] = nt.intersection(half).intersection(south_of(-20))
    tsi = qld.intersection(north_of(-10.68))  # Torres Strait Islands, north of the tip of Cape York
    q = qld.difference(tsi)
    out["TSI"] = tsi
    out["QLD_STRIP"] = q.intersection(west_of(141))
    out["QLD_N"] = q.intersection(east_of(141)).intersection(north_of(-26))
    out["QLD_S"] = q.intersection(east_of(141)).intersection(south_of(-26))
    out["NSW"] = S["New South Wales"]
    out["ACT"] = S["Australian Capital Territory"]
    out["JBT"] = S["Jervis Bay Territory"]
    out["VIC"] = S["Victoria"]
    out["TAS"] = S["Tasmania"]
    return {k: clean(v) for k, v in out.items() if not v.is_empty}


# key -> (name, category, family). The family keeps one colour for one colony through its whole life.
# Categories: none (not claimed by Britain), colony, part (part of another colony), state, territory
# (governed by the Commonwealth), selfgov (territory with its own elected government)
UNITS = {
    "NONE": ("Not claimed by Britain", "none", "none"),
    "NSW_C": ("New South Wales (colony)", "colony", "nsw"),
    "NSW": ("New South Wales", "state", "nsw"),
    "VDL": ("Van Diemen's Land (colony)", "colony", "tas"),
    "TAS_C": ("Tasmania (colony)", "colony", "tas"),
    "TAS": ("Tasmania", "state", "tas"),
    "WA_C": ("Western Australia (colony)", "colony", "wa"),
    "WA": ("Western Australia", "state", "wa"),
    "SA_C": ("South Australia (colony)", "colony", "sa"),
    "SA": ("South Australia", "state", "sa"),
    "NA": ("North Australia (colony, 1846–1847)", "colony", "na"),
    "VIC_C": ("Victoria (colony)", "colony", "vic"),
    "VIC": ("Victoria", "state", "vic"),
    "QLD_C": ("Queensland (colony)", "colony", "qld"),
    "QLD": ("Queensland", "state", "qld"),
    "SA_NT": ("Northern Territory of South Australia", "part", "sa"),
    "NT_C": ("Northern Territory (governed from Melbourne, then Canberra)", "territory", "nt"),
    "NORTH_A": ("North Australia (territory, 1927–1931)", "territory", "nt"),
    "CENTRAL_A": ("Central Australia (territory, 1927–1931)", "territory", "na"),
    "NT": ("Northern Territory", "selfgov", "nt"),
    "FCT": ("Federal Capital Territory", "territory", "act"),
    "ACT_T": ("Australian Capital Territory", "territory", "act"),
    "ACT": ("Australian Capital Territory", "selfgov", "act"),
    "JBT": ("Jervis Bay Territory", "territory", "act"),
}

NT_LIFE = [(1846, "NA"), (1847, "NSW_C"), (1863, "SA_NT"), (1911, "NT_C")]

# piece -> [(from year, unit)] ; the first row is the situation in 1788
TIMELINE = {
    "WA": [(1788, "NONE"), (1829, "WA_C"), (1901, "WA")],
    "SA_W": [(1788, "NONE"), (1825, "NSW_C"), (1861, "SA_C"), (1901, "SA")],
    "SA_M": [(1788, "NONE"), (1825, "NSW_C"), (1836, "SA_C"), (1901, "SA")],
    "SA_E": [(1788, "NSW_C"), (1836, "SA_C"), (1901, "SA")],
    "NT_WN": [(1788, "NONE"), (1825, "NSW_C"), *NT_LIFE, (1927, "NORTH_A"), (1931, "NT_C"), (1978, "NT")],
    "NT_WS": [(1788, "NONE"), (1825, "NSW_C"), *NT_LIFE, (1927, "CENTRAL_A"), (1931, "NT_C"), (1978, "NT")],
    "NT_EN": [(1788, "NSW_C"), *NT_LIFE, (1927, "NORTH_A"), (1931, "NT_C"), (1978, "NT")],
    "NT_ES": [(1788, "NSW_C"), *NT_LIFE, (1927, "CENTRAL_A"), (1931, "NT_C"), (1978, "NT")],
    "TSI": [(1788, "NONE"), (1879, "QLD_C"), (1901, "QLD")],
    "QLD_STRIP": [(1788, "NSW_C"), (1846, "NA"), (1847, "NSW_C"), (1862, "QLD_C"), (1901, "QLD")],
    "QLD_N": [(1788, "NSW_C"), (1846, "NA"), (1847, "NSW_C"), (1859, "QLD_C"), (1901, "QLD")],
    "QLD_S": [(1788, "NSW_C"), (1859, "QLD_C"), (1901, "QLD")],
    "NSW": [(1788, "NSW_C"), (1901, "NSW")],
    "ACT": [(1788, "NSW_C"), (1901, "NSW"), (1911, "FCT"), (1938, "ACT_T"), (1989, "ACT")],
    "JBT": [(1788, "NSW_C"), (1901, "NSW"), (1915, "FCT"), (1938, "ACT_T"), (1989, "JBT")],
    "VIC": [(1788, "NSW_C"), (1851, "VIC_C"), (1901, "VIC")],
    "TAS": [(1788, "NSW_C"), (1825, "VDL"), (1856, "TAS_C"), (1901, "TAS")],
}

# What happened in each year of the slider (shown under it)
MILESTONES = [
    (1788, "26 January 1788: the First Fleet lands at Sydney Cove. Britain claims everything east of 135° East and calls it New South Wales."),
    (1825, "New South Wales moves its western line to 129° East. Van Diemen's Land (Tasmania) becomes a colony of its own."),
    (1829, "The Swan River Colony is founded at Perth. Britain now claims the whole continent: Western Australia, west of 129° East."),
    (1836, "South Australia is founded, between 132° and 141° East and south of 26° South."),
    (1846, "London creates a colony called North Australia, north of 26° South. It lasts only a few months."),
    (1847, "North Australia is cancelled and given back to New South Wales."),
    (1851, "Victoria separates from New South Wales. Gold is found the same year."),
    (1856, "Van Diemen's Land changes its name to Tasmania, and governs itself."),
    (1859, "Queensland separates from New South Wales."),
    (1861, "South Australia grows west to 129° East."),
    (1862, "Queensland grows west to 138° East."),
    (1863, "The land left between Western Australia and Queensland is given to South Australia: its Northern Territory."),
    (1879, "Queensland annexes the last islands of the Torres Strait."),
    (1901, "1 January 1901: Federation. The six colonies become the states of the Commonwealth of Australia."),
    (1911, "The Northern Territory and the Federal Capital Territory are handed to the Commonwealth."),
    (1915, "Jervis Bay is added to the Federal Capital Territory, so that the capital has a port."),
    (1927, "The Northern Territory is split at 20° South into North Australia and Central Australia."),
    (1931, "The two halves are joined again into the Northern Territory."),
    (1938, "The Federal Capital Territory is renamed the Australian Capital Territory."),
    (1978, "The Northern Territory gets its own elected government."),
    (1989, "The Australian Capital Territory gets its own elected government. Jervis Bay becomes a territory of its own."),
]


def unit_at(piece, year):
    cur = None
    for y, u in TIMELINE[piece]:
        if y <= year:
            cur = u
    return cur


def claim_lines():
    """The two first lines drawn across the continent: 135° East (1788) and 129° East (1825)."""
    m = geo.mainland().buffer(0.3)
    from shapely.geometry import LineString
    return {k: LineString([(lon, -5), (lon, -45)]).intersection(m) for k, lon in (("135E", 135), ("129E", 129))}
