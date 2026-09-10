const trackEvent = (name, params = {}) => {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
};

const sectionTitles = {
  about: "About",
  experience: "Experience",
  project: "Projects",
};

const trackPageView = (path) => {
  const section = path.replace(/^\//, "");
  const title = sectionTitles[section]
    ? `Saleha Shujaat — ${sectionTitles[section]}`
    : "Saleha Shujaat";
  const pagePath = path || "/";

  trackEvent("page_view", {
    page_title: title,
    page_location: `${window.location.origin}${pagePath}`,
    page_path: pagePath,
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".sidebar a");
  const themeToggle = document.getElementById("theme-toggle");

  const applyTheme = (theme) => {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);

    if (themeToggle) {
      const icon = themeToggle.querySelector("i");
      if (theme === "light") {
        themeToggle.setAttribute("aria-label", "Switch to dark theme");
        if (icon) icon.className = "fa fa-moon-o";
      } else {
        themeToggle.setAttribute("aria-label", "Switch to light theme");
        if (icon) icon.className = "fa fa-sun-o";
      }
    }
  };

  applyTheme(localStorage.getItem("theme") === "light" ? "light" : "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        document.documentElement.getAttribute("data-theme") === "light"
          ? "dark"
          : "light";
      applyTheme(nextTheme);
    });
  }

  // Handle navigation clicks
  navLinks.forEach((link) => {
    if (link.getAttribute("href").startsWith("/")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").slice(1); // Remove the leading slash
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
          const path = link.getAttribute("href");
          window.history.pushState({}, "", path);
          trackPageView(path);
          trackEvent("nav_click", {
            section: targetId,
            link_text: link.textContent.trim(),
          });
        }
      });
    }
  });

  // Handle scroll for active section highlighting
  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPosition = window.pageYOffset;

    // If at the very top, highlight 'about'
    if (scrollPosition < 100) {
      current = "about";
    } else {
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop - sectionHeight / 3) {
          current = section.getAttribute("id");
        }
      });
    }

    navLinks.forEach((link) => {
      link.parentElement.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.parentElement.classList.add("active");
      }
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener("popstate", () => {
    const targetId = window.location.pathname.slice(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
      trackPageView(window.location.pathname);
    }
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link || !link.href) return;

    const href = link.getAttribute("href") || "";
    const text = link.textContent.replace(/\s+/g, " ").trim();
    const url = link.href;

    if (url.includes("calendly.com")) {
      trackEvent("book_call", {
        link_url: url,
        link_text: text,
      });
      return;
    }

    if (link.hasAttribute("download") || href.endsWith(".pdf")) {
      trackEvent("file_download", {
        file_name: href.split("/").pop(),
        file_extension: "pdf",
        link_text: text,
        link_url: url,
        method: link.hasAttribute("download") ? "download" : "view",
      });
      return;
    }

    if (link.closest(".project-card")) {
      const project =
        link.closest(".project-card").querySelector(".project-title")
          ?.childNodes[0]?.textContent?.trim() || text;
      trackEvent("select_content", {
        content_type: "project",
        item_id: project,
        link_url: url,
      });
      return;
    }

    if (link.closest(".footer") || link.hostname !== window.location.hostname) {
      trackEvent("outbound_click", {
        link_url: url,
        link_text: text,
        link_domain: link.hostname,
      });
    }
  });
});

(() => {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const minVisibleMs = window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches
    ? 400
    : 2100;
  const shownAt = Date.now();

  const dismiss = () => {
    loader.classList.add("loader--done");
    loader.addEventListener(
      "transitionend",
      () => loader.remove(),
      { once: true }
    );
    setTimeout(() => loader.remove(), 700);
  };

  window.addEventListener("load", () => {
    const wait = Math.max(0, minVisibleMs - (Date.now() - shownAt));
    setTimeout(dismiss, wait);
  });
})();
