/* Hagonoy GroundWatch: Explore page (tabs, map, quiz, report form) */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- tabs ---------- */
  var tabs = $$('.tabs [role="tab"]');
  function openTab(id, focus) {
    var found = false;
    tabs.forEach(function (t) { if (t.id === "tab-" + id) found = true; });
    if (!found) return;
    tabs.forEach(function (t) {
      var on = t.id === "tab-" + id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
      if (on && focus) t.focus();
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      var id = t.id.replace("tab-", "");
      openTab(id);
      if (history.replaceState) history.replaceState(null, "", "#" + id);
    });
    t.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
      if (n !== null) { e.preventDefault(); openTab(tabs[n].id.replace("tab-", ""), true); }
    });
  });
  function fromHash() {
    var h = location.hash.replace("#", "");
    if (!h) return;
    openTab(h);
    var tools = document.getElementById("tools");
    if (tools && ["map", "quiz", "faq", "report"].indexOf(h) !== -1) tools.scrollIntoView();
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();

  /* ---------- interactive map ---------- */
  var AREAS = [
    { g: "Overview", name: "Hagonoy (whole town)", q: "Hagonoy, Bulacan", z: 13, why: "A low-lying coastal municipality of 26 barangays beside northern Manila Bay. The whole town was placed under a state of calamity in July 2023.", src: "Manila Bulletin, 2023" },
    { g: "Neighbors in the same study area", name: "Calumpit", q: "Calumpit, Bulacan", z: 13, why: "Studied together with Hagonoy for subsidence and groundwater extraction (2015 to 2021 Q1).", src: "Maclang et al., 2026" },
    { g: "Neighbors in the same study area", name: "Paombong", q: "Paombong, Bulacan", z: 13, why: "Coastal neighbor included in the flood planning that Hagonoy's engineer asks for.", src: "GMA Public Affairs" },
    { g: "Barangays named in flood reports", name: "Santo Niño", q: "Santo Niño, Hagonoy, Bulacan", z: 15, why: "Among the villages flooded by high tide in July 2023. A GNSS ground-monitoring station is also hosted in Barangay Santo Niño.", src: "Manila Bulletin, 2023; ISPRS, 2026" },
    { g: "Barangays named in flood reports", name: "San Sebastian", q: "San Sebastian, Hagonoy, Bulacan", z: 15, why: "Described as a place where residents live on streets that are never dry. A typical example of daily flood conditions.", src: "GMA Public Affairs" },
    { g: "Barangays named in flood reports", name: "Santa Monica", q: "Santa Monica, Hagonoy, Bulacan", z: 15, why: "Named among flooded villages in 2023. Waist-deep floodwater was photographed here in July 2025.", src: "Manila Bulletin, 2023 and 2025" },
    { g: "Barangays named in flood reports", name: "San Miguel", q: "San Miguel, Hagonoy, Bulacan", z: 15, why: "Flooded by high tide in 2023. Parts such as Sitio Kislap were documented as mostly inundated by high tides.", src: "Manila Bulletin, 2023; Wikimedia Commons" },
    { g: "Barangays named in flood reports", name: "Santa Elena", q: "Santa Elena, Hagonoy, Bulacan", z: 15, why: "Shown submerged in 2018 and named again among flooded villages in 2023.", src: "Manila Bulletin, 2018 and 2023" },
    { g: "Barangays named in flood reports", name: "San Juan", q: "San Juan, Hagonoy, Bulacan", z: 15, why: "Local officials distributed water buckets here amid waist-deep floods on July 30, 2023.", src: "Manila Bulletin, 2023" },
    { g: "Barangays named in flood reports", name: "Iba", q: "Iba, Hagonoy, Bulacan", z: 15, why: "Floodwater still covered parts of Barangay Iba on September 8, 2026, after weeks of monsoon rain.", src: "Daily Tribune, 2026" },
    { g: "Barangays named in flood reports", name: "Tibaguin", q: "Tibaguin, Hagonoy, Bulacan", z: 15, why: "One of 12 villages inundated by tide-driven floods in July 2023.", src: "Manila Bulletin, 2023" },
    { g: "Barangays named in flood reports", name: "Pugad", q: "Pugad, Hagonoy, Bulacan", z: 15, why: "One of 12 villages inundated by tide-driven floods in July 2023.", src: "Manila Bulletin, 2023" },
    { g: "Barangays named in flood reports", name: "Tampok", q: "Tampok, Hagonoy, Bulacan", z: 15, why: "One of 12 villages inundated by tide-driven floods in July 2023.", src: "Manila Bulletin, 2023" },
    { g: "Barangays named in flood reports", name: "Santo Rosario", q: "Santo Rosario, Hagonoy, Bulacan", z: 15, why: "One of 12 villages inundated by tide-driven floods in July 2023.", src: "Manila Bulletin, 2023" },
    { g: "Barangays named in flood reports", name: "Mercado", q: "Mercado, Hagonoy, Bulacan", z: 15, why: "One of 12 villages inundated by tide-driven floods in July 2023.", src: "Manila Bulletin, 2023" },
    { g: "Barangays named in flood reports", name: "San Nicolas", q: "San Nicolas, Hagonoy, Bulacan", z: 15, why: "One of 12 villages inundated by tide-driven floods in July 2023.", src: "Manila Bulletin, 2023" },
    { g: "Barangays named in flood reports", name: "Sagrada Familia", q: "Sagrada Familia, Hagonoy, Bulacan", z: 15, why: "One of 12 villages inundated by tide-driven floods in July 2023.", src: "Manila Bulletin, 2023" }
  ];
  var chipsBox = $("#mapChips"), info = $("#mapInfo"), frame = $("#mapFrame"), mapOpen = $("#mapOpen");
  function showInfo(a) {
    info.innerHTML = "<h4 style='margin-bottom:.3em'>" + esc(a.name) + "</h4><p style='margin-bottom:.6em'>" + esc(a.why) + "</p><span class='src'>" + esc(a.src) + "</span>";
  }
  var lastGroup = "";
  AREAS.forEach(function (a, i) {
    if (a.g !== lastGroup) {
      var h = document.createElement("span"); h.className = "grp"; h.textContent = a.g; chipsBox.appendChild(h); lastGroup = a.g;
    }
    var b = document.createElement("button");
    b.type = "button"; b.textContent = a.name; b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    b.addEventListener("click", function () { selectArea(i); });
    chipsBox.appendChild(b);
  });
  function selectArea(i) {
    var a = AREAS[i];
    $$("button", chipsBox).forEach(function (b) { b.setAttribute("aria-pressed", String(b.textContent === a.name)); });
    var q = encodeURIComponent(a.q);
    frame.src = "https://www.google.com/maps?q=" + q + "&z=" + a.z + "&output=embed";
    mapOpen.href = "https://www.google.com/maps?q=" + q;
    showInfo(a);
  }
  showInfo(AREAS[0]);

  /* ---------- quiz ---------- */
  var QUIZ = [
    { q: "What is land subsidence?", a: "The gradual sinking of the ground surface", w: ["A sudden rise in sea level", "The shaking of the ground during a typhoon", "Soil becoming drier near the surface"], e: "Subsidence is the lowering of land. It is slow-onset, so people often notice it only after flooding gets worse." },
    { q: "Which human activity is considered the main driver of subsidence in the Hagonoy and Calumpit area?", a: "Excessive groundwater extraction", w: ["Planting more mangroves", "Building more public parks", "Fishing in Manila Bay"], e: "Pumping water faster than it refills lets clay layers compact. The area's sinking was linked to pumping and urban build-up." },
    { q: "Roughly how fast does Hagonoy's municipal engineer say the town is sinking?", a: "About 10 cm per year", w: ["About 1 mm per year", "About 1 meter per year", "It is not sinking"], e: "He cited about 10 cm (4 inches) a year, close to measurements in nearby areas." },
    { q: "Near high-extraction zones in Hagonoy and Calumpit (2015 to 2021 Q1), subsidence reached up to about...", a: "124.5 mm per year", w: ["12.4 mm per year", "1.2 mm per year", "1,245 mm per year"], e: "The 2026 ISPRS study reported rates reaching 124.51 mm per year, around 12.5 cm a year." },
    { q: "In what year was the whole municipality of Hagonoy placed under a state of calamity because of flooding?", a: "2023", w: ["2003", "2010", "2019"], e: "On July 30, 2023, the Sangguniang Bayan passed Resolution 2023-87 after tide-driven and monsoon floods." },
    { q: "Why can raising a road by 1 meter be only a temporary fix?", a: "The ground keeps sinking, so the gained height gets used up", w: ["Concrete dissolves in seawater", "Higher roads cause more rain", "Roads never need maintenance"], e: "At about 10 cm per year, a 1 m raise may last only around a decade if the sinking is not slowed." },
    { q: "\"Relative sea-level rise\" means...", a: "The sea seems higher because the land is getting lower", w: ["Sea water gets saltier", "Tides stop moving", "Rivers flow uphill"], e: "When land sinks, the water reaches higher on the land even if the sea itself has not changed much." },
    { q: "Which action would help the most to slow subsidence?", a: "Reduce deep-well pumping and report unregistered wells", w: ["Drill more private deep wells", "Dump waste in canals", "Ignore local advisories"], e: "Managing groundwater use is the key long-term fix. Other measures only treat the symptoms." },
    { q: "Which agency provided 21 benchmarks used to measure ground movement in Hagonoy and Calumpit?", a: "NAMRIA", w: ["PAGASA", "DepEd", "PSA"], e: "NAMRIA supplied survey benchmarks, which were combined with GNSS stations and satellite radar data." },
    { q: "Roughly how far from Manila is Hagonoy?", a: "About 50 km north", w: ["About 5 km east", "About 200 km south", "About 500 m west"], e: "Hagonoy is a coastal town about 50 km north of Manila, near the northern end of Manila Bay." }
  ];
  var quizBox = $("#quizBox"), qi = 0, score = 0, answered = false, order = [];
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function bestScore() { try { return parseInt(localStorage.getItem("gw-best") || "0", 10) || 0; } catch (e) { return 0; } }
  function saveBest(s) { try { if (s > bestScore()) localStorage.setItem("gw-best", String(s)); } catch (e) { /* ignore */ } }
  function startQuiz() { qi = 0; score = 0; order = shuffle(QUIZ.map(function (_, i) { return i; })); renderQ(); }
  function renderQ() {
    answered = false;
    var item = QUIZ[order[qi]];
    var opts = shuffle([item.a].concat(item.w));
    var letters = ["A", "B", "C", "D"];
    var html = "<div class='q-top'><span>Question " + (qi + 1) + " of " + QUIZ.length + "</span><span>Score: " + score + "</span></div>" +
      "<div class='track' style='margin:0 0 1.3rem'><div class='fill in' style='--w:" + (qi / QUIZ.length).toFixed(3) + "'></div></div>" +
      "<p class='q-text' id='qText'>" + esc(item.q) + "</p><div class='opts' role='group' aria-labelledby='qText'>";
    opts.forEach(function (o, i) {
      html += "<button type='button' class='opt' data-ans='" + (o === item.a ? "1" : "0") + "'><span class='k'>" + letters[i] + "</span><span>" + esc(o) + "</span></button>";
    });
    html += "</div><div id='qFb' aria-live='polite'></div><div class='q-nav'></div>";
    quizBox.innerHTML = html;
    $$(".opt", quizBox).forEach(function (b) { b.addEventListener("click", function () { choose(b, item); }); });
  }
  function choose(btn, item) {
    if (answered) return;
    answered = true;
    var ok = btn.getAttribute("data-ans") === "1";
    if (ok) score++;
    $$(".opt", quizBox).forEach(function (b) {
      b.disabled = true;
      if (b.getAttribute("data-ans") === "1") b.classList.add("right");
      else if (b === btn) b.classList.add("wrong");
    });
    $("#qFb", quizBox).innerHTML = "<p class='feedback'><strong>" + (ok ? "Correct. " : "Not quite. ") + "</strong>" + esc(item.e) + "</p>";
    var next = document.createElement("button");
    next.type = "button"; next.className = "btn btn-primary";
    next.textContent = qi + 1 < QUIZ.length ? "Next question" : "See my result";
    next.addEventListener("click", function () { qi++; if (qi < QUIZ.length) renderQ(); else finish(); });
    $(".q-nav", quizBox).appendChild(next);
    next.focus({ preventScroll: true });
  }
  function finish() {
    saveBest(score);
    var pct = Math.round((score / QUIZ.length) * 100);
    var msg = pct >= 90 ? "Excellent. You know this topic well." : pct >= 70 ? "Great job. You understand the issue." : pct >= 40 ? "Good start. Review the pages and try again." : "Keep reading. The answers are in the pages.";
    quizBox.innerHTML = "<div class='score'><div class='mascot' data-mascot-slot></div>" +
      "<div class='big'>" + score + "/" + QUIZ.length + "</div><h3>" + msg + "</h3><p class='note'>Best score on this device: " + bestScore() + "/" + QUIZ.length + "</p>" +
      "<div class='row' style='justify-content:center'><button type='button' class='btn btn-primary' id='qAgain'>Try again</button><a class='btn btn-ghost' href='/causes-effects.html'>Review the causes</a></div></div>";
    $("[data-mascot-slot]", quizBox).insertAdjacentHTML("afterbegin", '<svg class="bob" viewBox="0 0 100 90" aria-hidden="true"><use href="#pebbo" width="100" height="90"/></svg>');
    $("#qAgain").addEventListener("click", startQuiz);
  }
  startQuiz();

  /* ---------- report form ---------- */
  var BRGYS = ["Abulalas", "Carillo", "Iba", "Iba-Ibayo", "Mercado", "Palapat", "Pugad", "Sagrada Familia", "San Agustin", "San Isidro", "San Jose", "San Juan", "San Miguel", "San Nicolas", "San Pablo", "San Pascual", "San Pedro", "San Roque", "San Sebastian", "Santa Cruz", "Santa Elena", "Santa Monica", "Santo Niño", "Santo Rosario", "Tampok", "Tibaguin", "Other / not sure"];
  var sel = $("#rBrgy");
  BRGYS.forEach(function (b) { var o = document.createElement("option"); o.textContent = b; sel.appendChild(o); });

  var form = $("#reportForm"), desc = $("#rDesc"), cnt = $("#rCount"), status = $("#rStatus");
  desc.addEventListener("input", function () { cnt.textContent = desc.value.length; });
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  $("#rDate").max = today.toISOString().slice(0, 10);

  function fieldOk(el) {
    var ok;
    if (el.type === "checkbox") ok = el.checked;
    else if (el.id === "rDesc") ok = el.value.trim().length >= 10;
    else ok = el.value.trim() !== "";
    var wrap = el.closest(".field");
    if (wrap) wrap.classList.toggle("bad", !ok);
    return ok;
  }
  ["rBrgy", "rType", "rDesc", "rOk"].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener("change", function () { fieldOk(el); });
    el.addEventListener("blur", function () { fieldOk(el); });
  });

  function localSave(payload) {
    var id = "GW-" + Math.random().toString(16).slice(2, 8).toUpperCase();
    try {
      var all = JSON.parse(localStorage.getItem("gw-reports") || "[]");
      payload.id = id; payload.createdAt = new Date().toISOString(); all.push(payload);
      localStorage.setItem("gw-reports", JSON.stringify(all));
    } catch (e) { /* storage may be blocked; still show a receipt */ }
    return id;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var checks = ["rBrgy", "rType", "rDesc", "rOk"].map(function (id) { return fieldOk(document.getElementById(id)); });
    if (checks.indexOf(false) !== -1) {
      status.textContent = "Please fix the highlighted fields.";
      var bad = $(".field.bad input, .field.bad select, .field.bad textarea", form);
      if (bad) bad.focus();
      return;
    }
    var data = {
      name: form.name.value, contact: form.contact.value, barangay: form.barangay.value, type: form.type.value,
      dateObserved: form.dateObserved.value, description: form.description.value, website: form.website.value
    };
    var btn = $("#rSubmit"); btn.disabled = true; status.textContent = "Sending...";
    function done(id) {
      form.hidden = true; $("#rDone").hidden = false; $("#rId").textContent = id;
      btn.disabled = false; status.textContent = "";
    }
    fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j.ok) done(res.j.id);
        else { btn.disabled = false; status.textContent = (res.j && res.j.error) || "Something went wrong. Please try again."; }
      })
      .catch(function () { done(localSave(data)); });
  });
  $("#rAgain").addEventListener("click", function () {
    form.reset(); cnt.textContent = "0"; $$(".field.bad", form).forEach(function (f) { f.classList.remove("bad"); });
    form.hidden = false; $("#rDone").hidden = true;
  });

  /* optional Google Form embed */
  if (CFG.googleFormUrl) {
    var gb = $("#gformBox");
    gb.hidden = false;
    gb.innerHTML = "<p class='note' style='margin-bottom:.6rem'>Prefer Google Forms? Use the embedded form:</p>";
    var ifr = document.createElement("iframe");
    ifr.className = "gform"; ifr.src = CFG.googleFormUrl; ifr.title = "Google Form: community report"; ifr.loading = "lazy";
    gb.appendChild(ifr);
  }
})();
