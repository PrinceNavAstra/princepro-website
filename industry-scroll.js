(() => {
  if (window.__industryScrollReady) return;
  window.__industryScrollReady = true;

  const loadStyles = () => {
    if (document.querySelector('link[data-industry-scroll-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'industry-scroll.css?v=20260917-1';
    link.dataset.industryScrollCss = 'true';
    document.head.appendChild(link);
  };

  const makeIndicator = (direction, target, label) => {
    const link = document.createElement('a');
    link.className = `industry-scroll-indicator${direction === 'up' ? ' up' : ''}`;
    link.href = target;
    link.setAttribute('aria-label', label);
    link.innerHTML = `<span class="industry-scroll-mouse" aria-hidden="true"></span><span class="industry-scroll-arrow" aria-hidden="true">${direction === 'up' ? '↑' : '↓'}</span><span class="industry-scroll-label">${label}</span>`;
    return link;
  };

  const init = () => {
    loadStyles();
    const hero = document.querySelector('.ind-hero');
    if (!hero || hero.querySelector('.industry-scroll-indicator')) return;

    const nextSection = hero.nextElementSibling;
    if (nextSection) {
      if (!nextSection.id) nextSection.id = 'industry-content-start';
      hero.appendChild(makeIndicator('down', `#${nextSection.id}`, 'SCROLL TO EXPLORE'));
    }

    const contact = document.querySelector('[data-pp="contact-slot"]');
    if (contact && !document.querySelector('.industry-scroll-bottom')) {
      const bottom = document.createElement('div');
      bottom.className = 'industry-scroll-bottom';
      bottom.appendChild(makeIndicator('up', '#top', 'BACK TO TOP'));
      contact.insertAdjacentElement('afterend', bottom);
    }

    if (!document.getElementById('top')) hero.id = 'top';

    document.querySelectorAll('.industry-scroll-indicator').forEach((indicator) => {
      indicator.addEventListener('click', (event) => {
        const selector = indicator.getAttribute('href');
        if (!selector || !selector.startsWith('#')) return;
        const target = document.querySelector(selector);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const downIndicator = hero.querySelector('.industry-scroll-indicator:not(.up)');
    const updateVisibility = () => {
      if (!downIndicator) return;
      downIndicator.classList.toggle('is-hidden', window.scrollY > 90);
    };
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
