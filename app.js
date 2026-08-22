(() => {
  const body = document.body;
  const nav = document.querySelector('.nav');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const menuButton = document.getElementById('menuButton');
  const sideNav = document.getElementById('sideNav');
  const menuScrim = document.getElementById('menuScrim');
  const presentButton = document.getElementById('presentButton');
  const printButton = document.getElementById('printButton');
  const progressBar = document.getElementById('progressBar');

  const closeMenu = () => {
    sideNav?.classList.remove('open');
    menuScrim?.classList.remove('show');
    menuButton?.setAttribute('aria-expanded', 'false');
  };

  menuButton?.addEventListener('click', () => {
    const open = !sideNav.classList.contains('open');
    sideNav.classList.toggle('open', open);
    menuScrim.classList.toggle('show', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menuScrim?.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  const updateActive = () => {
    const marker = window.scrollY + Math.min(window.innerHeight * 0.38, 300);
    let activeId = sections[0]?.id;
    for (const section of sections) {
      if (section.offsetTop <= marker) activeId = section.id;
    }
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('active', active);
      if (active && nav) {
        const top = link.offsetTop - nav.clientHeight / 2 + link.clientHeight / 2;
        nav.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    });
  };

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progressBar) progressBar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateActive();
      updateProgress();
      ticking = false;
    });
  }, { passive: true });

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' })
    : null;

  document.querySelectorAll('.reveal').forEach(el => {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add('visible');
  });

  let exitButton;
  const setPresentMode = enabled => {
    body.classList.toggle('present-mode', enabled);
    if (enabled) {
      closeMenu();
      exitButton = document.createElement('button');
      exitButton.className = 'present-exit';
      exitButton.textContent = 'Exit presentation';
      exitButton.addEventListener('click', () => setPresentMode(false));
      body.appendChild(exitButton);
    } else {
      exitButton?.remove();
      exitButton = null;
    }
  };

  presentButton?.addEventListener('click', () => setPresentMode(true));
  printButton?.addEventListener('click', () => window.print());
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && body.classList.contains('present-mode')) setPresentMode(false);
  });

  /* Mobile navigation fallback for the study navigation injected at deploy time. */
  const setStudyMobileOpen = open => {
    const drawer = document.querySelector('.study-mobile-drawer');
    const trigger = document.querySelector('.study-mobile-menu');
    body.classList.toggle('study-mobile-open', open);
    trigger?.setAttribute('aria-expanded', String(open));
    drawer?.setAttribute('aria-hidden', String(!open));
  };

  const mobileNavStyle = document.createElement('style');
  mobileNavStyle.textContent = `
    @media(max-width:1050px){
      .study-mobile-menu{pointer-events:auto!important;position:relative;z-index:2}
      .study-mobile-drawer[aria-hidden="false"]{transform:translateY(0)!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important}
      .study-mobile-drawer[aria-hidden="true"]{pointer-events:none!important}
    }
  `;
  document.head.appendChild(mobileNavStyle);

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (target.closest('.study-mobile-menu')) {
      setStudyMobileOpen(true);
      return;
    }

    if (target.closest('.study-mobile-close')) {
      setStudyMobileOpen(false);
      return;
    }

    const mobileLink = target.closest('.study-mobile-nav a');
    if (mobileLink) setStudyMobileOpen(false);
  });

  const loadWhatsAppCTA = () => {
    if (!document.querySelector('link[data-whatsapp-cta]')) {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = 'whatsapp-cta.css?v=20260822c';
      style.dataset.whatsappCta = 'true';
      document.head.appendChild(style);
    }

    if (!document.querySelector('script[data-whatsapp-cta]')) {
      const script = document.createElement('script');
      script.src = 'whatsapp-cta.js?v=20260822c';
      script.dataset.whatsappCta = 'true';
      document.body.appendChild(script);
    }
  };

  updateActive();
  updateProgress();
  loadWhatsAppCTA();
})();
