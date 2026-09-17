// shared.js — theme toggle + site nav inject + reveal + custom cursor
(function () {
  var html = document.documentElement;
  var saved = localStorage.getItem('pp-theme');
  if (saved) html.setAttribute('data-theme', saved);
  else html.setAttribute('data-theme', 'light');

  function pageLink(hash) {
    // Clean-URL aware: works whether the current URL still has .html
    // (local file preview) or not (Vercel's cleanUrls in production).
    var path = location.pathname.replace(/\/$/, '').split('/').pop() || '';
    var isHome = path === '' || path === 'index' || path === 'index.html';
    if (!hash) return '/';
    return isHome ? '#' + hash : '/#' + hash;
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
        '  <a href="/" class="nav-logo">Prince <em>Prajapati</em></a>' +
        '  <div class="nav-links">' +
        '    <a href="' + pageLink('about') + '">About</a>' +
        '    <a href="' + pageLink('services') + '">Services</a>' +
        '    <div class="nav-dropdown">' +
        '      <a href="' + pageLink('industries') + '" class="nav-dropbtn" data-nav="industries">Industries We Serve <span class="nav-caret">▼</span></a>' +
        '      <div class="nav-dropdown-content">' +
        '        <a href="manufacturing">Manufacturing</a>' +
        '        <a href="logistics">Logistics</a>' +
        '        <a href="construction">Construction</a>' +
        '        <a href="marketing">Marketing</a>' +
        '        <a href="textile">Textile</a>' +
        '      </div>' +
        '    </div>' +
        '    <div class="nav-dropdown">' +
        '      <a href="sip-calculator" class="nav-dropbtn" data-nav="financial-tools">Financial Tools <span class="nav-caret">▼</span></a>' +
        '      <div class="nav-dropdown-content">' +
        '        <a href="sip-calculator">SIP Calculator</a>' +
        '        <a href="loan-calculator">Loan Calculator</a>' +
        '        <a href="ratios">Financial Ratio Analysis</a>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '  <div class="nav-right">' +
        '    <button class="tog" id="themeToggle" type="button" aria-label="Toggle light/dark mode">' +
        '      <span class="tog-i m">🌙</span>' +
        '      <span class="tog-i s">☀️</span>' +
        '    </button>' +
        '    <a href="' + '#contact' + '" class="nav-cta">Book a Call</a>' +
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
        '        <a href="manufacturing">Manufacturing</a>' +
        '        <a href="logistics">Logistics</a>' +
        '        <a href="construction">Construction</a>' +
        '        <a href="marketing">Marketing</a>' +
        '        <a href="textile">Textile</a>' +
        '      </div>' +
        '    </div>' +
        '    <div class="sidebar-dropdown">' +
        '      <button class="sidebar-link sidebar-dropdown-btn" type="button">Financial Tools</button>' +
        '      <div class="sidebar-dropdown-content">' +
        '        <a href="sip-calculator">SIP Calculator</a>' +
        '        <a href="loan-calculator">Loan Calculator</a>' +
        '        <a href="ratios">Financial Ratio Analysis</a>' +
        '      </div>' +
        '    </div>' +
        '    <a href="' + '#contact' + '" class="sidebar-link sidebar-cta">Book a Free Consultation</a>' +
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
          updateFavicon(next);
        });
      }

      // Function to update favicon based on theme
      function updateFavicon(theme) {
        var prefix = theme === 'dark' ? 'favicon-dark' : 'favicon-light';
        document.getElementById('favicon-main').href = prefix + '-64.png';
        document.getElementById('favicon-32').href = prefix + '-32.png';
        document.getElementById('favicon-16').href = prefix + '-16.png';
        document.getElementById('favicon-apple').href = prefix + '-128.png';
      }

      // Set initial favicon based on saved theme
      var initialTheme = localStorage.getItem('pp-theme') || 'light';
      updateFavicon(initialTheme);

      // Nav scroll state
      window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 50);
      }, { passive: true });

      // Single code path for opening/closing dropdowns — used by both click
      // and hover-intent, so the background-blur is ALWAYS applied together
      // with the dropdown, on any input method (this is what fixes the
      // "hover shows the menu but background stays crisp" bug).
      var isCoarsePointer = window.matchMedia('(pointer:coarse)').matches;
      var hoverCloseTimer = null;

      function closeDropdowns() {
        nav.querySelectorAll('.nav-dropdown.open').forEach(function (dropdown) {
          dropdown.classList.remove('open');
        });
        document.body.classList.remove('nav-dropdown-open');
      }

      function openDropdown(dropdown) {
        if (dropdown.classList.contains('open')) return;
        closeDropdowns();
        dropdown.classList.add('open');
        document.body.classList.add('nav-dropdown-open');
      }

      nav.querySelectorAll('.nav-dropdown').forEach(function (dropdown) {
        var btn = dropdown.querySelector('.nav-dropbtn');
        var content = dropdown.querySelector('.nav-dropdown-content');

        if (!btn || !content) return;

        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (dropdown.classList.contains('open')) closeDropdowns();
          else openDropdown(dropdown);
        });

        if (!isCoarsePointer) {
          // Hover-intent: open on enter, close shortly after leaving both
          // the button and the panel (so travelling between them is safe).
          dropdown.addEventListener('mouseenter', function () {
            clearTimeout(hoverCloseTimer);
            openDropdown(dropdown);
          });
          dropdown.addEventListener('mouseleave', function () {
            clearTimeout(hoverCloseTimer);
            hoverCloseTimer = setTimeout(closeDropdowns, 180);
          });
        }

        content.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function () {
            closeDropdowns();
          });
        });
      });

      document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-dropdown')) {
          closeDropdowns();
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDropdowns();
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

    // ── Inject shared CONTACT section (identical on every page) ────────
    (function ensureContact() {
      var slot = document.querySelector('[data-pp="contact-slot"]');
      if (!slot || document.querySelector('[data-pp="contact-section"]')) return;

      var titleTpl = slot.querySelector('[data-cta-title]');
      var subTpl = slot.querySelector('[data-cta-sub]');

      var titleHTML = titleTpl ? titleTpl.innerHTML.trim()
        : 'Ready to <mark>transform your business?</mark><br>Let\'s talk.';
      var subHTML = subTpl ? subTpl.innerHTML.trim()
        : 'Whether you\'re embarking on your <strong>first ERP implementation</strong>, migrating from a legacy system, or ready to unlock <strong>AI-driven automation</strong> — we\'re here to help. No pressure, no jargon — just an <mark>honest conversation</mark> about your business.';

      var section = document.createElement('section');
      section.id = 'contact';
      section.setAttribute('data-pp', 'contact-section');
      section.innerHTML =
        '<div class="wrap">' +
        '  <div class="contact-inner">' +
        '    <div class="eyebrow reveal" style="justify-content:center">Get In Touch</div>' +
        '    <h2 class="contact-h2 serif reveal" style="transition-delay:.06s">' + titleHTML + '</h2>' +
        '    <p class="sub contact-sub reveal" style="transition-delay:.12s">' + subHTML + '</p>' +
        '    <div class="qr-cards reveal" style="transition-delay:.14s; margin-top:8px">' +
        '      <div class="qr-card qr-card--call">' +
        '        <div class="qr-card__top">' +
        '          <div class="qr-card__brand"><div class="qr-card__mark">PP</div><div class="qr-card__name">Prince Prajapati</div></div>' +
        '          <div class="qr-card__meta"><span>ERP &amp; AI Consultant</span><span>Ahmedabad, IN</span></div>' +
        '          <div class="qr-card__fields"><div><label>Response</label><div>Within 24h</div></div><div><label>Availability</label><div>Mon – Sat</div></div></div>' +
        '        </div>' +
        '        <div class="qr-perf"></div>' +
        '        <div class="qr-card__bottom">' +
        '          <div class="qr-route"><div><div class="qr-route__code">CALL</div><div class="qr-route__sub">+91 70431 76485</div></div><div class="qr-route__icon">📞</div></div>' +
        '          <div class="qr-block"><div class="qr-wrap" id="qr-call"></div><div class="qr-copy"><strong>Scan to dial</strong>Opens your phone\'s dialer, ready to call.</div></div>' +
        '          <div class="qr-card__actions"><button class="qr-help" type="button" onclick="savePrinceContact()" title="Save contact">＋</button><a class="qr-wallet" href="tel:+917043176485">Call now</a></div>' +
        '        </div>' +
        '      </div>' +
        '      <div class="qr-card qr-card--mail">' +
        '        <div class="qr-card__top">' +
        '          <div class="qr-card__brand"><div class="qr-card__mark">PP</div><div class="qr-card__name">Prince Prajapati</div></div>' +
        '          <div class="qr-card__meta"><span>ERP &amp; AI Consultant</span><span>Ahmedabad, IN</span></div>' +
        '          <div class="qr-card__fields"><div><label>Response</label><div>Within 24h</div></div><div><label>Best For</label><div>Project briefs</div></div></div>' +
        '        </div>' +
        '        <div class="qr-perf"></div>' +
        '        <div class="qr-card__bottom">' +
        '          <div class="qr-route"><div><div class="qr-route__code">MAIL</div><div class="qr-route__sub">prince679.pro@gmail.com</div></div><div class="qr-route__icon">✉️</div></div>' +
        '          <div class="qr-block"><div class="qr-wrap" id="qr-mail"></div><div class="qr-copy"><strong>Scan to email</strong>Opens a message pre-addressed to Prince.</div></div>' +
        '          <div class="qr-card__actions"><button class="qr-help" type="button" onclick="savePrinceContact()" title="Save contact">＋</button><a class="qr-wallet" href="mailto:prince679.pro@gmail.com">Email now</a></div>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>';

      slot.replaceWith(section);
      // Note: the reveal IntersectionObserver is wired up right after this
      // IIFE runs (same DOMContentLoaded handler), and it selects '.reveal'
      // fresh from the DOM — so elements injected here are picked up
      // automatically without needing to observe them manually here.

      // Save-to-contacts (vCard) — global, used by the qr-help "+" buttons.
      window.savePrinceContact = window.savePrinceContact || function () {
        var vcard = ['BEGIN:VCARD', 'VERSION:3.0', 'N:Prajapati;Prince;;;', 'FN:Prince Prajapati',
          'ORG:ERP Consulting & AI Workflow Design', 'TITLE:ERP & AI Consultant',
          'TEL;TYPE=CELL:+917043176485', 'EMAIL:prince679.pro@gmail.com', 'END:VCARD'].join('\n');
        var blob = new Blob([vcard], { type: 'text/vcard' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = 'prince-prajapati.vcf';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      function renderQRCodes() {
        if (typeof QRCode === 'undefined') return;
        var callEl = document.getElementById('qr-call');
        var mailEl = document.getElementById('qr-mail');
        if (callEl && !callEl.hasChildNodes()) {
          new QRCode(callEl, { text: 'tel:+917043176485', width: 54, height: 54, colorDark: '#111118', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
        }
        if (mailEl && !mailEl.hasChildNodes()) {
          new QRCode(mailEl, { text: 'mailto:prince679.pro@gmail.com', width: 54, height: 54, colorDark: '#111118', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
        }
      }

      renderQRCodes();
      }
    })();

    // ── Inject shared FOOTER (identical on every page) ──────────────────
    (function ensureFooter() {
      if (document.querySelector('footer[data-pp="site-footer"]')) return;
      var year = new Date().getFullYear();
      var foot = document.createElement('footer');
      foot.setAttribute('data-pp', 'site-footer');
      foot.innerHTML =
        '<div class="footer-inner">' +
        '  <a href="/" class="footer-logo">Prince <em>Prajapati</em></a>' +
        '  <div class="footer-copy">© ' + year + ' Prince Prajapati · ERP &amp; AI Consultant · Ahmedabad, India</div>' +
        '  <div class="footer-links">' +
        '    <a href="' + pageLink('about') + '">About</a>' +
        '    <a href="' + pageLink('services') + '">Services</a>' +
        '    <a href="' + '#contact' + '">Contact</a>' +
        '  </div>' +
        '</div>';
      document.body.appendChild(foot);
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

    var highlightObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          highlightObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('mark, .pp-highlight').forEach(function (el) {
      highlightObserver.observe(el);
    });

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

    var hoverEls = 'a, button, .calc-btn, .prod-tab, .ratio-input-method, .svc, .ind-card, .ccard, .btn-gold, .trust-chip, .flow-step, .nav-cta, .tog, .hamburger, .nav-links a, .qr-wallet, .qr-help, .qr-card, .footer-links a';
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
