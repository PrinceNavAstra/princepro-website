/* Animated Industry page scroll cues. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var hero = document.querySelector('.ind-hero');
    if (!hero) return;

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

    var firstBody = document.querySelector('.ind-body');
    if (firstBody) hero.appendChild(cue('down', 'SCROLL TO EXPLORE', firstBody));

    var contactSlot = document.querySelector('[data-pp="contact-slot"]');
    if (contactSlot) {
      var topCue = cue('up', 'BACK TO TOP', function () { return document.documentElement; });
      var wrap = document.createElement('div');
      wrap.className = 'ind-scroll-top-wrap';
      wrap.appendChild(topCue);
      contactSlot.insertAdjacentElement('afterend', wrap);
    }

    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var down = hero.querySelector('.ind-scroll-cue--down');
      if (down) down.classList.toggle('is-scrolled', y > 90);
      lastY = y;
    }, { passive: true });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.ind-scroll-cue').forEach(function (el) { el.classList.add('reduced-motion'); });
    }
  });
})();
