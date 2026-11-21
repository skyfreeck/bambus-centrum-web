/* =========================================================
   Bambus Centrum Kastner — sortiment.js
   Kompletní katalog. Data jsou v katalog.js (převzatá ze starého webu).
   ========================================================= */
(() => {
  const K = window.KATALOG;
  const LANG = document.documentElement.lang === "en" ? "en" : "cs";
  const ROOT = document.documentElement.dataset.root || "";
  const PAGE = 48;

  const T = {
    cs: {
      all: "Celý sortiment", items: (n) => `${n.toLocaleString("cs-CZ")} ${n === 1 ? "položka" : n < 5 && n > 1 ? "položky" : "položek"}`,
      from: (p) => `od ${p.toLocaleString("cs-CZ")} Kč`, onRequest: "Cena na dotaz", noPhoto: "Bez fotografie",
      gallery: "Ukázka z nabídky", more: "Zobrazit další", inquiry: (t) => `Mám zájem o: ${t}`,
      readMore: "Číst dál", readLess: "Skrýt", photo: "Fotografie z nabídky",
    },
    en: {
      all: "Full collection", items: (n) => `${n.toLocaleString("en-GB")} ${n === 1 ? "item" : "items"}`,
      from: (p) => `from CZK ${p.toLocaleString("en-GB")}`, onRequest: "Price on request", noPhoto: "No photograph",
      gallery: "From our collection", more: "Show more", inquiry: (t) => `I am interested in: ${t}`,
      readMore: "Read more", readLess: "Show less", photo: "Photograph from our collection",
    },
  }[LANG];

  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const catName = (c) => (LANG === "en" ? c.en : c.cz);
  const img = (p) => (p ? (/^https?:/.test(p) ? p : K.base + p) : "");
  const fullName = (it) => it.l + (it.c ? ` (${it.c})` : "");

  // index pro hledání
  K.items.forEach((it, i) => { it._i = i; it._q = norm(`${it.l} ${it.c}`); });

  const state = { cat: null, q: "", sort: "az", shown: PAGE };

  /* ---------- Kategorie ---------- */
  const list = $("[data-cat-list]");
  const select = $("[data-cat-select]");
  const total = K.items.length;
  document.querySelectorAll("[data-total]").forEach((el) => (el.textContent = total.toLocaleString(LANG === "en" ? "en-GB" : "cs-CZ")));
  const opts = [{ s: "", label: T.all, n: total }].concat(K.cats.map((c) => ({ s: c.s, label: catName(c), n: c.n })));
  list.innerHTML = opts.map((o) => `<li><button type="button" data-cat="${o.s}" aria-pressed="false"><span>${esc(o.label)}</span><span class="cat-n">${o.n || ""}</span></button></li>`).join("");
  select.innerHTML = opts.map((o) => `<option value="${o.s}">${esc(o.label)}${o.n ? ` (${o.n})` : ""}</option>`).join("");

  list.addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (b) setCat(b.dataset.cat); });
  select.addEventListener("change", () => setCat(select.value));

  function setCat(s, push = true) {
    state.cat = s || null; state.shown = PAGE;
    if (push) {
      const h = s ? `#${s}` : " ";
      history.replaceState(null, "", h.trim() ? h : location.pathname + location.search);
    }
    render();
    if (push && innerWidth < 900) $(".shop-main").scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- Hledání a řazení ---------- */
  let tq;
  $("[data-search]").addEventListener("input", (e) => {
    clearTimeout(tq);
    tq = setTimeout(() => {
      state.q = norm(e.target.value.trim()); state.shown = PAGE;
      if (state.q && state.cat) { setCat("", true); return; }   // hledá se vždy v celém sortimentu
      render();
    }, 120);
  });
  $("[data-sort]").addEventListener("change", (e) => { state.sort = e.target.value; state.shown = PAGE; render(); });
  $("[data-more]").addEventListener("click", () => { state.shown += PAGE; render(false); });

  function results() {
    let r = K.items;
    if (state.cat) r = r.filter((it) => it.k.some((k) => K.order[k] === state.cat));
    if (state.q) r = r.filter((it) => state.q.split(/\s+/).every((w) => it._q.includes(w)));
    const byName = (a, b) => a.l.localeCompare(b.l, "cs");
    const sorters = {
      az: byName,
      "price-asc": (a, b) => (a.m ?? 1e12) - (b.m ?? 1e12) || byName(a, b),
      "price-desc": (a, b) => (b.m ?? -1) - (a.m ?? -1) || byName(a, b),
      new: (a, b) => (b.y || "").localeCompare(a.y || "") || byName(a, b),
    };
    return [...r].sort(sorters[state.sort]);
  }

  // kategorie položek jsou indexy do K.order (pořadí kategorií ze starého webu)
  const catSlugOf = (k) => K.order[k];

  /* ---------- Vykreslení ---------- */
  const cards = $("[data-cards]");
  function card(it) {
    const price = it.m ? T.from(it.m) : T.onRequest;
    const photo = it.t
      ? `<img src="${esc(img(it.t))}" alt="${esc(fullName(it))}" loading="lazy" decoding="async" width="300" height="225">`
      : `<span class="card-nophoto">${T.noPhoto}</span>`;
    return `<li class="card"><button type="button" data-item="${it._i}">
      <span class="card-photo">${photo}</span>
      <span class="card-latin">${esc(it.l)}</span>
      ${it.c ? `<span class="card-cz">${esc(it.c)}</span>` : ""}
      <span class="card-price">${price}</span>
    </button></li>`;
  }

  function render(reset = true) {
    const cat = state.cat ? K.cats.find((c) => c.s === state.cat) : null;
    list.querySelectorAll("[data-cat]").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.cat || null) === state.cat)));
    select.value = state.cat || "";
    $("[data-cat-title]").textContent = cat ? catName(cat) : T.all;

    // úvodní text kategorie a galerie (jen bez hledání)
    const intro = $("[data-intro]");
    const gal = $("[data-gallery]");
    if (cat && !state.q && cat.intro) {
      const paras = cat.intro.split("\n").filter(Boolean);
      const long = cat.intro.length > 700;
      intro.innerHTML = paras.map((p) => `<p>${esc(p)}</p>`).join("") + (long ? `<button type="button" class="link-btn" data-intro-toggle>${T.readMore}</button>` : "");
      intro.classList.toggle("is-clamped", long);
      intro.hidden = false;
    } else intro.hidden = true;
    if (cat && !state.q && cat.g.length) {
      gal.innerHTML = cat.g.map((g, i) => `<li><button type="button" data-gal="${i}"><img src="${esc(g.t)}" alt="${esc(g.n || catName(cat))}" loading="lazy" decoding="async"></button></li>`).join("");
      gal.hidden = false;
    } else gal.hidden = true;

    const r = results();
    const shown = r.slice(0, state.shown);
    if (reset) cards.innerHTML = shown.map(card).join("");
    else cards.insertAdjacentHTML("beforeend", r.slice(cards.children.length, state.shown).map(card).join(""));
    $("[data-count]").textContent = r.length ? T.items(r.length) : (cat && cat.g.length && !state.q ? T.gallery : "");
    $("[data-empty]").hidden = !!r.length || (cat && !state.q && (cat.g.length || cat.intro));
    const more = $("[data-more]");
    more.hidden = r.length <= state.shown;
    more.textContent = `${T.more} (${r.length - Math.min(state.shown, r.length)})`;
  }

  // Rozbitý obrázek (např. smazaný na starém webu) nahradit textem
  cards.addEventListener("error", (e) => {
    if (e.target.tagName !== "IMG") return;
    e.target.closest(".card-photo").innerHTML = `<span class="card-nophoto">${T.noPhoto}</span>`;
  }, true);

  $("[data-intro]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-intro-toggle]");
    if (!b) return;
    const box = $("[data-intro]");
    const open = box.classList.toggle("is-open");
    b.textContent = open ? T.readLess : T.readMore;
  });

  /* ---------- Detail ---------- */
  const modal = $("[data-modal]");
  const setText = (k, v) => { const el = modal.querySelector(`[data-m="${k}"]`); el.textContent = v || ""; el.hidden = !v; };
  function setPhoto(src, alt) {
    const box = modal.querySelector("[data-m-photo]");
    box.classList.remove("is-placeholder");
    box.innerHTML = src ? `<img src="${esc(src)}" alt="${esc(alt)}">` : "";
    if (!src) { box.classList.add("is-placeholder"); box.innerHTML = `<div class="ph-inner"><p class="ph-hint">${T.noPhoto}</p></div>`; }
  }

  cards.addEventListener("click", (e) => {
    const b = e.target.closest("[data-item]");
    if (!b) return;
    const it = K.items[+b.dataset.item];
    setPhoto(img(it.i || it.t), fullName(it));
    setText("latin", it.l); setText("cz", it.c);
    setText("cat", it.k.map((k) => K.cats.find((c) => c.s === catSlugOf(k))).filter(Boolean).map(catName).join(", "));
    const pt = modal.querySelector("[data-m-prices]");
    if (it.p.length) {
      const [head, ...rows] = it.p;
      pt.innerHTML = `<table><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      pt.hidden = false;
    } else pt.hidden = true;
    modal.querySelector("[data-m-desc]").innerHTML = it.d.split("\n").filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join("");
    const inq = modal.querySelector("[data-m-inquire]");
    inq.hidden = false;
    inq.href = `${LANG === "en" ? "index.html" : "index.html"}?poptavka=${encodeURIComponent(fullName(it))}#concierge`;
    modal.showModal();
  });

  $("[data-gallery]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-gal]");
    if (!b) return;
    const cat = K.cats.find((c) => c.s === state.cat);
    const g = cat.g[+b.dataset.gal];
    setPhoto(g.f, g.n || catName(cat));
    setText("latin", g.n || catName(cat)); setText("cz", ""); setText("cat", T.photo);
    modal.querySelector("[data-m-prices]").hidden = true;
    modal.querySelector("[data-m-desc]").innerHTML = "";
    modal.querySelector("[data-m-inquire]").href = `index.html?poptavka=${encodeURIComponent(catName(cat))}#concierge`;
    modal.showModal();
  });
  modal.querySelector("[data-modal-close]").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

  /* ---------- Navigace (sdílené chování) ---------- */
  const head = $("[data-head]"), nav = $("[data-nav]"), toggle = $("[data-nav-toggle]");
  const setNav = (o) => { nav.classList.toggle("is-open", o); toggle.setAttribute("aria-expanded", String(o)); };
  toggle.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });
  addEventListener("scroll", () => head.classList.toggle("is-scrolled", scrollY > 8), { passive: true });

  /* ---------- Osobní odkaz (pokračuje z úvodní stránky) ---------- */
  try {
    const pro = sessionStorage.getItem("bc_pro");
    const bar = $("[data-for-bar]");
    if (pro && bar) { bar.querySelector("[data-for-name]").textContent = pro; bar.hidden = false; }
  } catch {}

  /* ---------- Start: kategorie z adresy (#jehlicnany) ---------- */
  const fromHash = decodeURIComponent(location.hash.slice(1));
  setCat(K.cats.some((c) => c.s === fromHash) ? fromHash : "", false);
  addEventListener("hashchange", () => { const h = location.hash.slice(1); if (K.cats.some((c) => c.s === h)) setCat(h, false); });
})();
