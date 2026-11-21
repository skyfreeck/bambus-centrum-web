/* =========================================================
   Bambus Centrum Kastner — script.js
   Vše, co budete upravovat, je nahoře: KONFIGURACE, FOTKY, KATALOG, REFERENCE.
   ========================================================= */

/* ---------------- KONFIGURACE ---------------- */
const CONFIG = {
  // Formuláře. Prázdné = otevře se e-mail s předvyplněnou zprávou (mailto).
  // Po založení formuláře na formspree.io sem vložte jeho adresu, např. "https://formspree.io/f/abcdwxyz".
  FORM_ENDPOINT: "https://formspree.io/f/xgakldyz",
  EMAIL_B2B: "michal.kastner08@gmail.com",
  EMAIL_SHOWROOM: "info@bambuscentrum.cz",

  // Rezervace prohlídky. Odkaz na plánování schůzek z Google Kalendáře (calendar.app.google/...).
  // Prázdné = tlačítka rezervace se nezobrazí.
  BOOKING_URL: "https://calendar.app.google/KzX3yhopVRBt6NFf8",

  // Měření návštěvnosti bez cookies (Cloudflare Web Analytics). Vložte token, prázdné = vypnuto.
  CF_ANALYTICS_TOKEN: "",

  // Na ostré doméně skrýt karty katalogu, ke kterým ještě není fotka.
  HIDE_EMPTY_ITEMS: true,

  // Dokud nejsou v assets/images vlastní fotky, použije se dočasně fotka ze stávajícího webu.
  USE_LIVE_FALLBACK: true,
  LIVE_BASE: "https://www.bambuscentrum.cz/wp-content/",
  IMAGE_DIR: "assets/images/",
};

/* ---------------- FOTKY ----------------
   file = název souboru v assets/images/ (uložte ho tam a fotka se ukáže bez úpravy kódu)
   live = dočasná náhrada ze stávajícího webu (nebo null)
   hint = co má být na fotce (zobrazí se v zástupném rámci jen v náhledu)          */
const IMAGES = {
  hero:        { file: "hero-niwaki.jpg",          live: "gallery/tvarovane-stromy/pinus-parviflora-24.jpg", hint: "Jeden niwaki jako socha, klidné pozadí, na výšku 4:5" },
  logistika:   { file: "logistika-jerab.jpg",      live: "gallery/realizace/realizace-1.jpg",               hint: "Jeřáb usazuje solitér s balem, 3:2" },
  realizace:   { file: "realizace-zahrada.jpg",    live: "gallery/realizace/realizace-9.jpg",               hint: "Hotová výsadba u architektonického domu, 3:2" },
  zakladatele: { file: "zakladatele.jpg",          live: null,                                              hint: "Vlastimil a Jiřina Kastnerovi mezi stromy v Třebízi, 4:5" },
  showroom:    { file: "showroom-trebiz.jpg",      live: "uploads/2015/05/Slider-Na%C5%A1e-zahradnictv%C3%AD.jpg", hint: "Areál Třebíz ve zlaté hodině, ideálně z dronu, 16:9" },

  "niwaki-pinus":    { file: "niwaki-pinus.jpg",          live: "gallery/tvarovane-stromy/pinus-parviflora-10.jpg", hint: "Borovice niwaki, neutrální pozadí, 4:5" },
  "niwaki-taxus":    { file: "niwaki-taxus.jpg",          live: "gallery/tvarovane-stromy/taxus-1.jpg",             hint: "Tvarovaný tis, neutrální pozadí, 4:5" },
  "niwaki-jalovec":  { file: "niwaki-jalovec.jpg",        live: null, hint: "Tvarovaný jalovec, detail patra, 4:5" },
  "listnace":        { file: "tvarovane-listnace.jpg",    live: null, hint: "Tvarovaná azalka nebo kdoulovec v květu, 4:5" },
  "monument":        { file: "solitery-monumentalni.jpg", live: null, hint: "Největší solitér v areálu, člověk pro měřítko, 4:5" },
  "sekvojovec":      { file: "sekvojovec.jpg",            live: null, hint: "Sequoiadendron 'Glaucum', celá silueta, 4:5" },
  "kameny":          { file: "kameny-lucerny.jpg",        live: null, hint: "Kamenná lucerna a solitérní kámen, boční světlo, 4:5" },
  "bambus-fargesia": { file: "bambus-fargesia.jpg",       live: null, hint: "Trsnatý bambus, detail stébel a listů, 4:5" },
  "bambus-phyllo":   { file: "bambus-phyllostachys.jpg",  live: null, hint: "Vysoký bambus jako clona, protisvětlo, 4:5" },
  "javor":           { file: "javor-acer-palmatum.jpg",   live: null, hint: "Japonský javor v podzimním vybarvení, 4:5" },
  "pivonka":         { file: "pivonka-drevita.jpg",       live: null, hint: "Dřevitá pivoňka v květu, 4:5" },
  "chamaecyparis":   { file: "chamaecyparis.jpg",         live: "uploads/2025/03/Chamaecyparis-obtusa-JR-768x576.jpg", hint: "Cypřišek tupolistý, 4:5" },
  "cryptomeria":     { file: "cryptomeria.jpg",           live: "uploads/2017/01/Cryptomeria-japonica-Dacrydioides-1-768x576.jpg", hint: "Kryptomerie, 4:5" },
  "sourcing":        { file: "sourcing-japonsko.jpg",     live: "uploads/2015/01/113_0059.jpg", hint: "Výběr u pěstitele v Japonsku, 4:5" },
};

