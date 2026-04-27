// ── NAVBAR SCROLL EFFECT ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── MOBILE NAV TOGGLE ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── THEME TOGGLE ──
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');
const savedTheme  = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeIcon.textContent = next === 'light' ? '☀️' : '🌙';
});

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── SKILL BAR ANIMATION ──
const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sb-fill').forEach((fill, i) => {
          setTimeout(() => fill.classList.add('animated'), i * 120);
        });
        skillBarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll('.skill-bar-group').forEach(g => skillBarObserver.observe(g));

// ── ACTIVE NAV LINK HIGHLIGHT ──
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active-nav', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35 }
);
sections.forEach(s => sectionObserver.observe(s));

// ── STAGGERED REVEAL FOR GRID CHILDREN ──
document.querySelectorAll('.skills-bars-grid, .projects-grid, .about-cards, .edu-grid').forEach(grid => {
  const children = grid.querySelectorAll('.skill-bar-group, .project-card, .info-card, .edu-card');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 60}ms`;
  });
});

// ── COUNTER ANIMATION FOR STATS ──
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1600;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}
const statNums = document.querySelectorAll('.stat-num');
const statsTargets   = [6, 99, 0, 70];
const statsSuffixes  = ['+', '%', '', '%'];
let statsAnimated = false;
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    statNums.forEach((el, i) => animateCounter(el, statsTargets[i], statsSuffixes[i]));
  }
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── CURSOR GLOW ──
const glow = document.createElement('div');
glow.style.cssText = `
  position:fixed;width:300px;height:300px;pointer-events:none;z-index:0;
  border-radius:50%;background:radial-gradient(circle,rgba(91,141,238,0.07) 0%,transparent 70%);
  transform:translate(-50%,-50%);transition:opacity 0.3s ease;
`;
document.body.appendChild(glow);
window.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ── CARD TILT ──
document.querySelectorAll('.skill-bar-group, .project-card, .timeline-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── CONTACT FORM SUBMIT (AJAX via Formspree) ──
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('formSubmitBtn');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        formSuccess.style.display = 'block';
        contactForm.reset();
      } else {
        submitBtn.textContent = 'Failed — Try Again';
      }
    } catch {
      submitBtn.textContent = 'Error — Try Again';
    } finally {
      submitBtn.disabled = false;
      if (formSuccess.style.display !== 'block') {
        submitBtn.textContent = 'Send Message ✉️';
      }
    }
  });
}

// ── NAVBAR ACTIVE STYLE ──
const style = document.createElement('style');
style.textContent = `.nav-links a.active-nav { color: var(--text) !important; -webkit-text-fill-color: var(--text) !important; }`;
document.head.appendChild(style);
