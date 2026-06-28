// shared.js — theme toggle + nav inject + reveal + custom cursor
(function () {
  var html = document.documentElement;
  var saved = localStorage.getItem('pp-theme');
  if (saved) html.setAttribute('data-theme', saved);
  else html.setAttribute('data-theme', 'light');

  document.addEventListener('DOMContentLoaded', function () {
    // ── Inject Floating glass navbar (only if missing) ───────────────
    (function ensureNav() {
      var existing = document.querySelector('[data-pp="floating-theme-nav"]');
      if (existing) return;

      var nav = document.createElement('div');
      nav.setAttribute('data-pp', 'floating-theme-nav');
      nav.setAttribute('class', 'floating-nav');
      nav.setAttribute('role', 'navigation');

      nav.innerHTML =
        '  <div class="floating-nav__brand">' +
        '    <div class="floating-nav__brand-text">Prince <em>Prajapati</em></div>' +
        '  </div>' +
        '  <button type="button" class="floating-nav__toggle" id="themeToggle" aria-label="Toggle theme">' +
        '    ☼' +
        '  </button>' +
        '  <button type="button" class="floating-nav__toggle floating-nav__menu" id="menuToggle" aria-label="Open calculators menu" aria-haspopup="dialog" aria-expanded="false" aria-controls="calcDropdown">' +
        '    ⊞' +
        '  </button>' +
        '  <div class="floating-nav__dropdown hidden" id="calcDropdown" role="dialog" aria-label="Calculators dropdown">' +
        '    <div class="floating-nav__grid">' +
        '      <a class="floating-nav__item" href="sip-calculator.html">' +
        '        <div class="floating-nav__item-title">SIP Calculator</div>' +
        '        <div class="floating-nav__item-desc">Step-up SIP returns & yearly progression</div>' +
        '      </a>' +
        '      <a class="floating-nav__item" href="loan-calculator.html">' +
        '        <div class="floating-nav__item-title">Loan Calculator</div>' +
        '        <div class="floating-nav__item-desc">EMI, tenure & amortization preview</div>' +
        '      </a>' +
        '      <a class="floating-nav__item" href="ratios.html">' +
        '        <div class="floating-nav__item-title">Financial Ratios</div>' +
        '        <div class="floating-nav__item-desc">Quick valuation & ratio estimates</div>' +
        '      </a>' +
        '      <a class="floating-nav__item" href="screener.html">' +
        '        <div class="floating-nav__item-title">Stock Screener</div>' +
        '        <div class="floating-nav__item-desc">Trend + levels + rules-based news impact</div>' +
        '      </a>' +
        '    </div>' +
        '  </div>';

      document.body.prepend(nav);

      var themeBtn = nav.querySelector('#themeToggle');
      var menuBtn = nav.querySelector('#menuToggle');
      var dd = nav.querySelector('#calcDropdown');

      function toggleTheme() {
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('pp-theme', next);
      }

      function setMenuOpen(isOpen) {
        if (!dd || !menuBtn) return;
        dd.classList.toggle('hidden', !isOpen);
        menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }

      function toggleMenu() {
        var isOpen = dd && !dd.classList.contains('hidden');
        setMenuOpen(!isOpen);
      }

      if (themeBtn) {
        themeBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleTheme();
          // keep menu state unchanged
        });
      }

      if (menuBtn && dd) {
        menuBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleMenu();
        });

        // Close dropdown on outside click / escape
        document.addEventListener('click', function (ev) {
          if (!dd) return;
          if (dd.classList.contains('hidden')) return;
          var t = ev.target;
          if (!nav.contains(t)) setMenuOpen(false);
        });

        document.addEventListener('keydown', function (ev) {
          if (ev.key === 'Escape') setMenuOpen(false);
        });

        // Close on link click
        nav.querySelectorAll('a[href]').forEach(function (a) {
          a.addEventListener('click', function () {
            setMenuOpen(false);
          });
        });
      }
    })();

    // ── Theme toggle (fallback) ───────────────────────────────────────
    // Floating nav handler is attached inside ensureNav().
    // This block is for any other page that might already render #themeToggle.
    var toggle = document.getElementById('themeToggle');
    if (toggle && !document.body.querySelector('[data-pp="floating-theme-nav"]')) {
      toggle.addEventListener('click', function () {
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('pp-theme', next);
      });
    }


    // ── Reveal (IntersectionObserver) ───────────────────────────────────
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    // ── Custom Cursor ──────────────────────────────────────────────────
    var isTouchDevice = window.matchMedia('(pointer:coarse)').matches;
    if (isTouchDevice) {
      document.body.classList.add('touch-device');
      return;
    }

    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    var mx = -100, my = -100;
    var rx = -100, ry = -100;

    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mousedown', function () { ring.classList.add('clicking'); });
    document.addEventListener('mouseup', function () { ring.classList.remove('clicking'); });

    // Hover detection — expand ring on interactive elements
    var hoverEls = 'a, button, .calc-btn, .prod-tab, .ratio-input-method, .svc, .ind-card, .ccard, .btn-gold, .trust-chip, .flow-step';
    document.querySelectorAll(hoverEls).forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hovering'); });
    });

    function lerp(a, b, t) { return a + (b - a) * t; }
    function loop() {
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
      rx = lerp(rx, mx, 0.12);
      ry = lerp(ry, my, 0.12);
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    }
    loop();

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = 0;
      ring.style.opacity = 0;
    });
    document.addEventListener('mouseenter', function () {
      dot.style.opacity = 1;
      ring.style.opacity = '';
    });
  });
})();


