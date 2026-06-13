(function() {
  function formatINR(num) {
    if (!isFinite(num)) return '—';
    return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }

  function formatPct(num, digits) {
    if (!isFinite(num)) return '—';
    return num.toFixed(digits == null ? 2 : digits) + '%';
  }

  function formatRatio(num) {
    if (!isFinite(num)) return '—';
    return num.toFixed(2) + 'x';
  }

  function parseNum(id) {
    var el = document.getElementById(id);
    return el ? parseFloat(el.value) || 0 : 0;
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setRatioCard(id, value, status, statusText) {
    var valEl = document.getElementById(id + '-value');
    var statusEl = document.getElementById(id + '-status');
    if (valEl) valEl.textContent = value;
    if (statusEl) {
      statusEl.textContent = statusText || '';
      statusEl.className = 'ratio-status ' + (status || '');
      statusEl.style.display = statusText ? 'inline-block' : 'none';
    }
  }

  /* ── Tabs ─────────────────────────────────────────── */
  var tabs = document.querySelectorAll('.prod-tab');
  var panels = document.querySelectorAll('.prod-panel');

  function activateTab(targetId) {
    tabs.forEach(function(tab) {
      var isActive = tab.dataset.panel === targetId;
      tab.classList.toggle('active', isActive);
    });
    panels.forEach(function(panel) {
      panel.classList.toggle('active', panel.id === targetId);
    });
  }

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      activateTab(tab.dataset.panel);
      history.replaceState(null, '', '#' + tab.dataset.panel);
    });
  });

  var hash = location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    activateTab(hash);
  }

  /* ── SIP Calculator ───────────────────────────────── */
  function calcSIP() {
    var monthly = parseNum('sip-amount');
    var rate = parseNum('sip-rate');
    var years = parseNum('sip-years');
    var months = years * 12;
    var r = rate / 12 / 100;

    if (monthly <= 0 || years <= 0) return;

    var invested = monthly * months;
    var maturity;

    if (r === 0) {
      maturity = invested;
    } else {
      maturity = monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    }

    var returns = maturity - invested;

    setText('sip-invested', formatINR(invested));
    setText('sip-returns', formatINR(returns));
    setText('sip-maturity', formatINR(maturity));
  }

  var sipBtn = document.getElementById('sip-calc-btn');
  if (sipBtn) sipBtn.addEventListener('click', calcSIP);

  /* ── Loan Calculator ──────────────────────────────── */
  function calcLoan() {
    var principal = parseNum('loan-amount');
    var rate = parseNum('loan-rate');
    var years = parseNum('loan-years');
    var months = years * 12;
    var r = rate / 12 / 100;

    if (principal <= 0 || years <= 0) return;

    var emi;
    if (r === 0) {
      emi = principal / months;
    } else {
      emi = principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
    }

    var total = emi * months;
    var interest = total - principal;

    setText('loan-emi', formatINR(emi));
    setText('loan-interest', formatINR(interest));
    setText('loan-total', formatINR(total));
  }

  var loanBtn = document.getElementById('loan-calc-btn');
  if (loanBtn) loanBtn.addEventListener('click', calcLoan);

  /* ── Quick Ratios Analysis ────────────────────────── */
  function ratioStatus(value, goodMin, goodMax) {
    if (!isFinite(value)) return { cls: '', text: '' };
    if (value >= goodMin && value <= goodMax) return { cls: 'good', text: 'Healthy' };
    if (value >= goodMin * 0.7 && value <= goodMax * 1.3) return { cls: 'warn', text: 'Review' };
    return { cls: 'bad', text: 'Attention' };
  }

  function calcRatios() {
    var currentAssets = parseNum('ratio-current-assets');
    var inventory = parseNum('ratio-inventory');
    var currentLiab = parseNum('ratio-current-liab');
    var totalDebt = parseNum('ratio-total-debt');
    var equity = parseNum('ratio-equity');
    var totalAssets = parseNum('ratio-total-assets');
    var revenue = parseNum('ratio-revenue');
    var grossProfit = parseNum('ratio-gross-profit');
    var netIncome = parseNum('ratio-net-income');

    var currentRatio = currentLiab > 0 ? currentAssets / currentLiab : NaN;
    var quickRatio = currentLiab > 0 ? (currentAssets - inventory) / currentLiab : NaN;
    var debtEquity = equity > 0 ? totalDebt / equity : NaN;
    var debtAssets = totalAssets > 0 ? totalDebt / totalAssets : NaN;
    var roe = equity > 0 ? (netIncome / equity) * 100 : NaN;
    var roa = totalAssets > 0 ? (netIncome / totalAssets) * 100 : NaN;
    var netMargin = revenue > 0 ? (netIncome / revenue) * 100 : NaN;
    var grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : NaN;
    var equityRatio = totalAssets > 0 ? (equity / totalAssets) * 100 : NaN;

    var s1 = ratioStatus(currentRatio, 1.5, 3);
    var s2 = ratioStatus(quickRatio, 1, 2.5);
    var s3 = ratioStatus(debtEquity, 0, 1);
    var s4 = ratioStatus(debtAssets, 0, 0.5);
    var s5 = ratioStatus(roe, 10, 100);
    var s6 = ratioStatus(roa, 5, 50);
    var s7 = ratioStatus(netMargin, 5, 100);
    var s8 = ratioStatus(grossMargin, 20, 100);

    setRatioCard('ratio-current', formatRatio(currentRatio), s1.cls, s1.text);
    setRatioCard('ratio-quick', formatRatio(quickRatio), s2.cls, s2.text);
    setRatioCard('ratio-debt-equity', formatRatio(debtEquity), s3.cls, debtEquity <= 1 ? s3.text : 'High leverage');
    setRatioCard('ratio-debt-assets', formatPct(debtAssets * 100), s4.cls, s4.text);
    setRatioCard('ratio-roe', formatPct(roe), s5.cls, s5.text);
    setRatioCard('ratio-roa', formatPct(roa), s6.cls, s6.text);
    setRatioCard('ratio-net-margin', formatPct(netMargin), s7.cls, s7.text);
    setRatioCard('ratio-gross-margin', formatPct(grossMargin), s8.cls, s8.text);
    setRatioCard('ratio-equity', formatPct(equityRatio), ratioStatus(equityRatio, 30, 70).cls, 'Of total assets');
  }

  var ratiosBtn = document.getElementById('ratios-calc-btn');
  if (ratiosBtn) ratiosBtn.addEventListener('click', calcRatios);

  /* ── Auto-calculate on load with defaults ─────────── */
  calcSIP();
  calcLoan();
  calcRatios();
})();
