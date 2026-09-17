/* Industry scroll cues — identical cyan filled mouse indicator at hero and contact bottom. */
(function () {
  function init() {
    if (document.getElementById('pp-industry-scroll-style')) return;

    var style = document.createElement('style');
    style.id = 'pp-industry-scroll-style';
    style.textContent = '\
.ind-scroll-cue{position:fixed!important;left:50%!important;bottom:22px!important;z-index:9999!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;opacity:.95!important;visibility:visible!important;transform:translateX(-50%)!important;transition:opacity .3s ease,transform .3s ease!important;background:none!important;border:0!important;outline:0!important;padding:0!important;margin:0!important;width:18px!important;height:32px!important;pointer-events:auto!important}.ind-scroll-cue:hover{opacity:1!important}.ind-scroll-cue.is-scrolled{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateX(-50%) translateY(6px)!important}.ind-scroll-cue--down,.ind-scroll-cue--up{width:18px!important;height:32px!important;border:2px solid #20d9e8!important;border-radius:10px!important;box-shadow:0 0 12px rgba(32,217,232,.3)!important;color:transparent!important}.ind-scroll-wheel{position:absolute!important;top:4px!important;width:6px!important;height:10px!important;border-radius:5px!important;background:#20d9e8!important;box-shadow:0 0 8px rgba(32,217,232,.75)!important;animation:ppScrollWheel 1.7s ease-in-out infinite!important}.ind-scroll-arrow,.ind-scroll-label,.ind-scroll-cue--up svg{display:none!important}.ind-scroll-top-wrap{position:relative!important;display:flex!important;justify-content:center!important;padding:18px 20px 42px!important;background:var(--bg,#fff)!important}.ind-scroll-top-wrap .ind-scroll-cue{position:relative!important;left:auto!important;bottom:auto!important;transform:none!important;z-index:10!important}@keyframes ppScrollWheel{0%{transform:translateY(0);opacity:1}70%{transform:translateY(10px);opacity:0}100%{transform:translateY(10px);opacity:0}}@media(max-width:560px){.ind-scroll-cue{bottom:16px!important;width:16px!important;height:29px!important}.ind-scroll-cue--down,.ind-scroll-cue--up{width:16px!important;height:29px!important;border-radius:9px!important}.ind-scroll-wheel{top:4px!important;width:5px!important;height:9px!important}.ind-scroll-top-wrap{padding-bottom:36px!important}}@media(prefers-reduced-motion:reduce){.ind-scroll-wheel{animation:none!important}}';
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
    button.innerHTML = '<span class="ind-scroll-wheel"></span>';
    return button;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
