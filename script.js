(function () {
  "use strict";

  var WA = "https://wa.me/918446716716?text=";
  var nav = document.getElementById("nav");
  var toggle = document.querySelector(".nav-toggle");
  var form = document.getElementById("enquiry-form");
  var lastY = 0;

  function encodeEnquiry(lines) {
    return WA + encodeURIComponent(lines.join("\n"));
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!nav) return;
      var y = window.scrollY || 0;
      if (y > 24) {
        nav.classList.add("is-scrolled");
      } else {
        nav.classList.remove("is-scrolled");
      }
      if (y > 80 && y > lastY && !nav.classList.contains("is-open")) {
        nav.classList.add("is-hidden");
      } else {
        nav.classList.remove("is-hidden");
      }
      lastY = y;
      updateActiveNav();
    },
    { passive: true }
  );

  function updateActiveNav() {
    if (!nav) return;
    var links = nav.querySelectorAll(".nav-links a[href^='#']");
    if (!links.length) return;
    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) sections.push({ id: id, el: el, link: link });
    });
    var y = (window.scrollY || 0) + 120;
    var current = sections[0] && sections[0].id;
    sections.forEach(function (item) {
      if (item.el.offsetTop <= y) current = item.id;
    });
    links.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + current;
      link.classList.toggle("is-active", active);
    });
  }

  updateActiveNav();

  /* Catalogue filter chips */
  var chips = document.querySelectorAll(".cat-filters .chip");
  var cards = document.querySelectorAll(".cat-card");

  function applyFilter(filter) {
    cards.forEach(function (card) {
      var cats = (card.getAttribute("data-cats") || "").split(/\s+/);
      var show = filter === "all" || cats.indexOf(filter) !== -1;
      card.classList.toggle("is-filtered-out", !show);
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filter = chip.getAttribute("data-filter") || "all";
      chips.forEach(function (c) {
        c.classList.toggle("is-active", c === chip);
      });
      applyFilter(filter);
    });
  });

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = (document.getElementById("name").value || "").trim();
      var company = (document.getElementById("company").value || "").trim();
      var occasion = (document.getElementById("occasion").value || "").trim();
      var message = (document.getElementById("message").value || "").trim();
      if (!name || !occasion || !message) return;

      var lines = [
        "Hello Karowish — a new enquiry.",
        "",
        "Name: " + name,
        company ? "Company: " + company : "Company: —",
        "Occasion: " + occasion,
        "",
        message
      ];
      window.location.href = encodeEnquiry(lines);
    });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-in");
    });
  }
})();