/* ---------------- KATALOG ----------------
   cat:    niwaki | solitery | bambusy | drevinny | sourcing
   status: "stock" (Skladem v Třebízi) | "order" (Na zakázku)
   price:  text ceny. U dostupnějších položek doplňte rozmezí, např. "od 4 500 Kč".
   Nepovinné pro konkrétní kus: height (výška), width (šířka koruny), rootball (bal), age (stáří).
   en:     anglický text pro anglickou verzi webu.                                        */
const CATALOG = [
  { id: "pinus", cat: "niwaki", img: "niwaki-pinus", status: "stock",
    latin: "Pinus parviflora", cz: "Borovice drobnokvětá, niwaki",
    size: "Od menších kusů k domu po vzrostlé solitéry", origin: "Pěstitelé ze severního Japonska",
    price: "Individuální ocenění",
    desc: "Nejklasičtější tvar japonské zahrady: husté polštáře jehlic na ručně vedených větvích. Každý kus tvarovali pěstitelé v Japonsku po mnoho let, proto je každý jiný. Konkrétní kusy vám ukážeme v Třebízi nebo pošleme fotografie.",
    en: { name: "Japanese white pine, niwaki", size: "From smaller garden pieces to mature specimens", origin: "Growers in northern Japan", price: "Priced individually",
      desc: "The most classic form of the Japanese garden: dense pads of needles on hand-trained branches. Each piece was shaped by growers in Japan over many years, so no two are alike. We will show you specific pieces in Třebíz or send photographs." } },
  { id: "taxus", cat: "niwaki", img: "niwaki-taxus", status: "stock",
    latin: "Taxus", cz: "Tis, tvarovaný solitér",
    size: "Dle konkrétního kusu", origin: "Japonsko a evropské pěstírny",
    price: "Individuální ocenění",
    desc: "Tis snáší stín i pravidelný střih lépe než většina jehličnanů. Vhodný do vstupních prostor, atrií a k vodním plochám.",
    en: { name: "Yew, shaped specimen", size: "Depends on the individual piece", origin: "Japan and European nurseries", price: "Priced individually",
      desc: "Yew tolerates shade and regular clipping better than most conifers. Well suited to entrances, atriums and water features." } },
  { id: "juniperus", cat: "niwaki", img: "niwaki-jalovec", status: "stock",
    latin: "Juniperus", cz: "Jalovec, tvarovaný do pater",
    size: "Dle konkrétního kusu", origin: "Pěstitelé ze severního Japonska",
    price: "Individuální ocenění",
    desc: "Jemná modrozelená textura a výrazně sochařská kresba kmene. Dobře snáší slunné a sušší stanoviště.",
    en: { name: "Juniper, cloud-pruned", size: "Depends on the individual piece", origin: "Growers in northern Japan", price: "Priced individually",
      desc: "Fine blue-green texture and a strongly sculptural trunk. Copes well with sunny, drier positions." } },
  { id: "listnace", cat: "niwaki", img: "listnace", status: "stock",
    latin: "Rhododendron, Chaenomeles, Styrax", cz: "Tvarované listnáče: azalky, kdoulovce, styraxy",
    size: "Menší a střední kusy", origin: "Japonsko",
    price: "Orientační cena na dotaz",
    desc: "Tvarované stromy, které navíc kvetou. Ideální tam, kde chcete sezónní proměnu místo celoročně stejného obrazu.",
    en: { name: "Shaped flowering shrubs: azaleas, quinces, snowbells", size: "Small and medium pieces", origin: "Japan", price: "Price on request",
      desc: "Shaped trees that also flower. Ideal where you want the garden to change with the seasons." } },

  { id: "monument", cat: "solitery", img: "monument", status: "order",
    latin: "Vícekmenné a monumentální solitéry", cz: "Exponáty pro vstupní prostory a nádvoří",
    size: "Velké rozměry, upřesníme podle projektu", origin: "Japonsko, Nizozemsko, Německo, Belgie",
    price: "Individuální ocenění",
    desc: "Strom, kolem kterého se navrhuje celý prostor. Vybíráme podle vaší vizualizace, s fotografií a rozměry každého kusu, a dodáváme včetně jeřábu a výsadby.",
    en: { latin: "Multi-stem and monumental specimens", name: "Centrepieces for entrances and courtyards", size: "Large sizes, specified per project", origin: "Japan, the Netherlands, Germany, Belgium", price: "Priced individually",
      desc: "A tree the whole space is designed around. We select to match your visualisation, with a photograph and dimensions of every piece, and deliver including crane and planting." } },
  { id: "sekvojovec", cat: "solitery", img: "sekvojovec", status: "stock",
    latin: "Sequoiadendron giganteum ‘Glaucum’", cz: "Sekvojovec obrovský, modrá forma",
    size: "Dle aktuální nabídky", origin: "Evropské pěstírny",
    price: "Orientační cena na dotaz",
    desc: "Úzký modrošedý sloup, který roste rychle a dlouho. Výrazná vertikála pro velké pozemky.",
    en: { name: "Giant sequoia, blue form", size: "Subject to current stock", origin: "European nurseries", price: "Price on request",
      desc: "A narrow blue-grey column that grows fast and for a very long time. A strong vertical accent for large plots." } },
  { id: "kameny", cat: "solitery", img: "kameny", status: "stock",
    latin: "Kamenné lucerny a solitérní kameny", cz: "Doplňky japonské zahrady",
    size: "Dle konkrétního kusu", origin: "Asie",
    price: "Orientační cena na dotaz",
    desc: "Přírodní asijské kameny a ručně tesané lucerny. Dávají zahradě měřítko a klid i v zimě.",
    en: { latin: "Stone lanterns and specimen stones", name: "Japanese garden elements", size: "Depends on the individual piece", origin: "Asia", price: "Price on request",
      desc: "Natural Asian stones and hand-carved lanterns. They give a garden scale and calm, even in winter." } },

  { id: "fargesia", cat: "bambusy", img: "bambus-fargesia", status: "stock",
    latin: "Fargesia", cz: "Trsnatý bambus bez výběžků",
    size: "Kontejnery různých velikostí", origin: "Evropské pěstírny",
    price: "Orientační cena na dotaz",
    desc: "Nerozrůstá se do okolí, proto se hodí k terasám, do nádob i jako nízká clona. Patří k nejmrazuvzdornějším bambusům.",
    en: { name: "Clumping bamboo, non-invasive", size: "Various container sizes", origin: "European nurseries", price: "Price on request",
      desc: "It does not spread, so it suits terraces, containers and low screens. One of the most frost-hardy bamboos." } },
  { id: "phyllostachys", cat: "bambusy", img: "bambus-phyllo", status: "stock",
    latin: "Phyllostachys", cz: "Výběžkatý bambus pro vysoké clony",
    size: "Kontejnery různých velikostí", origin: "Evropské pěstírny",
    price: "Orientační cena na dotaz",
    desc: "Vysoká stébla a rychlý efekt. Vysazujeme s kořenovou bariérou, kterou dodáme i nainstalujeme. S bambusy začínala celá naše firma v roce 1993.",
    en: { name: "Running bamboo for tall screens", size: "Various container sizes", origin: "European nurseries", price: "Price on request",
      desc: "Tall culms and a fast result. Planted with a root barrier, which we supply and install. Bamboo is where our company started in 1993." } },

  { id: "acer", cat: "drevinny", img: "javor", status: "stock",
    latin: "Acer palmatum", cz: "Javor dlanitolistý",
    size: "Od zakrslých po stromovité kultivary", origin: "Evropské pěstírny a Japonsko",
    price: "Orientační cena na dotaz",
    desc: "Široký výběr kultivarů s odlišnou barvou listu a podzimním vybarvením. Vybereme podle stanoviště a velikosti zahrady.",
    en: { name: "Japanese maple", size: "From dwarf to tree-sized cultivars", origin: "European nurseries and Japan", price: "Price on request",
      desc: "A wide choice of cultivars with different leaf colour and autumn colour. We choose to suit the position and size of your garden." } },
  { id: "chamaecyparis", cat: "drevinny", img: "chamaecyparis", status: "stock",
    latin: "Chamaecyparis obtusa", cz: "Cypřišek tupolistý",
    size: "Dle aktuální nabídky", origin: "Evropské pěstírny",
    price: "Orientační cena na dotaz",
    desc: "Japonský jehličnan s vějířovitými větvičkami. Pomalu roste a drží kompaktní tvar.",
    en: { name: "Hinoki cypress", size: "Subject to current stock", origin: "European nurseries", price: "Price on request",
      desc: "A Japanese conifer with fan-shaped sprays. Slow-growing and naturally compact." } },
  { id: "cryptomeria", cat: "drevinny", img: "cryptomeria", status: "stock",
    latin: "Cryptomeria japonica ‘Dacrydioides’", cz: "Kryptomerie japonská",
    size: "Dle aktuální nabídky", origin: "Evropské pěstírny",
    price: "Orientační cena na dotaz",
    desc: "Neobvyklá převislá forma s dlouhými provazovitými větvemi. Pro zahrady, kde má být jeden nečekaný prvek.",
    en: { name: "Japanese cedar", size: "Subject to current stock", origin: "European nurseries", price: "Price on request",
      desc: "An unusual weeping form with long, rope-like branches. For gardens that need one unexpected element." } },
  { id: "paeonia", cat: "drevinny", img: "pivonka", status: "stock",
    latin: "Paeonia", cz: "Dřevité pivoňky",
    size: "Kontejnery různých velikostí", origin: "Evropské a asijské pěstírny",
    price: "Orientační cena na dotaz",
    desc: "Keřové pivoňky s velkými květy, které na rozdíl od trvalkových nezatahují. Kvetou v květnu.",
    en: { name: "Tree peonies", size: "Various container sizes", origin: "European and Asian nurseries", price: "Price on request",
      desc: "Shrubby peonies with large flowers that, unlike herbaceous peonies, keep their woody frame through winter. They flower in May." } },

  { id: "sourcing", cat: "sourcing", img: "sourcing", status: "order",
    latin: "Strom podle vaší vizualizace", cz: "Individuální sourcing ze zahraničí",
    size: "Podle projektu", origin: "Japonsko, Nizozemsko, Německo, Belgie",
    price: "Individuální ocenění",
    desc: "Pošlete vizualizaci, výkres nebo jen fotografii místa. Najdeme konkrétní kusy u pěstitelů, pošleme fotografie s rozměry a zajistíme dovoz, výsadbu i péči.",
    en: { latin: "A tree to match your visualisation", name: "Individual sourcing from abroad", size: "Per project", origin: "Japan, the Netherlands, Germany, Belgium", price: "Priced individually",
      desc: "Send a visualisation, a drawing or just a photo of the site. We find specific pieces at the growers, send photographs with dimensions and handle import, planting and aftercare." } },
];

