/* Hagonoy GroundWatch: shared layout (side menu, footer, icons) and scroll animations */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- icon + art sprite ---------- */
  var ICONS = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5zM4 21.5A2.5 2.5 0 0 1 6.5 19H20"/>',
    layers: '<path d="M12 2l9 4.5-9 4.5-9-4.5zM3 11.5l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.5c2.2.7 3.5 2.7 3.5 5.5"/>',
    landmark: '<path d="M3 10l9-6 9 6zM5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/>',
    leaf: '<path d="M5 19C5 10 10 5 20 4c0 10-5 15-13 15zM5 19c2-5 5-8 9-10"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    pencil: '<path d="M4 20l1-5L16 4l4 4L9 19zM14 6l4 4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    waves: '<path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>',
    droplet: '<path d="M12 3C12 3 5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 3 12 3z"/>',
    building: '<path d="M4 21V5l8-2v18M12 9h8v12M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2M2 21h20"/>',
    mountain: '<path d="M2 20l7-12 4 6 3-4 6 10z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    salt: '<path d="M12 3c0 0-6 6.5-6 11a6 6 0 0 0 12 0c0-4.5-6-11-6-11z"/><path d="M9.5 14h.01M14 16h.01M12 12h.01"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
    plus: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    boat: '<path d="M3 15h18l-2.5 5h-13zM12 3v12M12 4l6 8h-6M12 7l-5 5h5"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4"/>',
    sliders: '<path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    sink: '<path d="M3 10l9-7 9 7v10H3zM12 11v6M9 14l3 3 3-3"/>',
    arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
    down: '<path d="M12 4v15M6 13l6 6 6-6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    quote: '<path d="M8 8H5v5h3v3H4M18 8h-3v5h3v3h-4"/>',
    chev: '<path d="M15 6l-6 6 6 6"/>'
  };
  var ART =
    '<symbol id="a-pebble" viewBox="0 0 40 30"><ellipse cx="20" cy="16" rx="18" ry="12" fill="currentColor"/><ellipse cx="14" cy="11" rx="8" ry="4" fill="#fff" opacity=".28"/></symbol>' +
    '<symbol id="a-worm" viewBox="0 0 80 30"><path d="M4 16c8-12 14 12 22 0s14 12 22 0 14 12 22 0" fill="none" stroke="#e59a9a" stroke-width="7" stroke-linecap="round"/><circle cx="70" cy="15" r="1.6" fill="#3b2c20"/></symbol>' +
    '<symbol id="a-root" viewBox="0 0 100 160"><g fill="none" stroke="#9a7048" stroke-width="5" stroke-linecap="round"><path d="M50 0C50 30 44 50 48 80S40 120 46 158"/><path d="M48 40C30 48 22 62 14 80"/><path d="M47 70C66 78 78 92 84 112"/><path d="M45 110C32 120 26 134 24 150"/></g></symbol>' +
    '<symbol id="a-shell" viewBox="0 0 60 60"><path d="M30 30c0-3 3-4 5-3s3 5 0 8-8 3-11-1-2-11 4-14 14-1 18 5 2 15-6 19-18 3-23-5-3-20 5-26" fill="none" stroke="#f4e3c0" stroke-width="3.5" stroke-linecap="round"/></symbol>' +
    '<symbol id="a-bone" viewBox="0 0 80 24"><g fill="#f1e6cf"><rect x="12" y="9" width="56" height="7" rx="3"/><circle cx="12" cy="8" r="5"/><circle cx="12" cy="17" r="5"/><circle cx="68" cy="8" r="5"/><circle cx="68" cy="17" r="5"/></g></symbol>' +
    '<symbol id="a-beetle" viewBox="0 0 40 30"><ellipse cx="20" cy="16" rx="12" ry="9" fill="#2f6b4a"/><path d="M20 7v18" stroke="#1b3d2a" stroke-width="1.5"/><ellipse cx="14" cy="12" rx="4" ry="2" fill="#7fd1a0" opacity=".5"/><circle cx="20" cy="6" r="3.5" fill="#1b3d2a"/><g stroke="#1b3d2a" stroke-width="1.6" stroke-linecap="round"><path d="M9 12l-6-4M9 17l-7 1M10 22l-5 5M31 12l6-4M31 17l7 1M30 22l5 5"/></g></symbol>' +
    '<symbol id="a-crystal" viewBox="0 0 60 80"><polygon points="30,0 44,22 38,80 22,80 16,22" fill="#7be0d6"/><polygon points="30,0 44,22 30,30 16,22" fill="#bff7ef"/><polygon points="30,30 44,22 38,80 30,80" fill="#37b3c0" opacity=".85"/><polygon points="8,40 18,28 24,80 6,80" fill="#b08cf0"/><polygon points="52,48 44,38 40,80 56,80" fill="#8f6fe0"/></symbol>' +
    '<symbol id="a-drop" viewBox="0 0 20 28"><path d="M10 1C10 1 2 12 2 18a8 8 0 0 0 16 0C18 12 10 1 10 1z" fill="#6fd0f0"/><ellipse cx="7" cy="17" rx="2" ry="3.5" fill="#fff" opacity=".5"/></symbol>' +
    '<symbol id="a-pot" viewBox="0 0 50 40"><path d="M3 6C14 2 34 2 47 8L42 34C32 40 16 40 8 34z" fill="#c9733f"/><path d="M8 14c12-3 24-3 36 1M9 22c12-3 22-3 32 1" stroke="#f1d6a5" stroke-width="2.4" fill="none"/></symbol>' +
    '<symbol id="a-fish" viewBox="0 0 46 22"><path d="M2 11C10 1 28 1 36 11 28 21 10 21 2 11z" fill="#ffb347"/><path d="M34 11l11-8v16z" fill="#ff8a3d"/><circle cx="10" cy="9" r="1.8" fill="#14130a"/></symbol>' +
    '<symbol id="pebbo" viewBox="0 0 100 90"><ellipse cx="50" cy="55" rx="40" ry="31" fill="#a9ad98"/><ellipse cx="42" cy="42" rx="22" ry="11" fill="#d3d6c3" opacity=".65"/><path d="M50 25C47 11 58 6 67 11 63 20 58 25 50 25Z" fill="#6aa84f"/><path d="M50 25C50 18 53 14 58 11" stroke="#3f7a2e" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="36" cy="55" r="5" fill="#2a2418"/><circle cx="64" cy="55" r="5" fill="#2a2418"/><circle cx="37.6" cy="53.4" r="1.8" fill="#fff"/><circle cx="65.6" cy="53.4" r="1.8" fill="#fff"/><path d="M43 66Q50 73 57 66" stroke="#2a2418" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="27" cy="65" rx="6" ry="3.4" fill="#e8a79a" opacity=".75"/><ellipse cx="73" cy="65" rx="6" ry="3.4" fill="#e8a79a" opacity=".75"/></symbol>';

  var symbols = ART;
  Object.keys(ICONS).forEach(function (k) { symbols += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + "</symbol>"; });
  var sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' + symbols + "</svg>";

  function ico(name, cls) { return '<svg class="ico ' + (cls || "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }
  window.GW = { ico: ico };

  /* ---------- pages ---------- */
  var PAGES = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/about.html", label: "About", icon: "book" },
    { href: "/causes-effects.html", label: "Causes and Effects", icon: "layers" },
    { href: "/community.html", label: "Community Impact", icon: "users" },
    { href: "/solutions.html", label: "Solutions", icon: "leaf" },
    { href: "/explore.html", label: "Explore", icon: "compass" }
  ];
  function norm(p) { return p.replace(/index\.html$/, "").replace(/\/$/, "") || "/"; }
  var here = norm(location.pathname);

  var logo = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#2f3d20"/><ellipse cx="32" cy="38" rx="20" ry="16" fill="#a9ad98"/><path d="M32 22c-2-9 6-12 13-9-3 7-7 9-13 9z" fill="#9bd05a"/><circle cx="24" cy="37" r="3" fill="#2a2418"/><circle cx="40" cy="37" r="3" fill="#2a2418"/><path d="M27 45q5 4 10 0" stroke="#2a2418" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>';

  var links = PAGES.map(function (p) {
    var cur = norm(p.href) === here ? ' aria-current="page"' : "";
    return '<li><a href="' + p.href + '"' + cur + ' title="' + p.label + '">' + ico(p.icon) + '<span class="lbl">' + p.label + "</span></a></li>";
  }).join("");

  var railHTML =
    '<nav class="rail" id="rail" aria-label="Pages">' +
    '<a class="rail-brand" href="/" aria-label="Hagonoy GroundWatch home">' + logo + "<b>GroundWatch</b></a>" +
    '<ul class="rail-links">' + links + "</ul>" +
    "</nav>" +
    '<button class="fab" id="fab" aria-label="Open menu" aria-expanded="false" aria-controls="rail">' + ico("menu") + "</button>" +
    '<div class="scrim" id="scrim"></div>';

  var members = (CFG.members || []).map(function (m) { return "<li>" + m + "</li>"; }).join("");
  var footHTML =
    '<footer class="foot"><div class="wrap">' +
    '<div class="foot-grid">' +
    "<div>" +
    '<div class="foot-brand">' + logo + "<span>Hagonoy GroundWatch</span></div>" +
    "<p>" + (CFG.subtitle || "") + " in Hagonoy, Bulacan.</p>" +
    '<a href="#top" class="to-top" style="color:var(--lime);font-weight:800">Back to the surface ' + ico("down").replace("ico ", "ico ").replace("<svg", '<svg style="display:inline;vertical-align:-0.25em;transform:rotate(180deg)"') + "</a>" +
    "</div>" +
    "<div><h4>Pages</h4><ul>" +
    PAGES.map(function (p) { return '<li><a href="' + p.href + '">' + p.label + "</a></li>"; }).join("") + "</ul></div>" +
    "<div><h4>Group members</h4><ul>" + members + "</ul><p style=\"margin-top:.8rem\">" + (CFG.section || "") + "<br>" + (CFG.course || "") + "<br>" + (CFG.school || "") + "</p></div>" +
    "<div><h4>Sources</h4><p>Every fact on this site comes from a published source.</p>" +
    '<a class="ref-btn" href="/references.html">References ' + ico("arrow") + "</a></div>" +
    "</div>" +
    '<div class="fine"><span>Student project for ' + (CFG.course || "Environmental Science") + ". Not an official government source.</span><span>For hazard advisories, contact your local MDRRMO.</span></div>" +
    "</div></footer>";

  function inject() {
    document.body.insertAdjacentHTML("afterbegin", sprite);
    var r = $("#gw-rail"); if (r) r.outerHTML = railHTML;
    var f = $("#gw-foot"); if (f) f.outerHTML = footHTML;
    $$("[data-ico]").forEach(function (el) {
      var tmp = document.createElement("span");
      tmp.innerHTML = ico(el.getAttribute("data-ico"), el.getAttribute("data-cls") || "");
      el.replaceWith(tmp.firstChild);
    });
    $$("[data-mascot]").forEach(function (el) {
      var cls = el.getAttribute("data-mascot");
      var s = '<svg class="' + cls + '" viewBox="0 0 100 90" aria-hidden="true"><use href="#pebbo" width="100" height="90"/></svg>';
      el.insertAdjacentHTML("afterbegin", s);
    });
  }
  inject();

  /* small soil illustration in every page banner */
  var BANNER_ART =
    '<svg class="banner-art" viewBox="0 0 360 280" aria-hidden="true">' +
    '<path d="M0 120Q90 90 180 120T360 110V280H0Z" fill="#fff" opacity=".22"/>' +
    '<path d="M0 170Q90 140 180 170T360 160V280H0Z" fill="#000" opacity=".14"/>' +
    '<path d="M0 220Q90 195 180 220T360 212V280H0Z" fill="#000" opacity=".2"/>' +
    '<g transform="translate(120 18) scale(1.15)"><g class="bob"><use href="#pebbo" width="100" height="90"/></g></g>' +
    '<use href="#a-pebble" x="36" y="188" width="52" height="39" style="color:#a39a88"/>' +
    '<use href="#a-pebble" x="268" y="148" width="62" height="46" style="color:#8d8472"/>' +
    '<use href="#a-pebble" x="206" y="226" width="42" height="31" style="color:#b3a998"/>' +
    '<use href="#a-root" x="300" y="116" width="34" height="54" style="opacity:.7"/>' +
    "</svg>";
  $$(".banner").forEach(function (b) { b.insertAdjacentHTML("beforeend", BANNER_ART); });

  /* ---------- side menu (mobile drawer) ---------- */
  var rail = $("#rail"), fab = $("#fab"), scrim = $("#scrim");
  function setMenu(open) {
    rail.classList.toggle("open", open);
    scrim.classList.toggle("on", open);
    fab.setAttribute("aria-expanded", String(open));
    fab.innerHTML = ico(open ? "close" : "menu");
  }
  fab.addEventListener("click", function () { setMenu(!rail.classList.contains("open")); });
  scrim.addEventListener("click", function () { setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  $$("a", rail).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  var lastY = window.scrollY;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (!rail.classList.contains("open")) fab.classList.toggle("hide", y > lastY && y > 120);
    lastY = y;
  }, { passive: true });

  /* ---------- scroll animations ---------- */
  $$("[data-stagger]").forEach(function (parent) {
    Array.prototype.forEach.call(parent.children, function (child, i) {
      if (!child.hasAttribute("data-anim")) child.setAttribute("data-anim", parent.getAttribute("data-stagger") || "up");
      child.style.setProperty("--i", i);
    });
  });

  function countUp(el) {
    var end = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var pre = el.getAttribute("data-prefix") || "", suf = el.getAttribute("data-suffix") || "";
    if (reduce) return;
    var t0 = null, dur = 1500;
    function frame(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (end * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var targets = $$("[data-anim], .fill, [data-count]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        if (en.target.hasAttribute("data-count")) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- parallax for the soil art ---------- */
  var par = $$(".strata");
  if (par.length && !reduce) {
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      par.forEach(function (b) {
        var r = b.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) return;
        var off = ((r.top + r.height / 2) - vh / 2) * -0.07;
        b.style.setProperty("--py", Math.max(-24, Math.min(24, off)).toFixed(1) + "px");
      });
      ticking = false;
    };
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- photo fallbacks ---------- */
  $$(".photo img").forEach(function (img) {
    var fig = img.closest(".photo");
    function fail() { fig.classList.add("failed"); }
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---------- myth / fact flip cards ---------- */
  $$(".flip button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var on = btn.parentElement.classList.toggle("on");
      btn.setAttribute("aria-pressed", String(on));
    });
  });
})();
