/* Animated Industry page scroll cues. Self-contained so every industry page works without another CSS file. */
(function () {
  function addStyles() {
    if (document.getElementById('industry-scroll-cue-styles')) return;
    var style = document.createElement('style');
    style.id = 'industry-scroll-cue-styles';
    style.textContent = '\
.ind-scroll-cue{position:absolute;left:50%;bottom:24px;z-index:20;display:flex;flex-direction:column;align-items:center;gap:7px;min-width:112px;padding:10px 15px 11px;border:1px solid rgba(190,150,55,.48);border-radius:999px;background:rgba(255,255,255,.82);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:inherit;cursor:pointer;transform:translateX(-50%);box-shadow:0 10px 30px rgba(0,0,0,.10);transition:opacity .35s ease,transform .35s ease,box-shadow .3s ease,border-color .3s ease}.ind-scroll-cue:hover{transform:translateX(-50%) translateY(-4px);border-color:#b8943e;box-shadow:0 15px 38px rgba(0,0,0,.15)}.ind-scroll-cue.is-scrolled{opacity:0;pointer-events:none;transform:translateX(-50%) translateY(12px)}.ind-scroll-mouse{position:relative;width:23px;height:35px;border:1.7px solid #b8943e;border-radius:13px;display:block}.ind-scroll-wheel{position:absolute;left:50%;top:5px;width:3px;height:8px;border-radius:5px;background:#b8943e;transform:translateX(-50%);animation:indScrollWheel 1.45s ease-in-out infinite}.ind-scroll-arrow{height:13px;display:block;position:relative;width:14px}.ind-scroll-arrow i,.ind-scroll-arrow i:after{position:absolute;display:block;content:"";width:8px;height:8px;border-right:2px solid #b8943e;border-bottom:2px solid #b8943e}.ind-scroll-arrow i{left:2px;top:0;transform:rotate(45deg);animation:indScrollArrow 1.45s ease-in-out infinite}.ind-scroll-label{font:500 .56rem/1 'DM Mono',monospace;letter-spacing:.15em;color:#66706f;white-space:nowrap}.ind-scroll-cue--up{position:relative;left:auto;bottom:auto;transform:none!important;opacity:1!important;pointer-events:auto!important}.ind-scroll-cue--up .ind-scroll-wheel{animation-direction:reverse}.ind-scroll-cue--up .ind-scroll-arrow i{transform:rotate(225deg);top:5px}.ind-scroll-top-wrap{display:flex;justify-content:center;padding:30px 20px 44px;background:var(--bg,#fff);position:relative;z-index:10}.ind-scroll-cue--up:hover{transform:translateY(-4px)!important}.ind-scroll-top-wrap .ind-scroll-cue{box-shadow:0 10px 30px rgba(0,0,0,.08)}@keyframes indScrollWheel{0%{opacity:.25;transform:translate(-50%,0)}45%{opacity:1;transform:translate(-50%,9px)}80%,100%{opacity:.15;transform:translate(-50%,13px)}}@keyframes indScrollArrow{0%,100%{opacity:.45;transform:translateY(0) rotate(45deg)}50%{opacity:1;transform:translateY(5px) rotate(45deg)}}@media(max-width:720px){.ind-scroll-cue{bottom:18px;min-width:96px;padding:8px 12px 10px}.ind-scroll-label{font-size:.5rem}.ind-scroll-top-wrap{padding:25px 16px 34px}}@media(prefers-reduced-motion:reduce){.ind-scroll-cue,.ind-scroll-wheel,.ind-scroll-arrow i{animation:none!important}.ind-scroll-cue:hover,.ind-scroll-cue--up:hover{transform:translateX(-50%)!important}.ind-scroll-cue--up:hover{transform:none!important}}';
    document.head.appendChild(style);
  }

  function cue(direction, label, target) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'ind-scroll-cue ind-scroll-cue--' + direction;
    button.setAttribute('aria-label', label);
    button.innerHTML = '<span class="ind-scroll-mouse" aria-hidden="true"><span class="ind-scroll-wheel"></span></span>' +
      '<span class="ind-scroll-arrow" aria-hidden="true"><i></i></span>' +
      '<span class="ind-scroll-label">' + label + '</span>';
    button.addEventListener('click', function () {
      var el = typeof target === 'function' ? target() : target;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return button;
  }

  function init() {
    addStyles();
    var hero = document.querySelector('.ind-hero');
    if (!hero) return;
    var firstBody = document.querySelector('.ind-body');
    if (firstBody && !hero.querySelector('.ind-scroll-cue--down')) {
      hero.appendChild(cue('down', 'SCROLL TO EXPLORE', firstBody));
    }
    function addTopCue() {
      var contact = document.querySelector('[data-pp="contact-section"], [data-pp="contact-slot"]');
      if (!contact || document.querySelector('.ind-scroll-top-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'ind-scroll-top-wrap';
      wrap.appendChild(cue('up', 'BACK TO TOP', function () { return document.documentElement; }));
      contact.insertAdjacentElement('afterend', wrap);
    }
    addTopCue();
    var observer = new MutationObserver(addTopCue);
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(function () { addTopCue(); observer.disconnect(); }, 2500);
    window.addEventListener('scroll', function () {
      var down = hero.querySelector('.ind-scroll-cue--down');
      if (down) down.classList.toggle('is-scrolled', window.scrollY > 90);
    }, { passive: true });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.ind-scroll-cue').forEach(function (el) { el.classList.add('reduced-motion'); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