/* ---------------- REFERENCE ----------------
   Sekce Reference se na webu ukáže, jakmile sem přidáte alespoň jeden projekt.
   Uvádějte jen projekty se souhlasem klienta. Bez adresy a bez jmen soukromých osob.
   Příklad:
   { img: "reference-1.jpg", type: "Soukromá rezidence", place: "Praha 6", tree: "Pinus parviflora, niwaki",
     task: "Solitér do atria, přístup jen jeřábem přes střechu.",
     en: { type: "Private residence", place: "Prague 6", task: "Specimen for an atrium, crane access over the roof only." } },  */
const REFERENCES = [];

/* =========================================================
   Nic níže není potřeba upravovat.
   ========================================================= */
const LANG = document.documentElement.lang === "en" ? "en" : "cs";
const ROOT = document.documentElement.dataset.root || "";
// Náhled (rámečky s názvy fotek, štítek dočasných fotek): lokální soubor, localhost, nebo adresa s ?nahled=1
const isPreview = ["file:", ""].includes(location.protocol) || /localhost|127\.0\.0\.1/.test(location.hostname) || new URLSearchParams(location.search).has("nahled");
document.documentElement.classList.add("js");

const T = {
  cs: {
    status: { stock: "Skladem v Třebízi", order: "Na zakázku, dovoz z JP, NL, DE, BE" },
    open: "Detail a poptávka",
    live: "Dočasná fotka z bambuscentrum.cz",
    phHow: "Uložte fotku pod tímto názvem do složky assets/images. Zobrazí se automaticky.",
    interest: (a, b) => `Mám zájem o: ${a} (${b}).\n`,
    submitVisit: "Domluvit prohlídku", submit: "Odeslat poptávku",
    errConsent: "Pro odeslání potvrďte souhlas se zpracováním údajů.",
    errEmail: "Doplňte e-mail ve tvaru jmeno@domena.cz.",
    errField: (l) => `Doplňte pole ${l || "označené červeně"}.`,
    okPortfolio: "Děkujeme. Portfolio vám pošleme do jednoho pracovního dne.",
    ok: "Děkujeme. Ozveme se vám do jednoho pracovního dne.",
    fail: "Zprávu se nepodařilo odeslat. Zavolejte nám prosím na +420 732 154 491.",
    mailto: "Otevírám váš e-mail s předvyplněnou zprávou. Stačí ji odeslat.",
    subjPortfolio: (x) => `Žádost o B2B portfolio: ${x}`,
    subjVisit: "Soukromá prohlídka", subjInquiry: "Poptávka",
    roles: { private: "Vlastní zahrada", architect: "Architekt / designér", developer: "Developer / hotel / VIP projekt" },
    labels: { jmeno: "Jméno", firma: "Firma / studio", email: "E-mail", telefon: "Telefon", typ_projektu: "Typ projektu",
      zajem: "Zájem", lokalita_zahrady: "Lokalita zahrady", faze_projektu: "Fáze projektu", termin_vysadby: "Plánovaná výsadba",
      rozpocet: "Rozpočet na zeleň", lokalita_projektu: "Lokalita projektu", zprava: "Zpráva",
      prohlidka: "Soukromá prohlídka", termin_prohlidky: "Preferovaný termín", role: "Role" },
    dims: { height: "Výška", width: "Šířka koruny", rootball: "Bal", age: "Stáří" },
    refEmpty: "Náhled: sekce se zobrazí, až v script.js doplníte REFERENCES.",
  },
  en: {
    status: { stock: "In stock at Třebíz", order: "Made to order, sourced from JP, NL, DE, BE" },
    open: "Details and enquiry",
    live: "Temporary photo from bambuscentrum.cz",
    phHow: "Save a photo under this name in assets/images. It will appear automatically.",
    interest: (a, b) => `I am interested in: ${a} (${b}).\n`,
    submitVisit: "Arrange a visit", submit: "Send enquiry",
    errConsent: "Please confirm consent to data processing to send the form.",
    errEmail: "Please enter an e-mail address such as name@company.com.",
    errField: (l) => `Please fill in ${l || "the field marked in red"}.`,
    okPortfolio: "Thank you. We will send the portfolio within one working day.",
    ok: "Thank you. We will get back to you within one working day.",
    fail: "The message could not be sent. Please call us on +420 603 244 941.",
    mailto: "Opening your e-mail with a pre-filled message. Just press send.",
    subjPortfolio: (x) => `B2B portfolio request: ${x}`,
    subjVisit: "Private visit", subjInquiry: "Enquiry",
    roles: { private: "Own garden", architect: "Architect / designer", developer: "Developer / hotel / VIP project" },
    labels: { jmeno: "Name", firma: "Company / studio", email: "E-mail", telefon: "Phone", typ_projektu: "Project type",
      zajem: "Interest", lokalita_zahrady: "Garden location", faze_projektu: "Project stage", termin_vysadby: "Planned planting",
      rozpocet: "Planting budget", lokalita_projektu: "Project location", zprava: "Message",
      prohlidka: "Private visit", termin_prohlidky: "Preferred date", role: "Role" },
    dims: { height: "Height", width: "Crown width", rootball: "Root ball", age: "Age" },
    refEmpty: "Preview: this section appears once REFERENCES are filled in script.js.",
  },
}[LANG];

