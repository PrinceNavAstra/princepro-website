// shared.js — theme toggle + nav scroll + reveal + custom cursor
(function () {
  var html = document.documentElement;
  var saved = localStorage.getItem('pp-theme');
  if (saved) html.setAttribute('data-theme', saved);
  else html.setAttribute('data-theme', 'light');

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('pp-theme', next);
      });
    }

    var nav = document.getElementById('nav');
    if (nav) {
      window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 50);
      }, { passive: true });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    /* ── Custom Cursor ─────────────────────────────────── */
    var isTouchDevice = window.matchMedia('(pointer:coarse)').matches;
    if (isTouchDevice) {
      document.body.classList.add('touch-device');
    } else {
      var dot = document.getElementById('cursor-dot');
      var ring = document.getElementById('cursor-ring');
      if (dot && ring) {
        var mx = -100, my = -100;
        var rx = -100, ry = -100;
        var raf;

        document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
        document.addEventListener('mousedown', function () { ring.classList.add('clicking'); });
        document.addEventListener('mouseup', function () { ring.classList.remove('clicking'); });

        // Hover detection — expand ring on interactive elements
        var hoverEls = 'a, button, .calc-btn, .prod-tab, .ratio-input-method, .svc, .ind-card, .ccard, .btn-gold, .trust-chip';
        document.querySelectorAll(hoverEls).forEach(function (el) {
          el.addEventListener('mouseenter', function () { ring.classList.add('hovering'); });
          el.addEventListener('mouseleave', function () { ring.classList.remove('hovering'); });
        });

        // Dot follows cursor instantly; ring uses lerp for smooth lag
        function lerp(a, b, t) { return a + (b - a) * t; }
        function loop() {
          dot.style.left = mx + 'px';
          dot.style.top = my + 'px';
          rx = lerp(rx, mx, 0.12);
          ry = lerp(ry, my, 0.12);
          ring.style.left = rx + 'px';
          ring.style.top = ry + 'px';
          raf = requestAnimationFrame(loop);
        }
        loop();

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', function () {
          dot.style.opacity = 0;
          ring.style.opacity = 0;
        });
        document.addEventListener('mouseenter', function () {
          dot.style.opacity = 1;
          ring.style.opacity = '';
        });
      }
    }

    /* ── Mobile Sidebar ─────────────────────────────────── */
    var hamburger = document.getElementById('hamburger');
    var sidebar = document.getElementById('sidebar');
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
        if (sidebar.classList.contains('active')) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });

      sidebarClose.addEventListener('click', function () {
        closeSidebar();
      });

      // Close sidebar when clicking on links
      var sidebarLinks = sidebar.querySelectorAll('.sidebar-link:not(.sidebar-dropdown-btn)');
      sidebarLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          closeSidebar();
        });
      });

      // Handle dropdown toggles in sidebar
      var dropdownBtns = sidebar.querySelectorAll('.sidebar-dropdown-btn');
      dropdownBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var content = this.nextElementSibling;
          if (content && content.classList.contains('sidebar-dropdown-content')) {
            this.classList.toggle('active');
            content.classList.toggle('active');
          }
        });
      });

      // Close sidebar when clicking outside
      document.addEventListener('click', function (e) {
        if (sidebar.classList.contains('active') &&
          !sidebar.contains(e.target) &&
          !hamburger.contains(e.target)) {
          closeSidebar();
        }
      });
    }
  });
})();

