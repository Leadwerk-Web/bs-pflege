const root = document.documentElement;
root.classList.add("js");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobileMq = window.matchMedia("(max-width: 767px)");
const tabletNavMq = window.matchMedia("(max-width: 1024px)");

const header = document.querySelector(".site-header");
if (header) {
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const setNavOpen = (open) => {
  document.body.classList.toggle("nav-open", open);
  navToggle?.setAttribute("aria-expanded", open ? "true" : "false");
};
if (navToggle) {
  navToggle.addEventListener("click", () => {
    setNavOpen(!document.body.classList.contains("nav-open"));
  });
}
navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNavOpen(false));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavOpen(false);
});
const onNavBreakpoint = () => {
  if (!tabletNavMq.matches) setNavOpen(false);
};
tabletNavMq.addEventListener?.("change", onNavBreakpoint);
window.addEventListener("resize", onNavBreakpoint);

const slider = document.querySelector("[data-hero-slider]");
if (slider) {
  const slides = [...slider.querySelectorAll(".hero-slide")];
  const dots = [...slider.querySelectorAll("[data-hero-dot]")];
  let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (index < 0) index = 0;
  let timer = 0;
  let paused = false;

  const resetKenBurns = (slide) => {
    const bg = slide.querySelector(".hero-slide-bg");
    if (!bg) return;
    bg.style.transition = "none";
    bg.style.transform = "scale(1)";
    void bg.offsetWidth;
    bg.style.transition = "";
    bg.style.transform = "";
  };

  const restartHeading = (slide) => {
    const heading = slide.querySelector(".hero-heading");
    if (!heading) return;
    heading.style.animation = "none";
    void heading.offsetWidth;
    heading.style.animation = "";
  };

  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      if (!active && slide.classList.contains("is-active")) resetKenBurns(slide);
      slide.classList.toggle("is-active", active);
      if (active) restartHeading(slide);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });
  };

  const play = () => {
    window.clearInterval(timer);
    if (reduce || slides.length < 2 || paused) return;
    timer = window.setInterval(() => show(index + 1), 2900);
  };

  slider.querySelector("[data-hero-prev]")?.addEventListener("click", () => {
    show(index - 1);
    play();
  });
  slider.querySelector("[data-hero-next]")?.addEventListener("click", () => {
    show(index + 1);
    play();
  });
  dots.forEach((dot, i) => dot.addEventListener("click", () => {
    show(i);
    play();
  }));
  slider.addEventListener("mouseenter", () => {
    paused = true;
    window.clearInterval(timer);
  });
  slider.addEventListener("mouseleave", () => {
    paused = false;
    play();
  });
  play();
}

const form = document.querySelector("#kontakt-form");
if (form && !form.closest(".leadwerk-wpforms")) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = form.getAttribute("action") || "danke.html";
  });
}

const markAnim = (element, name, delay, slow) => {
  if (!element || element.classList.contains("anim") || element.closest(".site-header, .site-footer, .hero-slider")) return;
  element.classList.add("anim");
  if (!element.getAttribute("data-anim")) element.setAttribute("data-anim", name);
  if (delay && !element.hasAttribute("data-anim-delay")) element.setAttribute("data-anim-delay", String(delay));
  if (slow) element.setAttribute("data-anim-slow", "");
};

document.querySelectorAll(".split").forEach((split) => {
  [...split.children].forEach((child) => {
    const media = child.classList.contains("media-frame") || child.querySelector(":scope > img");
    markAnim(child, media ? "fadeInRight" : "fadeInLeft");
  });
});

document.querySelectorAll(".feature-grid, .person-grid, .job-openings, .quote-grid").forEach((grid) => {
  const zoom = grid.classList.contains("person-grid") || grid.classList.contains("quote-grid");
  [...grid.children].forEach((child, index) => {
    markAnim(child, zoom ? "zoomIn" : "fadeIn", index * 200, zoom);
  });
});

document.querySelectorAll(".faq details, .opening, .feature, .contact-card, form.form, .prose").forEach((element, index) => {
  const name = element.classList.contains("contact-card") ? "fadeInRight" : "fadeIn";
  markAnim(element, name, Math.min(index * 80, 400));
});

document.querySelectorAll(".section h2, .intro-hero h1").forEach((heading) => {
  if (heading.closest(".anim")) return;
  markAnim(heading, "fadeIn", 200);
});

if ("IntersectionObserver" in window) {
  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const delay = Number(entry.target.getAttribute("data-anim-delay") || 0);
      if (delay) entry.target.style.animationDelay = `${delay}ms`;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px 0px 0px", threshold: 0 });
  document.querySelectorAll(".anim, .reveal").forEach((element) => reveal.observe(element));
} else {
  document.querySelectorAll(".anim, .reveal").forEach((element) => element.classList.add("is-visible"));
}

const fxSection = document.querySelector("[data-mouse-fx]");
if (fxSection && !reduce) {
  const layer = fxSection.querySelector(".welcome-fx");
  fxSection.addEventListener("mousemove", (event) => {
    if (!layer || mobileMq.matches) return;
    const box = fxSection.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width - 0.5) * 48;
    const y = ((event.clientY - box.top) / box.height - 0.5) * 28;
    layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}

const tiles = document.querySelector("[data-scroll-shift]");
if (tiles && !reduce) {
  const shift = () => {
    if (mobileMq.matches) {
      tiles.style.transform = "";
      return;
    }
    const box = tiles.getBoundingClientRect();
    const view = window.innerHeight || 1;
    const progress = (view - box.top) / (view + box.height);
    const x = Math.max(-72, Math.min(8, (0.5 - progress) * 48));
    tiles.style.transform = `translate3d(${x}px, 0, 0)`;
  };
  shift();
  window.addEventListener("scroll", shift, { passive: true });
  window.addEventListener("resize", shift);
}
