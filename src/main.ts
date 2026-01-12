import "./style.css";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item, index) => {
    const delay = Math.min(index * 80, 420);
    item.style.setProperty("--reveal-delay", `${delay}ms`);
    observer.observe(item);
  });
}

const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
if (!prefersReducedMotion && parallaxItems.length > 0) {
  let ticking = false;

  const updateParallax = () => {
    ticking = false;
    const viewportHeight = window.innerHeight;

    parallaxItems.forEach((item) => {
      const rawSpeed = Number.parseFloat(item.dataset.parallax ?? "");
      const speed = Number.isFinite(rawSpeed) ? rawSpeed : 0.25;
      const anchor = item.parentElement ?? item;
      const rect = anchor.getBoundingClientRect();
      const distance = rect.top + rect.height / 2 - viewportHeight / 2;
      const offset = Math.round(distance * speed * -0.2);
      item.style.setProperty("--parallax-offset", `${offset}px`);
    });
  };

  const onScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateParallax);
  };

  updateParallax();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

const yearEl = document.querySelector<HTMLElement>("[data-year]");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const scrollLinks = document.querySelectorAll<HTMLAnchorElement>("[data-scroll]");
scrollLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) {
      return;
    }

    const target = document.querySelector<HTMLElement>(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  });
});

const mockLinks = document.querySelectorAll<HTMLAnchorElement>("[data-mock]");
mockLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  });
});
