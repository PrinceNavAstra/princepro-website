/* Universal scroll cues — shared light-gold mouse indicator, shown on every
   page that loads shared.js. "Down" appears near a scrollable top section;
   "Up / back to top" is anchored directly to the site footer, so it always
   appears wherever the footer does. Guarded against double-inclusion since
   shared.js auto-loads this file on any page that doesn't already have it. */
(function () {
  if (window.__ppScrollCuesLoaded) return;
  window.__ppScrollCuesLoaded = true;

  function init() {
    if (document.getElementById('pp-industry-scroll-style')) return;

    var style = document.createElement('style');
    style.id = 'pp-industry-scroll-style';
    style.textContent = '\
.ind-scroll-cue{position:fixed!important;left:50%!important;bottom:22px!important;z-index:9999!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;opacity:.96!important;visibility:visible!important;transform:translateX(-50%)!important;transition:opacity .3s ease,transform .3s ease!important;background:transparent!important;border:0!important;outline:0!important;padding:0!important;margin:0!important;width:34px!important;height:42px!important;min-width:34px!important;min-height:42px!important;box-sizing:border-box!important;pointer-events:auto!important;appearance:none!important;-webkit-appearance:none!important}.ind-scroll-cue:hover{opacity:1!important}.ind-scroll-cue.is-scrolled{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateX(-50%) translateY(6px)!important}.ind-scroll-cue:before{content:""!important;position:absolute!important;left:50%!important;top:50%!important;width:18px!important;height:30px!important;transform:translate(-50%,-50%)!important;box-sizing:border-box!important;border:2px solid #d4a853!important;border-radius:10px!important;background:rgba(212,168,83,.04)!important;box-shadow:0 0 12px rgba(212,168,83,.35),inset 0 0 8px rgba(212,168,83,.08)!important;pointer-events:none!important}.ind-scroll-wheel{position:absolute!important;left:50%!important;top:7px!important;z-index:2!important;width:5px!important;height:9px!important;transform:translateX(-50%)!important;border-radius:5px!important;background:#d4a853!important;box-shadow:0 0 8px rgba(212,168,83,.9)!important;animation:ppScrollWheel 1.7s ease-in-out infinite!important;pointer-events:none!important}.ind-scroll-arrow,.ind-scroll-label,.ind-scroll-cue svg{display:none!important}.ind-scroll-top-wrap{position:relative!important;display:flex!important;justify-content:center!important;align-items:center!important;min-height:64px!important;padding:14px 20px 30px!important;background:var(--bg,#fff)!important}.ind-scroll-top-wrap .ind-scroll-cue{position:relative!important;left:auto!important;bottom:auto!important;transform:none!important;z-index:10!important}.ind-scroll-top-wrap .ind-scroll-cue.is-scrolled{transform:translateY(6px)!important}@keyframes ppScrollWheel{0%{transform:translate(-50%,0);opacity:1}70%{transform:translate(-50%,10px);opacity:0}100%{transform:translate(-50%,10px);opacity:0}}@media(max-width:560px){.ind-scroll-cue{bottom:16px!important;width:32px!important;height:38px!important;min-width:32px!important;min-height:38px!important}.ind-scroll-cue:before{width:16px!important;height:28px!important;border-radius:9px!important}.ind-scroll-wheel{top:6px!important;width:5px!important;height:8px!important}.ind-scroll-top-wrap{min-height:58px!important;padding-bottom:26px!important}}@media(prefers-reduced-motion:reduce){.ind-scroll-wheel{animation:none!important}}';
    document.head.appendChild(style);

    // "Down" cue — shown on any page tall enough to scroll. Scrolls past a
    // known hero-like block when one exists, otherwise just scrolls one
    // screen down, so it works even on page types this script doesn't know
    // about by name.
    var down = document.querySelector('.ind-scroll-cue--down');
    if (!down) {
      down = makeCue('down', 'SCROLL TO EXPLORE');
      document.body.appendChild(down);
    }
    down.addEventListener('click', function () {
      var hero = document.querySelector('.ind-hero, #hero, .tool-hero, .games-hero, .game-play-wrap');
      var target = hero && hero.nextElementSibling;
      while (target && (target.tagName === 'SCRIPT' || target.tagName === 'STYLE')) target = target.nextElementSibling;
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    });

    // "Up / back to top" cue — anchored directly to the site footer, so it
    // appears on every page the footer appears on, with no per-page wiring.
    function addTop() {
      if (document.querySelector('.ind-scroll-top-wrap')) return;
      var footer = document.querySelector('footer[data-pp="site-footer"]');
      if (!footer) return;
      var wrap = document.createElement('div');
      wrap.className = 'ind-scroll-top-wrap';
      var up = makeCue('up', 'BACK TO TOP');
      wrap.appendChild(up);
      footer.insertAdjacentElement('beforebegin', wrap);
      up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }
    addTop();
    new MutationObserver(addTop).observe(document.body, { childList: true, subtree: true });

    function updateDown() {
      var scrollable = document.body.scrollHeight > window.innerHeight * 1.15;
      down.classList.toggle('is-scrolled', !scrollable || window.scrollY > 90);
    }
    window.addEventListener('scroll', updateDown, { passive: true });
    window.addEventListener('resize', updateDown);
    updateDown();
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
