/* Industry scroll cues — deliberately self-contained and fixed to viewport so they cannot be clipped by hero layout. */
(function () {
  function init() {
    if (document.getElementById('pp-industry-scroll-style')) return;
    var style = document.createElement('style');
    style.id = 'pp-industry-scroll-style';
    style.textContent = '\
.ind-scroll-cue{position:fixed!important;left:50%!important;bottom:26px!important;z-index:400!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;opacity:.55!important;visibility:visible!important;transform:translateX(-50%)!important;transition:opacity .3s ease,transform .3s ease!important;background:none!important;border:none!important;padding:0!important;margin:0!important}.ind-scroll-cue:hover{opacity:1!important}.ind-scroll-cue.is-scrolled{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateX(-50%) translateY(10px)!important}.ind-scroll-cue--down{width:20px!important;height:32px!important;border:1.6px solid var(--border-hover,var(--bdr-md,#c9c2b4))!important;border-radius:11px!important}.ind-scroll-wheel{position:absolute!important;top:6px!important;width:3px!important;height:6px!important;border-radius:3px!important;background:var(--gold,#c49a42)!important;animation:ppScrollWheel 1.8s ease-in-out infinite!important}.ind-scroll-arrow{display:none!important}.ind-scroll-label{display:none!important}.ind-scroll-cue--up{width:28px!important;height:28px!important;color:var(--gold,#c49a42)!important}.ind-scroll-cue--up svg{width:15px!important;height:15px!important;animation:ppScrollUp 1.6s ease-in-out infinite!important}.ind-scroll-top-wrap{position:relative!important;display:flex!important;justify-content:center!important;padding:25px 20px 60px!important;background:var(--bg,#fff)!important}.ind-scroll-top-wrap .ind-scroll-cue{position:relative!important;left:auto!important;bottom:auto!important;transform:none!important;z-index:10!important}@keyframes ppScrollWheel{0%{transform:translateY(0);opacity:1}70%{transform:translateY(13px);opacity:0}100%{transform:translateY(13px);opacity:0}}@keyframes ppScrollUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}@media(prefers-reduced-motion:reduce){.ind-scroll-wheel,.ind-scroll-cue--up svg{animation:none!important}}';
    document.head.appendChild(style);

    var hero = document.querySelector('.ind-hero');
    if (!hero) return;

    var down = document.querySelector('.ind-scroll-cue--down');
    if (!down) {
      down = makeCue('down', 'SCROLL TO EXPLORE');
      document.body.appendChild(down);
    }
    down.addEventListener('click', function () {
      var target = hero.nextElementSibling || document.querySelector('.ind-body');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    function addTop() {
      if (document.querySelector('.ind-scroll-top-wrap')) return;
      var contact = document.querySelector('[data-pp="contact-section"]') || document.querySelector('[data-pp="contact-slot"]');
      if (!contact) return;
      var wrap = document.createElement('div');
      wrap.className = 'ind-scroll-top-wrap';
      var up = makeCue('up', 'BACK TO TOP');
      wrap.appendChild(up);
      contact.insertAdjacentElement('afterend', wrap);
      up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }
    addTop();
    new MutationObserver(addTop).observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', function () {
      down.classList.toggle('is-scrolled', window.scrollY > 90);
    }, { passive: true });
  }

  function makeCue(direction, label) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'ind-scroll-cue ind-scroll-cue--' + direction;
    button.setAttribute('aria-label', label);
    if (direction === 'up') {
      button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
    } else {
      button.innerHTML = '<span class="ind-scroll-wheel"></span>';
    }
    return button;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