/* Texty položky v aktuálním jazyce */
const tx = (it) => (LANG === "en" && it.en
  ? { latin: it.en.latin || it.latin, name: it.en.name, size: it.en.size, origin: it.en.origin, price: it.en.price, desc: it.en.desc }
  : { latin: it.latin, name: it.cz, size: it.size, origin: it.origin, price: it.price, desc: it.desc });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------------- Měření návštěvnosti (bez cookies) ---------------- */
if (CONFIG.CF_ANALYTICS_TOKEN && !isPreview) {
  const s = document.createElement("script");
  s.defer = true;
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.dataset.cfBeacon = JSON.stringify({ token: CONFIG.CF_ANALYTICS_TOKEN });
  document.head.appendChild(s);
}

/* ---------------- Fotky: místní soubor → dočasná živá fotka → zástupný rámec ---------------- */
function loadPhoto(el, key, onDone) {
  const def = IMAGES[key];
  el.innerHTML = "";
  el.classList.remove("is-placeholder", "is-live");
  if (!def) return;
  const sources = [{ src: ROOT + CONFIG.IMAGE_DIR + def.file, live: false }];
  if (CONFIG.USE_LIVE_FALLBACK && def.live) sources.push({ src: CONFIG.LIVE_BASE + def.live, live: true });

  const tryNext = (i) => {
    if (i >= sources.length) { showPlaceholder(el, def); onDone && onDone(false); return; }
    const img = new Image();
    img.alt = el.dataset.alt || "";
    img.decoding = "async";
    img.onload = () => {
      el.innerHTML = "";
      el.appendChild(img);
      if (sources[i].live && isPreview) { el.classList.add("is-live"); el.dataset.liveLabel = T.live; }
      onDone && onDone(true);
    };
    img.onerror = () => tryNext(i + 1);
    img.src = sources[i].src;
  };
  tryNext(0);
}

