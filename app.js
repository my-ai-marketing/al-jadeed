(() => {
  const body = document.body;
  const nav = document.querySelector('.nav');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const menuButton = document.getElementById('menuButton');
  const sideNav = document.getElementById('sideNav');
  const menuScrim = document.getElementById('menuScrim');
  const presentButton = document.getElementById('presentButton');
  const progressBar = document.getElementById('progressBar');

  const removeExportPDF = () => {
    document.getElementById('printButton')?.remove();
    document.querySelectorAll('[data-study-pdf]').forEach(el => el.remove());
  };

  removeExportPDF();

  const pdfCleanupObserver = new MutationObserver(() => removeExportPDF());
  pdfCleanupObserver.observe(document.documentElement, { childList: true, subtree: true });

  const loadTypographyFix = () => {
    if (!document.querySelector('link[data-typography-fix]')) {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = 'typography-fix.css?v=20260822d';
      style.dataset.typographyFix = 'true';
      document.head.appendChild(style);
    }

    if (!document.querySelector('link[data-typography-complete]')) {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = 'typography-complete.css?v=20260822a';
      style.dataset.typographyComplete = 'true';
      document.head.appendChild(style);
    }

    if (!document.querySelector('link[data-commercial-theme]')) {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = 'commercial-theme.css?v=20260822a';
      style.dataset.commercialTheme = 'true';
      document.head.appendChild(style);
    }
  };

  const loadGrowthMobileFix = () => {
    if (document.querySelector('style[data-growth-mobile-fix]')) return;
    const style = document.createElement('style');
    style.dataset.growthMobileFix = 'true';
    style.textContent = `
      @media(max-width:760px){
        #growth{
          padding-top:54px!important;
          padding-bottom:58px!important;
        }
        #growth .section-head{
          max-width:100%!important;
        }
        #growth .section-label{
          font-size:11px!important;
          line-height:1.4!important;
          margin-bottom:12px!important;
        }
        #growth .display.small{
          font-size:clamp(34px,10vw,42px)!important;
          line-height:1.02!important;
          letter-spacing:-.04em!important;
          max-width:100%!important;
        }
        #growth .growth-path{
          display:grid!important;
          grid-template-columns:1fr!important;
          gap:10px!important;
          margin-top:26px!important;
          position:relative!important;
        }
        #growth .growth-path:before{
          content:"";
          position:absolute;
          left:23px;
          top:24px;
          bottom:24px;
          width:1px;
          background:linear-gradient(180deg,rgba(242,207,122,.45),rgba(201,154,60,.08));
          pointer-events:none;
        }
        #growth .growth-path article{
          position:relative!important;
          min-height:0!important;
          padding:20px 18px 20px 52px!important;
          border-radius:16px!important;
          border:1px solid var(--line)!important;
          background:linear-gradient(145deg,rgba(201,154,60,.045),transparent 58%),var(--surface)!important;
          box-shadow:inset 0 1px 0 rgba(255,248,230,.025)!important;
          overflow:hidden!important;
        }
        #growth .growth-path article:before{
          content:"";
          position:absolute;
          left:18px;
          top:22px;
          width:11px;
          height:11px;
          border-radius:50%;
          background:var(--ink2);
          border:2px solid var(--accent2);
          box-shadow:0 0 18px rgba(242,207,122,.22);
          z-index:1;
        }
        #growth .growth-path article:first-child{
          border-color:rgba(242,207,122,.30)!important;
          background:linear-gradient(145deg,rgba(201,154,60,.105),transparent 62%),var(--surface)!important;
        }
        #growth .growth-path article>span{
          display:block!important;
          margin:0 0 8px!important;
          font-size:11px!important;
          line-height:1.35!important;
          letter-spacing:.14em!important;
          color:var(--accent)!important;
          font-weight:700!important;
        }
        #growth .growth-path h3{
          margin:0 0 8px!important;
          font-family:var(--display)!important;
          font-stretch:125%!important;
          font-size:22px!important;
          line-height:1.14!important;
          letter-spacing:-.025em!important;
          color:#f1e7d7!important;
        }
        #growth .growth-path p{
          margin:0!important;
          font-size:14px!important;
          line-height:1.65!important;
          color:#ad9b82!important;
        }
      }

      @media(max-width:420px){
        #growth{
          padding-left:16px!important;
          padding-right:16px!important;
        }
        #growth .growth-path:before{
          left:21px;
        }
        #growth .growth-path article{
          padding:19px 16px 19px 48px!important;
        }
        #growth .growth-path article:before{
          left:16px;
          top:21px;
        }
        #growth .growth-path h3{
          font-size:21px!important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  loadTypographyFix();
  loadGrowthMobileFix();

  const closeMenu = () => {
    sideNav?.classList.remove('open');
    menuScrim?.classList.remove('show');
    menuButton?.setAttribute('aria-expanded', 'false');
  };

  menuButton?.addEventListener('click', () => {
    removeExportPDF();
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
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && body.classList.contains('present-mode')) setPresentMode(false);
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
