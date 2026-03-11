/* ============================================================
   main.js — Khan Abdullah Portfolio
   ============================================================ */

// ── Theme Toggle ─────────────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('ag-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
})();

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

document.addEventListener('DOMContentLoaded', () => {
  // ── DOM refs ────────────────────────────────────────────────
  const navbar          = document.getElementById('navbar');
  const hamburger       = document.getElementById('hamburger');
  const mobileNav       = document.getElementById('mobile-nav');
  const backToTop       = document.getElementById('back-to-top');
  const scrollProgress  = document.getElementById('scroll-progress');
  const themeToggle     = document.getElementById('theme-toggle');
  const contactForm     = document.getElementById('contact-form');
  const toast           = document.getElementById('toast');

  // ── Typewriter ──────────────────────────────────────────────
  const roles = [
    'Full Stack Developer',
    'AI Research Associate',
    'React & PHP Engineer',
    'LLM Prompt Engineer',
    'E-Commerce Builder',
    'Open Source Enthusiast',
  ];
  let rIdx = 0, cIdx = 0, deleting = false;
  const typedEl = document.getElementById('typed-role');

  function typeLoop() {
    if (!typedEl) return;
    const current = roles[rIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 45 : 75);
  }
  setTimeout(typeLoop, 2000);

  // ── Scroll Events ────────────────────────────────────────────
  function onScroll() {
    const scrollY  = window.scrollY;
    const docH     = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = docH > 0 ? (scrollY / docH) * 100 : 0;

    // progress bar
    if (scrollProgress) scrollProgress.style.width = pct + '%';

    // navbar
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 20);

    // back to top
    if (backToTop) backToTop.classList.toggle('visible', scrollY > 300);

    // active nav link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Scroll Reveal ────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  // Stagger children with data-delay
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      child.dataset.delay = i * 100;
      child.classList.add('reveal');
      revealObserver.observe(child);
    });
  });

  // ── Counter Animation ────────────────────────────────────────
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const isFloat = target % 1 !== 0;
    const interval = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = isFloat ? start.toFixed(2) : Math.floor(start);
      if (start >= target) clearInterval(interval);
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseFloat(el.dataset.target));
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // ── Theme Toggle ─────────────────────────────────────────────
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ag-theme', next);
      updateThemeIcon(next);
    });
  }

  // ── Hamburger / Mobile Nav ────────────────────────────────────
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  // ── Back to Top ───────────────────────────────────────────────
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── Project Card 3D Tilt ─────────────────────────────────────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -12;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Smooth Scroll ─────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Contact Form ──────────────────────────────────────────────
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'cf-name',    errId: 'err-name',    min: 2,   msg: 'Please enter your name (min 2 chars).' },
        { id: 'cf-email',   errId: 'err-email',   type: 'email', msg: 'Please enter a valid email address.' },
        { id: 'cf-subject', errId: 'err-subject',  min: 3,   msg: 'Subject is required.' },
        { id: 'cf-message', errId: 'err-message',  min: 10,  msg: 'Message must be at least 10 characters.' },
      ];

      fields.forEach(f => {
        const input = document.getElementById(f.id);
        const errEl = document.getElementById(f.errId);
        let ok = true;

        if (f.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        } else {
          ok = input.value.trim().length >= (f.min || 1);
        }

        input.classList.toggle('error', !ok);
        if (errEl) {
          errEl.textContent = f.msg;
          errEl.classList.toggle('visible', !ok);
        }
        if (!ok) valid = false;

        input.addEventListener('input', () => {
          input.classList.remove('error');
          if (errEl) errEl.classList.remove('visible');
        }, { once: true });
      });

      if (valid) {
        const btn = contactForm.querySelector('.form-submit');
        const originalHTML = btn.innerHTML;

        // Show loading state
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
          const formData = new FormData(contactForm);
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();

          if (result.success) {
            btn.classList.add('success');
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            showToast('🚀 Thanks! Your message has been sent successfully.');
            contactForm.reset();
            setTimeout(() => {
              btn.classList.remove('success');
              btn.innerHTML = originalHTML;
              btn.disabled = false;
            }, 4000);
          } else {
            throw new Error(result.message || 'Something went wrong');
          }
        } catch (error) {
          btn.innerHTML = '<i class="fas fa-times"></i> Failed to Send';
          showToast('❌ Failed to send message. Please try again or email directly.');
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
          }, 3000);
        }
      }
    });
  }

  // ── Toast ─────────────────────────────────────────────────────
  function showToast(msg) {
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // ── tsParticles ───────────────────────────────────────────────
  if (typeof tsParticles !== 'undefined') {
    tsParticles.load('particles-canvas', {
      fullScreen: false,
      fpsLimit: 60,
      particles: {
        number: { value: 60, density: { enable: true, area: 900 } },
        color: { value: ['#8b5cf6','#3b82f6','#06b6d4','#10b981'] },
        shape: { type: 'circle' },
        opacity: { value: { min: 0.1, max: 0.5 }, animation: { enable: true, speed: 0.8, sync: false } },
        size: { value: { min: 1, max: 3 } },
        links: {
          enable: true,
          distance: 130,
          color: '#8b5cf6',
          opacity: 0.15,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: 'none',
          random: true,
          outModes: { default: 'bounce' },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'repulse' },
          onClick: { enable: true, mode: 'push' },
        },
        modes: {
          repulse: { distance: 80, duration: 0.4 },
          push: { quantity: 2 },
        },
      },
      detectRetina: true,
    });
  }

  // ── Keyboard Focus Trap for Mobile Nav ───────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      hamburger.focus();
    }
  });
});
