# Bambus Centrum Kastner — web

Statický web (HTML, CSS, JS) bez frameworku, bez cookies a bez externích fontů. Připravený pro GitHub Pages.

## Struktura
```
web_bambus_centrum/
├── index.html          česká verze
├── en/index.html       anglická verze (sdílí styly, skript i fotky)
├── sortiment.html      kompletní sortiment (1 395 položek ze starého webu), en/sortiment.html
├── katalog.js          data sortimentu (generuje tools/build_katalog.py)
├── sortiment.js        vyhledávání, kategorie, řazení, detail položky
├── favicon.svg, robots.txt, sitemap.xml
├── styles.css          design systém (paleta, typografie, layout)
├── script.js           KONFIGURACE, FOTKY, KATALOG + logika
├── README.md
└── assets/
    ├── fonts/          Brygada 1918 + Hanken Grotesk (lokálně, OFL licence)
    └── images/         sem ukládejte fotky (názvy viz níže)
```

## Fotky
Každý rámec na webu ukazuje přesný název souboru. Uložte fotku pod tímto názvem do `assets/images/` a zobrazí se bez úpravy kódu.

Pořadí načítání: **vlastní fotka → dočasná fotka ze stávajícího bambuscentrum.cz → zástupný rámec s instrukcí.**
Dočasné fotky mají v náhledu štítek „Dočasná fotka z bambuscentrum.cz“. Náhled = otevření ze složky, nebo adresa s `?nahled=1` (např. `.../index.html?nahled=1`). Bez toho web vypadá jako ostrá verze: karty bez fotky jsou skryté a rámečky jsou prázdné.

| Soubor | Kde je | Poměr |
|---|---|---|
| `hero-niwaki.jpg` | Hero | 4:5 |
| `logistika-jerab.jpg` | Realizace, krok 2 | 3:2 |
| `realizace-zahrada.jpg` | Realizace | 3:2 |
| `zakladatele.jpg` | Příběh | 4:5 |
| `showroom-trebiz.jpg` | Showroom | 16:9 |
| `exponat-watereri.jpg`, `exponat-hetzii.jpg`, `exponat-glauca.jpg`, `exponat-carpinus.jpg`, `exponat-mops.jpg`, `exponat-negishi.jpg`, `exponat-nigra.jpg`, `exponat-mintjulep.jpg`, `exponat-kaizuka.jpg` | Exponáty (konkrétní kusy) | 4:5 |
| `og-cover.jpg` | Náhled při sdílení odkazu | 1200×630 px |

Doporučení: JPG, delší strana 2400 px, kvalita 80 %, ideálně do 400 kB (zmenšíte zdarma na squoosh.app).

## Přepínače v `script.js` (sekce KONFIGURACE)
| Nastavení | Co dělá |
|---|---|
| `FORM_ENDPOINT` | Adresa formuláře z formspree.io. Poptávky pak chodí rovnou do e-mailu. |
| `BOOKING_URL` | Odkaz na plánování schůzek z Google Kalendáře. Zobrazí tlačítka „Rezervovat prohlídku“. |
| `CF_ANALYTICS_TOKEN` | Token Cloudflare Web Analytics. Měření bez cookies, jen na ostré doméně. |
| `EXPONATY` | Nejcennější kusy na úvodní stránce (9 tvarovaných stromů s fotkami a rozměry z ceníku). Pořadí v poli = pořadí na webu, `feature: true` = velká karta. Vlastní fotka `assets/images/exponat-<id>.jpg` má přednost. |
| `REFERENCES` | Seznam projektů. Sekce Reference se ukáže po přidání prvního. Jen se souhlasem klienta. |

U položek katalogu můžete doplnit `height`, `width`, `rootball`, `age` (rozměry konkrétního kusu). Zobrazí se v detailu.

## Co doplnit před spuštěním
1. **Ceny:** u dostupnějších položek přepište `price: "Orientační cena na dotaz"` na skutečné rozmezí, např. `"od 4 500 Kč"`.
2. **Dostupnost:** `status: "stock"` (Skladem v Třebízi) nebo `"order"` (Na zakázku).
3. **Formuláře:** bez nastavení otevírají e-mail s předvyplněnou zprávou. Pro odesílání přímo z webu založte zdarma formulář na formspree.io a vložte jeho URL do `FORM_ENDPOINT`.
4. **B2B e-mail:** doporučuji `michal@bambuscentrum.cz` místo gmailu. Stačí změnit `EMAIL_B2B` a dva odkazy v `index.html`.
5. **Ověřit v `index.html`:** otevírací dobu sezóny 2027 a to, zda je sjezd z D7 do Třebíze stále uzavřený.

## Lokální náhled
Stačí dvakrát kliknout na `index.html`.

## Nasazení na GitHub Pages
```bash
cd web_bambus_centrum
git init && git add . && git commit -m "Web Bambus Centrum Kastner"
gh repo create bambus-centrum-web --private --source=. --push
gh api -X POST repos/{owner}/bambus-centrum-web/pages -f "source[branch]=main" -f "source[path]=/"
```
GitHub Pages u **soukromého** repozitáře vyžaduje placený účet GitHub Pro. Na bezplatném účtu musí být repozitář veřejný.
Před přesměrováním domény bambuscentrum.cz se dohodněte s tím, kdo spravuje stávající WordPress.

## Kompletní sortiment
Data jsou převzatá ze starého webu přes WordPress API (21. 11. 2026): 1 395 produktů s popisy a ceníky, galerie a úvodní texty kategorií.
Obnovení dat: v prohlížeči na bambuscentrum.cz znovu vyexportovat `bambus_katalog.json` a spustit
`python tools/build_katalog.py bambus_katalog.json katalog.js`.

**Důležité před přesměrováním domény:** fotky produktů se načítají ze starého webu (`www.bambuscentrum.cz/wp-content/uploads/`).
Až doména bambuscentrum.cz povede na nový web, ponechte starý WordPress na subdoméně (např. `archiv.bambuscentrum.cz`)
a v `katalog.js` změňte hodnotu `base`. Jinak fotky v sortimentu zmizí.

## Osobní odkazy pro partnery
Interní stránka `odkaz.html` (není odkázaná z webu a je skrytá před vyhledávači). Zadáte název studia a dostanete odkaz `index.html?pro=Studio&typ=architekt` a hotovou zprávu po hovoru a pro první e-mail.
Web pak partnera osloví jménem, předvyplní firmu ve formulářích a poptávky přijdou s označením „Osobní odkaz: Studio“.
Kdo odkaz otevřel, uvidíte až po zapnutí měření (`CF_ANALYTICS_TOKEN`).

## Skrytí před vyhledávači
Všechny stránky mají `<meta name="robots" content="noindex, nofollow">`. Po schválení a přepnutí domény ho z index.html, sortiment.html a jejich anglických verzí smažte (v odkaz.html ho nechte).
