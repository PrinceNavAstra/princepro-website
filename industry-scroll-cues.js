/* Industry scroll cues — deliberately self-contained and fixed to viewport so they cannot be clipped by hero layout. */
(function () {
  function init() {
    if (document.getElementById('pp-industry-scroll-style')) return;
    var style = document.createElement('style');
    style.id = 'pp-industry-scroll-style';
    style.textContent = '\
.ind-scroll-cue{position:fixed!important;left:50%!important;bottom:22px!important;z-index:2147483000!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:5px!important;width:auto!important;min-width:150px!important;padding:10px 16px 11px!important;margin:0!important;border:1px solid #c49a42!important;border-radius:999px!important;background:#fff!important;color:#33403f!important;box-shadow:0 10px 30px rgba(0,0,0,.18)!important;cursor:pointer!important;opacity:1!important;visibility:visible!important;transform:translateX(-50%)!important;transition:opacity .3s ease,transform .3s ease!important}.ind-scroll-cue:hover{transform:translateX(-50%) translateY(-4px)!important}.ind-scroll-cue.is-scrolled{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateX(-50%) translateY(14px)!important}.ind-scroll-mouse{position:relative!important;display:block!important;width:24px!important;height:37px!important;border:2px solid #c49a42!important;border-radius:14px!important;box-sizing:border-box!important}.ind-scroll-wheel{position:absolute!important;left:50%!important;top:5px!important;width:4px!important;height:8px!important;border-radius:5px!important;background:#c49a42!important;transform:translateX(-50%)!important;animation:ppScrollWheel 1.35s ease-in-out infinite!important}.ind-scroll-arrow{display:block!important;width:16px!important;height:17px!important;position:relative!important}.ind-scroll-arrow i{position:absolute!important;left:3px!important;top:0!important;width:9px!important;height:9px!important;border-right:2px solid #c49a42!important;border-bottom:2px solid #c49a42!important;transform:rotate(45deg)!important;animation:ppScrollArrow 1.35s ease-in-out infinite!important}.ind-scroll-label{display:block!important;font-family:'DM Mono',monospace!important;font-size:9px!important;line-height:1!important;font-weight:500!important;letter-spacing:.15em!important;color:#4f5b59!important;white-space:nowrap!important}.ind-scroll-top-wrap{position:relative!important;display:flex!important;justify-content:center!important;padding:25px 20px 100px!important;background:var(--bg,#fff)!important}.ind-scroll-top-wrap .ind-scroll-cue{position:relative!important;left:auto!important;bottom:auto!important;transform:none!important;z-index:10!important}.ind-scroll-top-wrap .ind-scroll-cue:hover{transform:translateY(-4px)!important}.ind-scroll-cue--up .ind-scroll-wheel{animation-direction:reverse!important}.ind-scroll-cue--up .ind-scroll-arrow i{transform:rotate(225deg)!important;animation-name:ppScrollArrowUp!important}@keyframes ppScrollWheel{0%,100%{opacity:.25;transform:translate(-50%,0)}45%{opacity:1;transform:translate(-50%,9px)}80%{opacity:.15;transform:translate(-50%,13px)}}@keyframes ppScrollArrow{0%,100%{opacity:.45;transform:rotate(45deg) translateY(0)}50%{opacity:1;transform:rotate(45deg) translateY(5px)}}@keyframes ppScrollArrowUp{0%,100%{opacity:.45;transform:rotate(225deg) translateY(0)}50%{opacity:1;transform:rotate(225deg) translateY(5px)}}@media(max-width:720px){.ind-scroll-cue{bottom:16px!important;min-width:138px!important;padding:9px 13px 10px!important}.ind-scroll-label{font-size:8px!important}}@media(prefers-reduced-motion:reduce){.ind-scroll-wheel,.ind-scroll-arrow i{animation:none!important}}';
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
    button.innerHTML = '<span class="ind-scroll-mouse"><span class="ind-scroll-wheel"></span></span><span class="ind-scroll-arrow"><i></i></span><span class="ind-scroll-label">' + label + '</span>';
    return button;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
