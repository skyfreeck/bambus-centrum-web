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
};

/* ---------------- EXPONÁTY ----------------
   Nejcennější kusy na úvodní stránce (data a fotky z ceníku starého webu, 2024).
   img  = klíč do IMAGES (vlastní fotka assets/images/exponat-*.jpg má přednost)
   size = výška a kontejner, price = text ceny (u exponátů záměrně „na vyžádání“)
   feature: true = velká karta. Pořadí v poli = pořadí na webu.                       */
const EXPONATY = [
  { id: "watereri", img: "exp-watereri", feature: true, latin: "Pinus sylvestris ‘Watereri’",
    cz: "Borovice lesní, tvarovaná do pater", en: "Scots pine ‘Watereri’, cloud-pruned",
    size: "250+ cm, kontejner 650 L", sizeEn: "250+ cm, 650 L container",
    desc: "Pomalu rostoucí kultivar borovice lesní s modrozelenými jehlicemi, ručně tvarovaný do pater. S výškou přes 2,5 metru je to vlajková loď naší nabídky: strom, kolem kterého se navrhuje celý prostor.",
    descEn: "A slow-growing Scots pine cultivar with blue-green needles, shaped into tiers by hand. At over 2.5 metres it is the flagship of our range: a tree an entire space is designed around." },
  { id: "hetzii", img: "exp-hetzii", latin: "Juniperus × media ‘Hetzii’",
    cz: "Jalovec prostřední, monumentální solitér", en: "Juniper ‘Hetzii’, monumental specimen",
    size: "350–400 cm, kontejner 750 L", sizeEn: "350–400 cm, 750 L container",
    desc: "Mohutný tvarovaný jalovec s modrozelenou texturou. Výška 3,5 až 4 metry z něj dělá dominantu vstupních prostor a nádvoří.",
    descEn: "A large shaped juniper with blue-green texture. At 3.5 to 4 metres it commands entrances and courtyards." },
  { id: "glauca", img: "exp-glauca", latin: "Pinus parviflora ‘Glauca’",
    cz: "Borovice drobnokvětá, niwaki", en: "Japanese white pine ‘Glauca’, niwaki",
    size: "225+ cm, kontejner 500 L", sizeEn: "225+ cm, 500 L container",
    desc: "Borovice drobnokvětá s modrošedými jehlicemi, klasický strom japonských zahrad. Ručně tvarovaná do pater, výška přes 2,25 metru.",
    descEn: "Japanese white pine with blue-grey needles, a classic of the Japanese garden. Hand-shaped into tiers, over 2.25 metres tall." },
  { id: "carpinus", img: "exp-carpinus", latin: "Carpinus betulus",
    cz: "Habr obecný, tvarovaná koruna", en: "Hornbeam, shaped crown",
    size: "350+ cm, kontejner 1 250 L", sizeEn: "350+ cm, 1,250 L container",
    desc: "Habr s tvarovanou korunou na kmeni, s výškou přes 3,5 metru. Opadavý strom, který dobře snáší i městské prostředí.",
    descEn: "Hornbeam with a shaped crown on a clear stem, over 3.5 metres tall. A deciduous tree that copes well with urban conditions." },
  { id: "mops", img: "exp-mops", latin: "Pinus mugo ‘Mops’",
    cz: "Borovice kleč, tvarovaný solitér", en: "Dwarf mountain pine ‘Mops’",
    size: "160+ cm, kontejner 450 L", sizeEn: "160+ cm, 450 L container",
    desc: "Zakrslý kultivar borovice kleče, který roste velmi pomalu. Kus této velikosti proto představuje mnoho let pěstování a tvarování.",
    descEn: "A dwarf mountain pine cultivar that grows very slowly, so a piece of this size represents many years of growing and shaping." },
  { id: "negishi", img: "exp-negishi", latin: "Pinus parviflora ‘Negishi’",
    cz: "Borovice drobnokvětá, niwaki", en: "Japanese white pine ‘Negishi’, niwaki",
    size: "150–175 cm, kontejner 180 L", sizeEn: "150–175 cm, 180 L container",
    desc: "Kultivar borovice drobnokvěté s modrozelenými jehlicemi, oblíbený u japonských mistrů bonsají. Kompaktní tvar pro atria a menší nádvoří.",
    descEn: "A Japanese white pine cultivar with blue-green needles, favoured by Japanese bonsai masters. A compact form for atriums and smaller courtyards." },
  { id: "nigra", img: "exp-nigra", latin: "Pinus nigra",
    cz: "Borovice černá, tvarovaná do pater", en: "Austrian black pine, cloud-pruned",
    size: "180+ cm, kontejner 240 L", sizeEn: "180+ cm, 240 L container",
    desc: "Borovice černá s tmavě zelenými dlouhými jehlicemi. Velmi odolná vůči mrazu, suchu i městskému prostředí.",
    descEn: "Austrian black pine with long dark green needles. Very tolerant of frost, drought and urban conditions." },
  { id: "mintjulep", img: "exp-mintjulep", latin: "Juniperus × media ‘Mint Julep’",
    cz: "Jalovec prostřední, tvarovaný do pater", en: "Juniper ‘Mint Julep’, cloud-pruned",
    size: "150+ cm, kontejner 180 L", sizeEn: "150+ cm, 180 L container",
    desc: "Jalovec se svěže zelenou, mírně převislou texturou, tvarovaný do pater. Dobře snáší slunce i sucho.",
    descEn: "A juniper with fresh green, gently arching foliage, shaped into tiers. Tolerates sun and drought well." },
  { id: "kaizuka", img: "exp-kaizuka", latin: "Juniperus chinensis ‘Kaizuka’",
    cz: "Jalovec čínský, tvarovaný solitér", en: "Hollywood juniper ‘Kaizuka’",
    size: "175+ cm, kontejner 90 L", sizeEn: "175+ cm, 90 L container",
    desc: "Jalovec čínský s charakteristicky stočenými výhony, které připomínají plameny. Výrazný sochařský solitér.",
    descEn: "A Chinese juniper with characteristic twisting shoots that resemble flames. A striking sculptural specimen." },
];
Object.assign(IMAGES, {
  "exp-watereri":  { file: "exponat-watereri.jpg",  live: "uploads/2024/01/tvarovany-strom-38.jpg", hint: "Pinus sylvestris Watereri, 4:5" },
  "exp-hetzii":    { file: "exponat-hetzii.jpg",    live: "uploads/2024/01/tvarovany-strom-40.jpg", hint: "Juniperus Hetzii, 4:5" },
  "exp-glauca":    { file: "exponat-glauca.jpg",    live: "uploads/2024/01/tvarovany-strom-33.jpg", hint: "Pinus parviflora Glauca, 4:5" },
  "exp-carpinus":  { file: "exponat-carpinus.jpg",  live: "uploads/2024/01/tvarovany-strom-30.jpg", hint: "Carpinus betulus, 4:5" },
  "exp-mops":      { file: "exponat-mops.jpg",      live: "uploads/2024/01/tvarovany-strom-34.jpg", hint: "Pinus mugo Mops, 4:5" },
  "exp-negishi":   { file: "exponat-negishi.jpg",   live: "uploads/2024/01/tvarovany-strom-42.jpg", hint: "Pinus parviflora Negishi, 4:5" },
  "exp-nigra":     { file: "exponat-nigra.jpg",     live: "uploads/2024/01/tvarovany-strom-35.jpg", hint: "Pinus nigra, 4:5" },
  "exp-mintjulep": { file: "exponat-mintjulep.jpg", live: "uploads/2024/01/tvarovany-strom-6.jpg",  hint: "Juniperus Mint Julep, 4:5" },
  "exp-kaizuka":   { file: "exponat-kaizuka.jpg",   live: "uploads/2024/01/tvarovany-strom-43.jpg", hint: "Juniperus Kaizuka, 4:5" },
});

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
    availability: "Ověříme obratem, kus si můžete prohlédnout v Třebízi",
    origin: "Ručně tvarovaný strom z evropské pěstírny",
    price: "Ocenění na vyžádání",
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
      prohlidka: "Soukromá prohlídka", termin_prohlidky: "Preferovaný termín", role: "Role", zdroj: "Zdroj" },
    dims: { height: "Výška", width: "Šířka koruny", rootball: "Bal", age: "Stáří" },
    refEmpty: "Náhled: sekce se zobrazí, až v script.js doplníte REFERENCES.",
  },
  en: {
    status: { stock: "In stock at Třebíz", order: "Made to order, sourced from JP, NL, DE, BE" },
    open: "Details and enquiry",
    availability: "Confirmed on request, view the piece in Třebíz",
    origin: "Hand-shaped tree from a European nursery",
    price: "Price on request",
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
      prohlidka: "Private visit", termin_prohlidky: "Preferred date", role: "Role", zdroj: "Source" },
    dims: { height: "Height", width: "Crown width", rootball: "Root ball", age: "Age" },
    refEmpty: "Preview: this section appears once REFERENCES are filled in script.js.",
  },
}[LANG];

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

