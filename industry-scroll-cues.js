/* Industry scroll cues — identical cyan mouse for hero and contact bottom. */
(function () {
  function init() {
    if (document.getElementById('pp-industry-scroll-style')) return;

    var style = document.createElement('style');
    style.id = 'pp-industry-scroll-style';
    style.textContent = '\
.ind-scroll-cue{position:fixed!important;left:50%!important;bottom:22px!important;width:36px!important;height:48px!important;min-width:36px!important;min-height:48px!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important;box-shadow:none!important;outline:0!important;display:flex!important;align-items:center!important;justify-content:center!important;z-index:99999!important;cursor:pointer!important;opacity:.96!important;visibility:visible!important;transform:translateX(-50%)!important;transition:opacity .3s ease,transform .3s ease!important;appearance:none!important;-webkit-appearance:none!important}.ind-scroll-cue:hover{opacity:1!important}.ind-scroll-cue.is-scrolled{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateX(-50%) translateY(6px)!important}.ind-scroll-mouse{position:relative!important;display:block!important;width:20px!important;height:32px!important;min-width:20px!important;min-height:32px!important;box-sizing:border-box!important;border:2px solid #20d9e8!important;border-radius:11px!important;background:rgba(32,217,232,.035)!important;box-shadow:0 0 12px rgba(32,217,232,.35),inset 0 0 7px rgba(32,217,232,.08)!important}.ind-scroll-wheel{position:absolute!important;left:50%!important;top:5px!important;width:5px!important;height:9px!important;min-width:5px!important;min-height:9px!important;border-radius:5px!important;background:#20d9e8!important;box-shadow:0 0 8px rgba(32,217,232,.9)!important;transform:translateX(-50%)!important;animation:ppScrollWheel 1.7s ease-in-out infinite!important;pointer-events:none!important}.ind-scroll-arrow,.ind-scroll-label,.ind-scroll-cue svg{display:none!important}.ind-scroll-top-wrap{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-height:72px!important;padding:14px 20px 26px!important;box-sizing:border-box!important;background:var(--bg,#fff)!important}.ind-scroll-top-wrap .ind-scroll-cue{position:relative!important;left:auto!important;bottom:auto!important;transform:none!important;z-index:10!important}.ind-scroll-top-wrap .ind-scroll-cue.is-scrolled{transform:translateY(6px)!important}@keyframes ppScrollWheel{0%{transform:translate(-50%,0);opacity:1}65%{transform:translate(-50%,11px);opacity:0}100%{transform:translate(-50%,11px);opacity:0}}@media(max-width:560px){.ind-scroll-cue{bottom:16px!important;width:34px!important;height:44px!important;min-width:34px!important;min-height:44px!important}.ind-scroll-mouse{width:18px!important;height:30px!important;min-width:18px!important;min-height:30px!important;border-radius:10px!important}.ind-scroll-wheel{top:5px!important;width:5px!important;height:8px!important;min-width:5px!important;min-height:8px!important}.ind-scroll-top-wrap{min-height:64px!important;padding-bottom:24px!important}}@media(prefers-reduced-motion:reduce){.ind-scroll-wheel{animation:none!important}}';
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
      var contact = document.querySelector('[data-pp="contact-section"]');
      if (!contact) {
        var slot = document.querySelector('[data-pp="contact-slot"]');
        contact = slot && slot.querySelector('section');
      }
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
    button.innerHTML = '<span class="ind-scroll-mouse"><span class="ind-scroll-wheel"></span></span>';
    return button;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
