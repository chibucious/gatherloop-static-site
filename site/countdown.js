(function () {
  "use strict";

  // ---- Countdown timer ------------------------------------------------
  var countdownEl = document.getElementById("countdown");
  if (countdownEl) {
    var saleDate = new Date(countdownEl.getAttribute("data-sale-date"));

    var fields = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      minutes: document.getElementById("cd-minutes"),
      seconds: document.getElementById("cd-seconds"),
    };

    var pad = function (n) {
      return String(n).padStart(2, "0");
    };

    var tick = function () {
      var diff = saleDate.getTime() - Date.now();

      if (isNaN(saleDate.getTime())) {
        countdownEl.textContent = "Sale date coming soon.";
        return;
      }

      if (diff <= 0) {
        fields.days.textContent = "00";
        fields.hours.textContent = "00";
        fields.minutes.textContent = "00";
        fields.seconds.textContent = "00";
        var label = document.getElementById("cd-status");
        if (label) label.textContent = "Tickets are live!";
        clearInterval(timer);
        return;
      }

      var totalSeconds = Math.floor(diff / 1000);
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds % 86400) / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;

      fields.days.textContent = pad(days);
      fields.hours.textContent = pad(hours);
      fields.minutes.textContent = pad(minutes);
      fields.seconds.textContent = pad(seconds);
    };

    tick();
    var timer = setInterval(tick, 1000);
  }

  // ---- Scroll-reveal (IntersectionObserver, no dependencies) ----------
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  // ---- Notify-me form (client-side only — no backend yet) --------------
  var form = document.getElementById("notify-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var emailInput = document.getElementById("notify-email");
      var status = document.getElementById("notify-status");
      var email = emailInput.value.trim();

      if (!email) return;

      status.textContent = "You're on the list — we'll email " + email + " the moment tickets drop.";
      status.classList.remove("hidden");
      form.reset();
      emailInput.focus();
    });
  }
})();
