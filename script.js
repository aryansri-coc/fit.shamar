// ============================================
// Mobile nav toggle
// ============================================
const navBurger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');

navBurger.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('is-open');
  navBurger.setAttribute('aria-expanded', String(isOpen));
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('is-open');
    navBurger.setAttribute('aria-expanded', 'false');
  });
});

// ============================================
// Scroll reveal
// ============================================
const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

// ============================================
// Hero rep / stat counters
// ============================================
const counterEls = document.querySelectorAll('.counter-num');

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (prefersReducedMotion) {
  counterEls.forEach(el => {
    el.textContent = el.dataset.target + (el.dataset.suffix || '');
  });
} else {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counterEls.forEach(el => counterObserver.observe(el));
}

// ============================================
// Contact form (front-end only demo)
// ============================================
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = "Thanks — that's saved. Connect this form to your email or booking tool to receive submissions.";
  contactForm.reset();
});

// ============================================
// Style Switcher (Concept Selector)
// ============================================
const switcherBtns = document.querySelectorAll('.switcher-btn');

switcherBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // 1. Remove active class from buttons
    switcherBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 2. Update body class
    const styleId = btn.dataset.style;
    document.body.className = document.body.className.replace(/\btheme-style-\d+\b/g, '').trim();
    document.body.classList.add(`theme-style-${styleId}`);

    // 3. Auto-reveal elements inside the active hero style instantly
    const activeHero = document.querySelector(`.hero-inner-style-${styleId}, .hero-inner-ref`);
    if (activeHero) {
      activeHero.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('is-visible');
      });
    }

    // 4. Re-run counter animations if style 3 (Reference Style) is active
    if (styleId === '3') {
      const activeCounters = activeHero.querySelectorAll('.counter-num');
      activeCounters.forEach(el => {
        // Reset text
        el.textContent = '0';
        // Trigger animation
        animateCounter(el);
      });
    }
  });
});

// Auto-reveal elements of active theme on page load
window.addEventListener('DOMContentLoaded', () => {
  const activeHero = document.querySelector('.hero-inner-style-1');
  if (activeHero) {
    activeHero.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('is-visible');
    });
  }
});