function showPlaceholder(el, def) {
  el.classList.add("is-placeholder");
  el.innerHTML = isPreview
    ? `<div class="ph-inner"><p class="ph-file">assets/images/${def.file}</p><p class="ph-hint">${def.hint}</p><p class="ph-how">${T.phHow}</p></div>`
    : "";
}

/* Fotky se načítají, až když se k nim návštěvník doscrolluje. */
const photoIO = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { photoIO.unobserve(en.target); loadPhoto(en.target, en.target.dataset.img, en.target._onDone); }
    }), { rootMargin: "600px 0px" })
  : null;
const queuePhoto = (el) => (photoIO ? photoIO.observe(el) : loadPhoto(el, el.dataset.img, el._onDone));

/* ---------------- Katalog ---------------- */
const catalogEl = document.querySelector("[data-catalog]");
function renderCatalog() {
  catalogEl.innerHTML = CATALOG.map((it) => {
    const t = tx(it);
    return `
    <li class="item" data-cat="${it.cat}" data-id="${it.id}">
      <div class="photo ratio-4x5" data-img="${it.img}" data-alt="${esc(t.latin)}, ${esc(t.name)}"></div>
      <div class="plaque">
        <p class="plaque-latin">${esc(t.latin)}</p>
        <p class="plaque-cz">${esc(t.name)}</p>
        <span class="item-status ${it.status === "order" ? "is-order" : ""}">${T.status[it.status]}</span>
        <p class="item-facts">${esc(it.height ? `${T.dims.height} ${it.height}` : t.size)}</p>
        <p class="item-price">${esc(t.price)}</p>
        <button class="item-open" type="button" data-open="${it.id}">${T.open}<span class="sr">: ${esc(t.latin)}</span></button>
      </div>
    </li>`;
  }).join("");
  const photos = catalogEl.querySelectorAll("[data-img]");
  let pending = photos.length;
  photos.forEach((el) => {
    // Na ostré doméně schovat karty bez fotky (a filtry, ve kterých pak nic nezbude)
    const hide = CONFIG.HIDE_EMPTY_ITEMS && !isPreview;
    loadPhoto(el, el.dataset.img, (ok) => {
      if (hide && !ok) el.closest(".item").classList.add("is-empty");
      if (--pending === 0 && hide) {
        document.querySelectorAll("[data-filter]").forEach((b) => {
          const f = b.dataset.filter;
          if (f !== "vse") b.hidden = !catalogEl.querySelector(`.item[data-cat="${f}"]:not(.is-empty)`);
        });
      }
    });
  });
}
renderCatalog();
document.querySelectorAll("main [data-img]:not(.catalog [data-img])").forEach(queuePhoto);

