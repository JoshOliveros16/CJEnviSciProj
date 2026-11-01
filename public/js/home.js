/* Hagonoy GroundWatch: landing page depth meter.
   Appears at the lower right while scrolling and peeks from the edge when idle. */
(function () {
  "use strict";

  var layers = Array.prototype.slice.call(document.querySelectorAll(".layer[data-layer]"));
  var pill = document.createElement("div");
  pill.className = "depth-pill";
  pill.setAttribute("aria-hidden", "true");
  pill.innerHTML =
    '<span class="dp-tab">' + (window.GW ? window.GW.ico("chev") : "") + "</span>" +
    '<span class="dp-body"><b id="dpNum">0 m</b><span class="dp-name" id="dpName">Surface</span><span class="dp-gauge"><i id="dpBar"></i></span></span>';
  document.body.appendChild(pill);

  var num = document.getElementById("dpNum");
  var nameEl = document.getElementById("dpName");
  var bar = document.getElementById("dpBar");
  var ticking = false, idleTimer = null;

  function update() {
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var p = Math.min(1, Math.max(0, window.scrollY / max));
    bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
    num.textContent = Math.round(p * 300) + " m";

    var current = layers[0];
    var line = window.innerHeight * 0.4;
    layers.forEach(function (l) { if (l.getBoundingClientRect().top <= line) current = l; });
    nameEl.textContent = current.getAttribute("data-layer");
    ticking = false;
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
    pill.classList.add("show");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { pill.classList.remove("show"); }, 1100);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
