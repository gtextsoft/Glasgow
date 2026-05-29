/**
 * Glasgow CEOs & Founders Meet & Greet
 * Vanilla JS — nav, sticky CTA, countdown, modal, scroll reveals
 */

// --- Editable event date (24 July, current year) ---
const EVENT_DATE = new Date(new Date().getFullYear(), 6, 24, 18, 0, 0); // month 6 = July

// --- Formspree endpoint ---
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xojbrgaw";

(function () {
  "use strict";

  const header = document.getElementById("site-header");
  const hero = document.getElementById("hero");
  const navToggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const ctaHeader = document.querySelector(".btn--cta-header");
  const mobileCtaBar = document.getElementById("mobile-cta-bar");
  const modal = document.getElementById("register-modal");
  const form = document.getElementById("register-form");
  const formSuccess = document.getElementById("form-success");
  const formError = document.getElementById("form-error");
  const formSubmitBtn = document.getElementById("form-submit-btn");

  // --- Hero load animation ---
  if (hero) {
    requestAnimationFrame(function () {
      hero.classList.add("is-loaded");
    });
  }

  // --- Sticky header + CTA visibility ---
  let heroBottom = 0;

  function updateHeroBounds() {
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    heroBottom = rect.bottom + window.scrollY;
  }

  function onScroll() {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle("is-scrolled", y > 40);
    }
    if (hero) {
      const pastHero = y > heroBottom - header.offsetHeight - 20;

      if (ctaHeader) {
        if (pastHero) {
          ctaHeader.hidden = false;
          ctaHeader.classList.add("is-visible");
        } else {
          ctaHeader.hidden = true;
          ctaHeader.classList.remove("is-visible");
        }
      }

      if (mobileCtaBar) {
        const isMobile = window.matchMedia("(max-width: 47.9875rem)").matches;
        mobileCtaBar.classList.toggle("is-visible", isMobile && pastHero);
        mobileCtaBar.setAttribute("aria-hidden", String(!(isMobile && pastHero)));
        document.body.classList.toggle("has-mobile-cta", isMobile && pastHero);
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    updateHeroBounds();
    onScroll();
  });
  updateHeroBounds();
  onScroll();

  // --- Mobile navigation ---
  function closeMobileNav() {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    mobileNav.hidden = true;
    document.body.style.overflow = "";
  }

  function openMobileNav() {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    mobileNav.hidden = false;
    document.body.style.overflow = "hidden";
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      if (open) closeMobileNav();
      else openMobileNav();
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });
  }

  // --- Smooth anchor scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
      closeMobileNav();
    });
  });

  // --- Scroll reveal ---
  const revealEls = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // --- Countdown ---
  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMins = document.getElementById("cd-mins");
  const cdSecs = document.getElementById("cd-secs");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tickCountdown() {
    const now = new Date();
    let target = new Date(EVENT_DATE);

    if (now > target) {
      target = new Date(now.getFullYear() + 1, 6, 24, 18, 0, 0);
    }

    const diff = target - now;
    if (diff <= 0) {
      if (cdDays) cdDays.textContent = "00";
      if (cdHours) cdHours.textContent = "00";
      if (cdMins) cdMins.textContent = "00";
      if (cdSecs) cdSecs.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (cdDays) cdDays.textContent = pad(days);
    if (cdHours) cdHours.textContent = pad(hours);
    if (cdMins) cdMins.textContent = pad(mins);
    if (cdSecs) cdSecs.textContent = pad(secs);
  }

  tickCountdown();
  setInterval(tickCountdown, 1000);

  // --- Registration modal ---
  function openModal() {
    if (!modal) return;
    modal.showModal();
    document.body.style.overflow = "hidden";
    const firstInput = modal.querySelector("input, select");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.close();
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
    btn.addEventListener("click", openModal);
  });

  document.querySelectorAll("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

  if (modal) {
    modal.addEventListener("cancel", function (e) {
      e.preventDefault();
      closeModal();
    });

    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
  }

  // --- FAQ accordion ---
  document.querySelectorAll(".faq-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const panelId = trigger.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;

      trigger.setAttribute("aria-expanded", String(!expanded));
      if (panel) {
        panel.hidden = expanded;
      }
    });
  });

  // --- Form validation & submit ---
  const validators = {
    name: function (v) {
      return v.trim().length >= 2 ? "" : "Please enter your full name.";
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? ""
        : "Please enter a valid email address.";
    },
    phone: function (v) {
      return v.trim().length >= 8 ? "" : "Please enter a valid phone number.";
    },
    company: function (v) {
      return v.trim().length >= 1 ? "" : "Please enter your company name.";
    },
  };

  function setFieldError(id, message) {
    const input = document.getElementById(id);
    const err = document.getElementById("err-" + id.replace("reg-", ""));
    if (input) input.classList.toggle("is-invalid", !!message);
    if (err) err.textContent = message;
  }

  function validateForm() {
    let valid = true;
    const fields = [
      { id: "reg-name", key: "name" },
      { id: "reg-email", key: "email" },
      { id: "reg-phone", key: "phone" },
      { id: "reg-company", key: "company" },
    ];

    fields.forEach(function (f) {
      const el = document.getElementById(f.id);
      const val = el ? el.value : "";
      const msg = validators[f.key](val);
      const errId = f.id.replace("reg-", "");
      const errEl = document.getElementById("err-" + errId);
      if (el) el.classList.toggle("is-invalid", !!msg);
      if (errEl) errEl.textContent = msg;
      if (msg) valid = false;
    });

    return valid;
  }

  function hideFormError() {
    if (formError) {
      formError.hidden = true;
      formError.textContent = "";
    }
  }

  function showFormError(message) {
    if (formError) {
      formError.textContent = message;
      formError.hidden = false;
    }
  }

  function setSubmitLoading(isLoading) {
    if (!formSubmitBtn) return;
    formSubmitBtn.disabled = isLoading;
    formSubmitBtn.classList.toggle("is-loading", isLoading);
    formSubmitBtn.textContent = isLoading ? "Sending…" : "Submit registration";
  }

  async function submitToFormspree() {
    const endpoint = form.getAttribute("action") || FORMSPREE_ENDPOINT;
    const response = await fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      return;
    }

    let message = "Something went wrong. Please try again or email PRODUCTS@STEPHENAKINTAYO.COM.";
    try {
      const data = await response.json();
      if (data && data.errors && data.errors.length) {
        message = data.errors.map(function (err) {
          return err.message;
        }).join(" ");
      } else if (data && data.error) {
        message = data.error;
      }
    } catch (parseErr) {
      /* use default message */
    }
    throw new Error(message);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideFormError();
      if (!validateForm()) return;

      setSubmitLoading(true);

      submitToFormspree()
        .then(function () {
          form.reset();
          form.hidden = true;
          hideFormError();
          if (formSuccess) {
            formSuccess.hidden = false;
          }
        })
        .catch(function (err) {
          showFormError(err.message || "Unable to submit. Please try again.");
        })
        .finally(function () {
          setSubmitLoading(false);
        });
    });

    form.querySelectorAll("input:not([type='hidden']), select").forEach(function (input) {
      input.addEventListener("input", function () {
        const key = input.name;
        if (validators[key]) {
          const msg = validators[key](input.value);
          setFieldError(input.id, msg);
        }
      });
    });
  }
})();