document.querySelector("[data-filters]").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;
  const f = btn.dataset.filter;
  btn.parentElement.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
  catalogEl.querySelectorAll(".item").forEach((li) => li.classList.toggle("is-hidden", f !== "vse" && li.dataset.cat !== f));
});

/* ---------------- Detail stromu (modal) ---------------- */
const modal = document.querySelector("[data-modal]");
let current = null;
catalogEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-open]");
  if (!btn) return;
  current = CATALOG.find((x) => x.id === btn.dataset.open);
  if (!current) return;
  const t = tx(current);
  const set = (k, v) => (modal.querySelector(`[data-m="${k}"]`).textContent = v);
  set("latin", t.latin); set("cz", t.name); set("status", T.status[current.status]);
  set("size", t.size); set("origin", t.origin); set("price", t.price); set("desc", t.desc);
  const extra = modal.querySelector("[data-m-extra]");
  extra.innerHTML = ["height", "width", "rootball", "age"].filter((k) => current[k])
    .map((k) => `<div><dt>${T.dims[k]}</dt><dd>${esc(current[k])}</dd></div>`).join("");
  loadPhoto(modal.querySelector("[data-modal-photo]"), current.img);
  modal.showModal();
});
modal.querySelector("[data-modal-close]").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
modal.querySelector("[data-modal-inquire]").addEventListener("click", () => {
  modal.close();
  const t = tx(current);
  const form = document.querySelector('[data-form="concierge"]');
  const msg = form.querySelector("[data-message]");
  msg.value = T.interest(t.latin, t.name) + (msg.value || "");
  document.querySelector("#concierge").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => form.querySelector("#c-jmeno").focus({ preventScroll: true }), 600);
});

