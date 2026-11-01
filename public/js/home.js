/* Hagonoy GroundWatch: landing page depth meter */
(function () {
  "use strict";
  document.body.classList.add("has-depth");

  var layers = Array.prototype.slice.call(document.querySelectorAll(".layer[data-layer]"));
  var num = document.getElementById("depthNum");
  var nameEl = document.getElementById("depthName");
  var bar = document.getElementById("depthBar");
  var ticking = false;

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
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
