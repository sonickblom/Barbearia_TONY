/* ============================================================
   BARBEARIA TONY — interações
   Menu mobile, reveal on scroll, lightbox, menu ativo,
   destaque do horário de hoje e ano no rodapé.
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- MENU MOBILE ---------------- */
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menu");
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && nav.classList.contains("open")) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) closeMenu();
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("open")) return;
      if (nav.contains(e.target) || menuBtn.contains(e.target)) return;
      closeMenu();
    });
  }

  /* ---------------- HEADER AO ROLAR ---------------- */
  var header = document.querySelector(".header");
  var topSentinel = document.getElementById("topSentinel");

  if (header && topSentinel && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle("scrolled", !entries[0].isIntersecting);
    }).observe(topSentinel);
  }

  /* ---------------- REVEAL ON SCROLL ---------------- */
  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && reveals.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    reveals.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("vis");
    });
  }

  /* ---------------- LIGHTBOX ---------------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var items = document.querySelectorAll(".gallery-item");
  var lastFocused = null;

  function openLightbox(button) {
    var full = button.getAttribute("data-full");
    var img = button.querySelector("img");
    if (!full || !lightbox || !lightboxImg) return;

    lastFocused = document.activeElement;
    lightboxImg.src = full;
    lightboxImg.alt = img ? img.alt : "Foto ampliada";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = true;
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  items.forEach(function (button) {
    button.addEventListener("click", function () {
      openLightbox(button);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  /* ---------------- LINK ATIVO NO MENU ---------------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = nav ? nav.querySelectorAll('a[href^="#"]') : [];

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    var activeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          navLinks.forEach(function (link) {
            var ativo = link.getAttribute("href") === id;
            link.classList.toggle("is-active", ativo);
            if (ativo) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px" }
    );

    sections.forEach(function (s) {
      activeObserver.observe(s);
    });
  }

  /* ---------------- HORÁRIO DE HOJE ---------------- */
  var hours = document.getElementById("hours");
  if (hours) {
    var today = new Date().getDay();
    var rows = hours.querySelectorAll("tr[data-day]");
    rows.forEach(function (row) {
      if (Number(row.getAttribute("data-day")) === today) {
        row.classList.add("is-today");
      }
    });
  }

  /* ---------------- ANO NO RODAPÉ ---------------- */
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