/* ---------------- Reference ---------------- */
const refSection = document.querySelector("[data-references]");
if (refSection) {
  const list = refSection.querySelector("[data-ref-list]");
  if (REFERENCES.length) {
    list.innerHTML = REFERENCES.map((r, i) => {
      const L = LANG === "en" && r.en ? { ...r, ...r.en } : r;
      IMAGES["ref-" + i] = { file: r.img, live: null, hint: "Fotka reference" };
      return `<li class="ref">
        <div class="photo ratio-3x2" data-img="ref-${i}" data-alt="${esc(L.type)}, ${esc(L.place)}"></div>
        <p class="ref-type">${esc(L.type)}, ${esc(L.place)}</p>
        <p class="plaque-latin">${esc(r.tree)}</p>
        <p class="ref-task">${esc(L.task)}</p>
      </li>`;
    }).join("");
    list.querySelectorAll("[data-img]").forEach(queuePhoto);
    refSection.hidden = false;
  } else if (isPreview) {
    list.innerHTML = `<li class="note">${T.refEmpty}</li>`;
    refSection.hidden = false;
  }
}

/* ---------------- Rezervace prohlídky ---------------- */
document.querySelectorAll("[data-booking]").forEach((a) => {
  if (!CONFIG.BOOKING_URL) return;
  a.href = CONFIG.BOOKING_URL;
  a.target = "_blank";
  a.rel = "noopener";
  a.hidden = false;
});

/* ---------------- Concierge: 3 role ---------------- */
const cForm = document.querySelector('[data-form="concierge"]');
const submitBtn = cForm.querySelector("[data-submit]");
const visitToggle = cForm.querySelector("[data-visit-toggle]");
const visitDate = cForm.querySelector("[data-visit-date]");

function applyRole(role) {
  cForm.querySelectorAll("[data-for]").forEach((el) => {
    const show = el.dataset.for.split(" ").includes(role);
    el.hidden = !show;
    el.querySelectorAll("input, select, textarea").forEach((f) => (f.disabled = !show));
  });
  updateSubmit();
}
function updateSubmit() {
  submitBtn.textContent = visitToggle.checked ? T.submitVisit : T.submit;
  visitDate.hidden = !visitToggle.checked;
}
cForm.addEventListener("change", (e) => {
  if (e.target.name === "role") applyRole(e.target.value);
  if (e.target === visitToggle) updateSubmit();
});
document.querySelectorAll("[data-role-link]").forEach((a) =>
  a.addEventListener("click", () => {
    const r = cForm.querySelector(`input[name="role"][value="${a.dataset.roleLink}"]`);
    if (r) { r.checked = true; applyRole(r.value); }
    if (a.dataset.roleLink === "private") { visitToggle.checked = true; updateSubmit(); }
  })
);
applyRole(cForm.querySelector('input[name="role"]:checked').value);