/* ---------------- Exponáty ---------------- */
const exhibitsEl = document.querySelector("[data-exhibits]");
const ex = (e) => (LANG === "en" ? { name: e.en, size: e.sizeEn, desc: e.descEn } : { name: e.cz, size: e.size, desc: e.desc });
if (exhibitsEl) {
  exhibitsEl.innerHTML = EXPONATY.map((e) => {
    const t = ex(e);
    return `<li class="exhibit-card${e.feature ? " is-feature" : ""}">
      <button type="button" data-open="${e.id}">
        <span class="photo ratio-4x5" data-img="${e.img}" data-alt="${esc(e.latin)}, ${esc(t.name)}"></span>
        <span class="plaque">
          <span class="plaque-latin">${esc(e.latin)}</span>
          <span class="plaque-cz">${esc(t.name)}</span>
          <span class="exhibit-size">${esc(t.size)}</span>
          ${e.feature ? `<span class="exhibit-desc">${esc(t.desc)}</span>` : ""}
          <span class="exhibit-more">${T.open}</span>
        </span>
      </button>
    </li>`;
  }).join("");
}
document.querySelectorAll("main [data-img]").forEach(queuePhoto);

/* ---------------- Detail exponátu (modal) ---------------- */
const modal = document.querySelector("[data-modal]");
let current = null;
exhibitsEl && exhibitsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-open]");
  if (!btn) return;
  current = EXPONATY.find((x) => x.id === btn.dataset.open);
  if (!current) return;
  const t = ex(current);
  const set = (k, v) => (modal.querySelector(`[data-m="${k}"]`).textContent = v);
  set("latin", current.latin); set("cz", t.name); set("status", T.availability);
  set("size", t.size); set("origin", T.origin); set("price", T.price); set("desc", t.desc);
  modal.querySelector("[data-m-extra]").innerHTML = "";
  loadPhoto(modal.querySelector("[data-modal-photo]"), current.img);
  modal.showModal();
});
modal.querySelector("[data-modal-close]").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
modal.querySelector("[data-modal-inquire]").addEventListener("click", () => {
  modal.close();
  const form = document.querySelector('[data-form="concierge"]');
  const msg = form.querySelector("[data-message]");
  msg.value = T.interest(current.latin, `${ex(current).name}, ${ex(current).size}`) + (msg.value || "");
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

/* Osobní odkaz pro partnera: ?pro=Studio%20XY&typ=architekt|developer|hotel (vytvoříte na odkaz.html) */
let PRO = (params.get("pro") || "").trim().slice(0, 60);
try { if (PRO) sessionStorage.setItem("bc_pro", PRO); else PRO = sessionStorage.getItem("bc_pro") || ""; } catch {}
if (PRO) {
  const bar = document.querySelector("[data-for-bar]");
  if (bar) { bar.querySelector("[data-for-name]").textContent = PRO; bar.hidden = false; }
  ["#pf-firma", "#c-firma"].forEach((s) => { const f = document.querySelector(s); if (f && !f.value) f.value = PRO; });
  const typ = (params.get("typ") || "").toLowerCase();
  const role = typ.startsWith("dev") || typ.startsWith("hot") ? "developer" : "architect";
  const r = cForm.querySelector(`input[name="role"][value="${role}"]`);
  if (r) { r.checked = true; applyRole(role); }
}
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
  if (typeof PRO !== "undefined" && PRO) data.zdroj = (LANG === "en" ? "Personal link: " : "Osobní odkaz: ") + PRO;
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
