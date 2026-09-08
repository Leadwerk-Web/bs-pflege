const root = document.documentElement;
root.classList.add("js");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const header = document.querySelector(".site-header");
if (header) {
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

const navToggle = document.querySelector(".nav-toggle");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
    const open = document.body.classList.contains("nav-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

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

if ("IntersectionObserver" in window) {
  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const delay = Number(entry.target.getAttribute("data-anim-delay") || 0);
      window.setTimeout(() => entry.target.classList.add("is-visible"), delay);
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  document.querySelectorAll(".anim, .reveal").forEach((element) => reveal.observe(element));
} else {
  document.querySelectorAll(".anim, .reveal").forEach((element) => element.classList.add("is-visible"));
}

const fxSection = document.querySelector("[data-mouse-fx]");
if (fxSection && !reduce) {
  const layer = fxSection.querySelector(".welcome-fx");
  fxSection.addEventListener("mousemove", (event) => {
    if (!layer) return;
    const box = fxSection.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width - 0.5) * 48;
    const y = ((event.clientY - box.top) / box.height - 0.5) * 28;
    layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}

const tiles = document.querySelector("[data-scroll-shift]");
if (tiles && !reduce) {
  const shift = () => {
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