/* Předvyplnění z odkazu (např. ze stránky Kompletní sortiment): ?poptavka=...  ?prohlidka=1 */
const params = new URLSearchParams(location.search);
if (params.get("poptavka")) {
  const msg = cForm.querySelector("[data-message]");
  msg.value = (LANG === "en" ? "I am interested in: " : "Mám zájem o: ") + params.get("poptavka") + "\n";
}
if (params.get("prohlidka")) { visitToggle.checked = true; updateSubmit(); }

/* ---------------- Odeslání formulářů ---------------- */
function validate(form) {
  let firstBad = null;
  form.querySelectorAll("[required]").forEach((f) => {
    if (f.disabled) return;
    const ok = f.type === "checkbox" ? f.checked : f.type === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()) : f.value.trim().length > 1;
    f.setAttribute("aria-invalid", String(!ok));
    if (!ok && !firstBad) firstBad = f;
  });
  return firstBad;
}
function messageFor(field) {
  if (field.type === "checkbox") return T.errConsent;
  if (field.type === "email") return T.errEmail;
  const label = field.closest(".field")?.querySelector("label")?.textContent.replace(/\(.*\)/, "").trim();
  return T.errField(label);
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const status = form.querySelector("[data-status]");
  status.className = "form-status";
  const bad = validate(form);
  if (bad) { status.textContent = messageFor(bad); status.classList.add("is-error"); bad.focus(); return; }

  const data = Object.fromEntries([...new FormData(form)].filter(([k, v]) => k !== "souhlas" && String(v).trim() !== ""));
  const isPortfolio = form.dataset.form === "portfolio";
  const role = isPortfolio ? "b2b" : data.role;
  const to = isPortfolio || role !== "private" ? CONFIG.EMAIL_B2B : CONFIG.EMAIL_SHOWROOM;
  const subject = (LANG === "en" ? "[EN] " : "") + (isPortfolio
    ? T.subjPortfolio(data.firma || data.jmeno)
    : `${data.prohlidka ? T.subjVisit : T.subjInquiry} (${T.roles[role]}): ${data.jmeno}`);
  if (data.role) data.role = T.roles[data.role];

  if (CONFIG.FORM_ENDPOINT) {
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    try {
      const res = await fetch(CONFIG.FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _subject: subject, email: data.email, prijemce: to, jazyk: LANG, ...data }),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      if (!isPortfolio) applyRole("private");
      status.textContent = isPortfolio ? T.okPortfolio : T.ok;
      status.classList.add("is-ok");
    } catch {
      status.textContent = T.fail;
      status.classList.add("is-error");
    } finally {
      btn.disabled = false;
    }
    return;
  }

  const body = Object.entries(data).map(([k, v]) => `${T.labels[k] || k}: ${v}`).join("\n");
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = T.mailto;
  status.classList.add("is-ok");
}
document.querySelectorAll("[data-form]").forEach((f) => {
  f.addEventListener("submit", handleSubmit);
  f.addEventListener("input", (e) => { if (e.target.getAttribute("aria-invalid") === "true") e.target.setAttribute("aria-invalid", "false"); });
});

/* ---------------- Navigace ---------------- */
const head = document.querySelector("[data-head]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");
const setNav = (open) => { nav.classList.toggle("is-open", open); toggle.setAttribute("aria-expanded", String(open)); };
toggle.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });
addEventListener("scroll", () => head.classList.toggle("is-scrolled", scrollY > 8), { passive: true });

/* ---------------- Scroll reveal ---------------- */
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const targets = document.querySelectorAll(".section-head, .facts-list li, .values > div, .process li, .process-photos .exhibit, .story-grid > *, .roles, .showroom-grid > *, .faq, .contacts, .lead-form, .ref, .review");
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  targets.forEach((t, i) => { t.classList.add("reveal"); t.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(t); });
}
