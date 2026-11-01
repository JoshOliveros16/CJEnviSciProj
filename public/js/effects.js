/* Hagonoy GroundWatch: "how long does a raised road last" simulator */
(function () {
  "use strict";
  var simH = document.getElementById("simH"), simR = document.getElementById("simR");
  if (!simH || !simR) return;

  function update() {
    var h = parseFloat(simH.value), r = parseFloat(simR.value);
    var years = (h * 100) / r;
    var txt = (years < 10 ? years.toFixed(1) : Math.round(years)) + " years";
    document.getElementById("simHo").textContent = h.toFixed(1) + " m";
    document.getElementById("simRo").textContent = r + " cm/yr";
    document.getElementById("simYears").textContent = txt;
    var bar = document.getElementById("simBar");
    bar.style.setProperty("--w", Math.min(1, years / 40).toFixed(3));
    bar.classList.add("in");
    document.getElementById("simText").textContent =
      "If the ground keeps sinking " + r + " cm every year, a road raised by " + h.toFixed(1) +
      " m is used up in about " + txt.replace(" years", "") + " years. After that, the same floods return unless the sinking is slowed.";
  }
  [simH, simR].forEach(function (el) { el.addEventListener("input", update); });
  Array.prototype.forEach.call(document.querySelectorAll("#sim .presets button"), function (b) {
    b.addEventListener("click", function () {
      simH.value = b.getAttribute("data-h");
      simR.value = b.getAttribute("data-r");
      update();
    });
  });
  update();
})();
