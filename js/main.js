(() => {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const dropdown = document.querySelector(".nav-dropdown");
  const dropdownTrigger = document.querySelector(".dropdown-trigger");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      if (!open) dropdown?.classList.remove("open");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
        dropdown?.classList.remove("open");
        dropdownTrigger?.setAttribute("aria-expanded", "false");
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1000) closeMenu();
    });
  }

  if (dropdown && dropdownTrigger) {
    dropdownTrigger.addEventListener("click", event => {
      event.stopPropagation();
      const open = !dropdown.classList.contains("open");
      dropdown.classList.toggle("open", open);
      dropdownTrigger.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", event => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("open");
        dropdownTrigger.setAttribute("aria-expanded", "false");
      }
    });
    dropdown.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        dropdown.classList.remove("open");
        dropdownTrigger.setAttribute("aria-expanded", "false");
        dropdownTrigger.focus();
      }
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
