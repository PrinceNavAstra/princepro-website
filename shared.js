// shared.js — theme toggle + site nav inject + reveal + custom cursor
(function () {
  var html = document.documentElement;
  var saved = localStorage.getItem('pp-theme');
  if (saved) html.setAttribute('data-theme', saved);
  else html.setAttribute('data-theme', 'light');

  function pageLink(hash) {
    var path = location.pathname.split('/').pop() || 'index.html';
    var isHome = path === '' || path === 'index.html';
    if (!hash) return isHome ? 'index.html' : 'index.html';
    return isHome ? '#' + hash : 'index.html#' + hash;
  }

  document.addEventListener('DOMContentLoaded', function () {
    // ── Inject full-width site navbar ─────────────────────────────────
    (function ensureNav() {
      if (document.querySelector('[data-pp="site-nav"]')) return;

      var nav = document.createElement('nav');
      nav.setAttribute('data-pp', 'site-nav');
      nav.id = 'nav';

      nav.innerHTML =
        '<div class="nav-inner">' +
        '  <a href="index.html" class="nav-logo">Prince <em>Prajapati</em></a>' +
        '  <div class="nav-links">' +
        '    <a href="' + pageLink('about') + '">About</a>' +
        '    <a href="' + pageLink('services') + '">Services</a>' +
        '    <div class="nav-dropdown">' +
        '      <a href="' + pageLink('industries') + '" class="nav-dropbtn" data-nav="industries">Industries We Serve <span class="nav-caret">▼</span></a>' +
        '      <div class="nav-dropdown-content">' +
        '        <a href="manufacturing.html">Manufacturing</a>' +
        '        <a href="logistics.html">Logistics</a>' +
        '        <a href="construction.html">Construction</a>' +
        '        <a href="marketing.html">Marketing</a>' +
        '        <a href="textile.html">Textile</a>' +
        '      </div>' +
        '    </div>' +
        '    <div class="nav-dropdown">' +
        '      <a href="sip-calculator.html" class="nav-dropbtn" data-nav="financial-tools">Financial Tools <span class="nav-caret">▼</span></a>' +
        '      <div class="nav-dropdown-content">' +
        '        <a href="sip-calculator.html">SIP Calculator</a>' +
        '        <a href="loan-calculator.html">Loan Calculator</a>' +
        '        <a href="ratios.html">Financial Ratio Analysis</a>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '  <div class="nav-right">' +
        '    <button class="tog" id="themeToggle" type="button" aria-label="Toggle light/dark mode">' +
        '      <span class="tog-i m">🌙</span>' +
        '      <span class="tog-i s">☀️</span>' +
        '    </button>' +
        '    <a href="' + pageLink('contact') + '" class="nav-cta">Book a Call</a>' +
        '    <button class="hamburger" id="hamburger" type="button" aria-label="Toggle menu">' +
        '      <span></span><span></span><span></span>' +
        '    </button>' +
        '  </div>' +
        '</div>';

      var sidebar = document.createElement('div');
      sidebar.className = 'sidebar';
      sidebar.id = 'sidebar';
      sidebar.innerHTML =
        '<div class="sidebar-content">' +
        '  <div class="sidebar-header">' +
        '    <button class="sidebar-close" id="sidebarClose" type="button" aria-label="Close menu"></button>' +
        '  </div>' +
        '  <div class="sidebar-links">' +
        '    <a href="' + pageLink('about') + '" class="sidebar-link">About</a>' +
        '    <a href="' + pageLink('services') + '" class="sidebar-link">Services</a>' +
        '    <div class="sidebar-dropdown">' +
        '      <button class="sidebar-link sidebar-dropdown-btn" type="button">Industries We Serve</button>' +
        '      <div class="sidebar-dropdown-content">' +
        '        <a href="manufacturing.html">Manufacturing</a>' +
        '        <a href="logistics.html">Logistics</a>' +
        '        <a href="construction.html">Construction</a>' +
        '        <a href="marketing.html">Marketing</a>' +
        '        <a href="textile.html">Textile</a>' +
        '      </div>' +
        '    </div>' +
        '    <div class="sidebar-dropdown">' +
        '      <button class="sidebar-link sidebar-dropdown-btn" type="button">Financial Tools</button>' +
        '      <div class="sidebar-dropdown-content">' +
        '        <a href="sip-calculator.html">SIP Calculator</a>' +
        '        <a href="loan-calculator.html">Loan Calculator</a>' +
        '        <a href="ratios.html">Financial Ratio Analysis</a>' +
        '      </div>' +
        '    </div>' +
        '    <a href="' + pageLink('contact') + '" class="sidebar-link sidebar-cta">Book a Free Consultation</a>' +
        '  </div>' +
        '</div>';

      document.body.prepend(sidebar);
      document.body.prepend(nav);
      document.body.classList.add('has-site-nav');
      if (document.getElementById('hero')) {
        document.body.classList.add('has-hero');
      }

      // Theme toggle
      var themeBtn = document.getElementById('themeToggle');
      if (themeBtn) {
        themeBtn.addEventListener('click', function (e) {
          e.preventDefault();
          var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          html.setAttribute('data-theme', next);
          localStorage.setItem('pp-theme', next);
        });
      }

      // Nav scroll state
      window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 50);
      }, { passive: true });

      // Prevent financial-tools parent link from navigating (dropdown only)
      nav.querySelectorAll('[data-nav="financial-tools"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
        });
      });

      // Mobile sidebar
      var hamburger = document.getElementById('hamburger');
      var sidebarClose = document.getElementById('sidebarClose');

      if (hamburger && sidebar && sidebarClose) {
        function openSidebar() {
          hamburger.classList.add('active');
          sidebar.classList.add('active');
          document.body.classList.add('sidebar-open');
        }

        function closeSidebar() {
          hamburger.classList.remove('active');
          sidebar.classList.remove('active');
          document.body.classList.remove('sidebar-open');
        }

        hamburger.addEventListener('click', function () {
          if (sidebar.classList.contains('active')) closeSidebar();
          else openSidebar();
        });

        sidebarClose.addEventListener('click', closeSidebar);

        sidebar.querySelectorAll('.sidebar-link:not(.sidebar-dropdown-btn)').forEach(function (link) {
          link.addEventListener('click', function () { closeSidebar(); });
        });

        sidebar.querySelectorAll('.sidebar-dropdown-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var content = btn.nextElementSibling;
            if (content && content.classList.contains('sidebar-dropdown-content')) {
              btn.classList.toggle('active');
              content.classList.toggle('active');
            }
          });
        });

        document.addEventListener('click', function (e) {
          if (sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !hamburger.contains(e.target)) {
            closeSidebar();
          }
        });
      }
    })();

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

    var hoverEls = 'a, button, .calc-btn, .prod-tab, .ratio-input-method, .svc, .ind-card, .ccard, .btn-gold, .trust-chip, .flow-step, .nav-cta, .tog, .hamburger, .nav-links a';
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
