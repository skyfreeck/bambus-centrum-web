"""Převede export ze starého WordPressu (raw.json) na katalog pro nový web (katalog.js)."""
import json, re, sys
raw = json.load(open(sys.argv[1])); out = sys.argv[2]

ORDER = [  # pořadí a názvy kategorií jako v menu starého webu
 ("azalky","Azalky","Azaleas"), ("soliterni-azalky","Solitérní azalky","Specimen azaleas"),
 ("balkonovky","Balkónovky","Balcony plants"), ("bambusy","Bambusy","Bamboo"),
 ("javory","Javory","Maples"), ("jehlicnany","Jehličnany","Conifers"),
 ("lekniny","Lekníny","Water lilies"), ("vlhkomilne-rostliny","Vlhkomilné rostliny","Marginal plants"),
 ("listnace","Listnáče","Deciduous trees and shrubs"), ("magnolie","Magnolie","Magnolias"),
 ("ovocne-stromy-a-drobne-ovoce","Ovocné stromy a drobné ovoce","Fruit trees and soft fruit"),
 ("rhododendrony","Rhododendrony","Rhododendrons"), ("ruze","Růže","Roses"),
 ("traviny","Traviny","Grasses"), ("trvalky","Trvalky","Perennials"),
 ("vzacne_rostliny","Novinky v sortimentu","New in the collection"),
 ("japonske-dovozy","Japonské dovozy","Japanese imports"),
 ("tvarovane-stromy","Tvarované stromy Japonsko","Shaped trees from Japan"),
 ("tvarovane-stromy-evropa","Tvarované stromy Evropa","Shaped trees from Europe"),
 ("vzrostle-okrasne-rostliny","Vzrostlé okrasné rostliny","Mature ornamental plants"),
 ("pnouci_rostliny","Solitérní rostliny","Specimen plants"),
 ("asijske-kameny","Přírodní asijské kameny","Natural Asian stones"),
 ("kamenne-lucerny","Kamenné lucerny","Stone lanterns"),
 ("potreby-pro-bonsajisty","Potřeby pro bonsajisty","Bonsai tools and supplies"),
 ("hnojiva","Hnojiva","Fertilisers"), ("substraty","Substráty","Substrates"),
]
UPL = "https://www.bambuscentrum.cz/wp-content/uploads/"
GAL = "https://www.bambuscentrum.cz"

def clean(t):
    t = re.sub(r"ngg_shortcode_\d+_placeholder", "", t)
    return re.sub(r"[ \t]+", " ", t).strip()

def num(s):
    m = re.search(r"\d[\d\.\s]*", s.replace("\xa0", " "))
    return int(re.sub(r"[^\d]", "", m.group())) if m else None

def parse(desc, czech):
    lines = [l.strip() for l in clean(desc).split("\n") if l.strip()]
    rows, body = [], lines
    if "Cena (Kč)" in lines:
        i = lines.index("Cena (Kč)")
        j = i
        while j > 0 and lines[j-1] in ("Velikost kontejneru", "Velikost rostliny", "Velikost", "Výška", "Kontejner", "Obvod kmene", "Balení", "Objem", "Hmotnost"):
            j -= 1
        ncol = i - j + 1
        head = lines[j:i+1]
        rest = lines[i+1:]
        for k in range(0, len(rest) - ncol + 1, ncol):
            r = rest[k:k+ncol]
            if not re.search(r"\d", r[-1]): break
            rows.append(r)
        body = lines[:j]
        rows = [head] + rows if rows else []
    if body and czech and body[0].lower() == czech.lower():
        body = body[1:]
    return "\n".join(body), rows

cat_index = {s: n for n, (s, _, _) in enumerate(ORDER)}
items = []
for p in raw["posts"]:
    t = p["title"].strip()
    if " – " in t:
        latin, czech = t.rsplit(" – ", 1)
    else:
        latin, czech = t, ""
    desc, rows = parse(p["desc"], czech)
    prices = [num(r[-1]) for r in rows[1:]] if rows else []
    prices = [x for x in prices if x]
    k = [cat_index[c] for c in p["cats"] if c in cat_index]
    if not k: continue
    items.append({"s": p["slug"], "l": latin.strip(), "c": czech.strip(), "k": k,
                  "i": p.get("img") or "", "t": p.get("thumb") or p.get("img") or "",
                  "d": desc, "p": rows, "m": min(prices) if prices else None, "y": p["date"][:4]})

cats = []
for s, cz, en in ORDER:
    pg = raw["pages"].get(s)
    intro = ""
    gallery = []
    if pg:
        intro = clean(pg["text"])
        if intro.startswith("Nic nebylo nalezeno"): intro = ""
        intro = intro.replace("Nic nebylo nalezeno It seems we can’t find what you’re looking for. Perhaps searching can help. Search:", "").strip()
        for g in pg["items"]:
            full = g["full"] if g["full"].startswith("http") else GAL + g["full"]
            th = g["thumb"] or full
            th = th if th.startswith("http") else GAL + th
            title = re.sub(r"[-_]+", " ", g["title"]).strip()
            gallery.append({"f": full, "t": th, "n": g["desc"] or ""})
    n = sum(1 for it in items if cat_index[s] in it["k"])
    if not n and not gallery and not intro: continue
    cats.append({"s": s, "cz": cz, "en": en, "intro": intro, "g": gallery, "n": n})

data = {"exported": raw["exported"][:10], "base": UPL, "order": [s for s, _, _ in ORDER], "cats": cats, "items": items}
js = "/* Katalog převzatý ze starého webu bambuscentrum.cz (" + data["exported"] + "). Generuje tools/build_katalog.py. */\nwindow.KATALOG=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
open(out, "w").write(js)
print(len(items), "items,", len(cats), "cats,", round(len(js)/1024), "kB")
print("priced", sum(1 for i in items if i["m"]), "| no img", sum(1 for i in items if not i["i"]))
for c in cats: print(f'  {c["cz"]:32} {c["n"]:4} gal={len(c["g"]):3} intro={len(c["intro"])}')
