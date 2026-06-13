(function () {
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
    tabs.forEach(function (tab) {
      var isActive = tab.dataset.panel === targetId;
      tab.classList.toggle('active', isActive);
    });
    panels.forEach(function (panel) {
      panel.classList.toggle('active', panel.id === targetId);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
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

    generateSIPTable(monthly, rate, years);
  }

  function generateSIPTable(monthly, rate, years) {
    var tbody = document.getElementById('sip-progression-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    var r = rate / 12 / 100;
    var balance = 0;

    for (var year = 1; year <= years; year++) {
      var yearlyContribution = monthly * 12;
      var yearReturns = 0;

      for (var m = 0; m < 12; m++) {
        balance = balance * (1 + r) + monthly;
      }

      var row = tbody.insertRow();
      row.innerHTML = '<td>' + year + '</td>' +
        '<td>' + formatINR(monthly) + '</td>' +
        '<td>' + formatINR(yearlyContribution) + '</td>' +
        '<td>' + formatINR(yearReturns) + '</td>' +
        '<td>' + formatINR(balance) + '</td>';
    }
  }

  function calcSIPStepUp() {
    var monthly = parseNum('sip-amount');
    var rate = parseNum('sip-rate');
    var years = parseNum('sip-years');
    var stepupAmount = parseNum('sip-stepup-amount');
    var stepupPercent = parseNum('sip-stepup-percent') || 0;

    if (monthly <= 0 || years <= 0) return;

    var months = years * 12;
    var r = rate / 12 / 100;

    // Calculate regular SIP
    var regularInvested = monthly * months;
    var regularMaturity;
    if (r === 0) {
      regularMaturity = regularInvested;
    } else {
      regularMaturity = monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    }

    // Calculate step-up SIP
    var stepupInvested = 0;
    var stepupMaturity = 0;
    var currentMonthly = monthly;

    for (var year = 0; year < years; year++) {
      for (var m = 0; m < 12; m++) {
        stepupInvested += currentMonthly;
        stepupMaturity = stepupMaturity * (1 + r) + currentMonthly;
      }
      // Increase for next year
      if (stepupPercent > 0) {
        currentMonthly = currentMonthly * (1 + stepupPercent / 100);
      } else {
        currentMonthly += stepupAmount;
      }
    }

    var stepupReturns = stepupMaturity - stepupInvested;
    var extraReturns = stepupMaturity - regularMaturity;

    setText('sip-stepup-invested', formatINR(stepupInvested));
    setText('sip-stepup-returns', formatINR(stepupReturns));
    setText('sip-stepup-maturity', formatINR(stepupMaturity));
    setText('sip-stepup-extra', formatINR(extraReturns));
  }

  /* ── SIP Event Listeners ──────────────────────────── */
  var sipBtn = document.getElementById('sip-calc-btn');
  if (sipBtn) sipBtn.addEventListener('click', calcSIP);

  var sipStepupCheckbox = document.getElementById('sip-stepup-enable');
  if (sipStepupCheckbox) {
    sipStepupCheckbox.addEventListener('change', function () {
      var amountField = document.getElementById('sip-stepup-amount-field');
      var percentField = document.getElementById('sip-stepup-percent-field');
      if (this.checked) {
        amountField.style.display = 'block';
        percentField.style.display = 'block';
      } else {
        amountField.style.display = 'none';
        percentField.style.display = 'none';
      }
    });
  }

  var sipAdvanceBtn = document.getElementById('sip-advance-btn');
  if (sipAdvanceBtn) sipAdvanceBtn.addEventListener('click', calcSIPStepUp);

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

    generateLoanAmortizationTable(principal, rate, years);
  }

  function generateLoanAmortizationTable(principal, rate, years) {
    var tbody = document.getElementById('loan-amortization-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    var r = rate / 12 / 100;
    var months = years * 12;
    var emi;

    if (r === 0) {
      emi = principal / months;
    } else {
      emi = principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
    }

    var balance = principal;

    for (var year = 1; year <= years; year++) {
      var yearPrincipal = 0;
      var yearInterest = 0;

      for (var m = 0; m < 12; m++) {
        var interest = balance * r;
        var principal_payment = emi - interest;
        yearPrincipal += principal_payment;
        yearInterest += interest;
        balance -= principal_payment;
      }

      balance = Math.max(0, balance);
      var row = tbody.insertRow();
      row.innerHTML = '<td>' + year + '</td>' +
        '<td>' + formatINR(balance + yearPrincipal) + '</td>' +
        '<td>' + formatINR(yearPrincipal) + '</td>' +
        '<td>' + formatINR(yearInterest) + '</td>' +
        '<td>' + formatINR(balance) + '</td>';
    }
  }

  function calcLoanAdvance() {
    var principal = parseNum('loan-amount');
    var rate = parseNum('loan-rate');
    var years = parseNum('loan-years');
    var extraPrincipal = parseNum('loan-extra-principal');
    var months = years * 12;
    var r = rate / 12 / 100;

    if (principal <= 0 || years <= 0 || extraPrincipal <= 0) return;

    // Calculate regular EMI
    var emi;
    if (r === 0) {
      emi = principal / months;
    } else {
      emi = principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
    }

    var totalInterest = (emi * months) - principal;

    // Calculate with extra principal
    var balance = principal;
    var monthsPaid = 0;
    var totalInterestWithExtra = 0;
    var extraPrincipalMonthly = extraPrincipal / 12;

    while (balance > 0 && monthsPaid < 500) {
      var interest = balance * r;
      var principalPay = emi - interest + extraPrincipalMonthly;
      totalInterestWithExtra += interest;
      balance -= principalPay;
      monthsPaid++;
    }

    var newYears = Math.ceil(monthsPaid / 12);
    var tenureReduction = years - newYears;
    var interestSaved = totalInterest - totalInterestWithExtra;

    setText('loan-tenure-reduction', tenureReduction + ' years');
    setText('loan-interest-saved', formatINR(interestSaved));
    setText('loan-new-tenure', newYears + ' years');
  }

  var loanBtn = document.getElementById('loan-calc-btn');
  if (loanBtn) loanBtn.addEventListener('click', calcLoan);

  var loanAdvanceBtn = document.getElementById('loan-advance-btn');
  if (loanAdvanceBtn) loanAdvanceBtn.addEventListener('click', calcLoanAdvance);

  /* ── Ratios Input Method Selector ──────────────────── */
  var ratioInputMethods = document.querySelectorAll('.ratio-input-method');
  ratioInputMethods.forEach(function (btn) {
    btn.addEventListener('click', function () {
      ratioInputMethods.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      var method = this.dataset.method;
      var manualSection = document.getElementById('manual-entry-section');
      var fileSection = document.getElementById('file-upload-section');

      if (method === 'file') {
        manualSection.style.display = 'none';
        fileSection.style.display = 'block';
      } else {
        manualSection.style.display = 'block';
        fileSection.style.display = 'none';
      }
    });
  });

  /* ── Quick Ratios Analysis ────────────────────────── */
  function ratioStatus(value, goodMin, goodMax) {
    if (!isFinite(value)) return { cls: '', text: '' };
    if (value >= goodMin && value <= goodMax) return { cls: 'good', text: 'Healthy' };
    if (value >= goodMin * 0.7 && value <= goodMax * 1.3) return { cls: 'warn', text: 'Review' };
    return { cls: 'bad', text: 'Attention' };
  }

  function generateRatioFeedback(currentRatio, quickRatio, debtEquity, roe, roa, netMargin) {
    var feedbackHtml = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">';

    // Liquidity Assessment
    if (currentRatio >= 1.5 && currentRatio <= 3) {
      feedbackHtml += '<p style="padding: 12px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;"><strong>✓ Strong Liquidity:</strong> Current ratio is within healthy range. Company can meet short-term obligations.</p>';
    } else if (currentRatio < 1) {
      feedbackHtml += '<p style="padding: 12px; background: #ffebee; border-left: 4px solid #f44336; border-radius: 4px;"><strong>⚠ Low Liquidity:</strong> Current ratio below 1.0 indicates potential difficulty in meeting short-term liabilities.</p>';
    } else if (currentRatio > 3) {
      feedbackHtml += '<p style="padding: 12px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px;"><strong>ℹ High Liquidity:</strong> Excess current assets may indicate inefficient use of capital.</p>';
    }

    // Leverage Assessment
    if (debtEquity <= 1) {
      feedbackHtml += '<p style="padding: 12px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;"><strong>✓ Conservative Leverage:</strong> Debt-to-Equity ratio indicates moderate use of debt financing.</p>';
    } else if (debtEquity > 1 && debtEquity <= 2) {
      feedbackHtml += '<p style="padding: 12px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px;"><strong>ℹ Moderate Leverage:</strong> Company is using significant debt. Monitor debt servicing ability.</p>';
    } else {
      feedbackHtml += '<p style="padding: 12px; background: #ffebee; border-left: 4px solid #f44336; border-radius: 4px;"><strong>⚠ High Leverage:</strong> High debt relative to equity. Consider debt reduction.</p>';
    }

    // Profitability Assessment
    if (roe >= 10 && roe <= 20) {
      feedbackHtml += '<p style="padding: 12px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;"><strong>✓ Good Returns:</strong> ROE indicates healthy returns on shareholder equity.</p>';
    } else if (roe > 20) {
      feedbackHtml += '<p style="padding: 12px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;"><strong>✓ Excellent Performance:</strong> ROE above 20% shows exceptional profitability.</p>';
    } else if (roe < 5) {
      feedbackHtml += '<p style="padding: 12px; background: #ffebee; border-left: 4px solid #f44336; border-radius: 4px;"><strong>⚠ Low Returns:</strong> ROE below 5% suggests operational challenges.</p>';
    }

    // Margin Assessment
    if (netMargin >= 5 && netMargin <= 15) {
      feedbackHtml += '<p style="padding: 12px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;"><strong>✓ Healthy Margins:</strong> Net profit margin in normal range for most industries.</p>';
    } else if (netMargin > 15) {
      feedbackHtml += '<p style="padding: 12px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;"><strong>✓ Strong Margins:</strong> High net profit margin indicates strong pricing power.</p>';
    } else if (netMargin < 2) {
      feedbackHtml += '<p style="padding: 12px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px;"><strong>ℹ Low Margins:</strong> Review cost structure and pricing strategy.</p>';
    }

    feedbackHtml += '</div>';

    var feedbackEl = document.getElementById('ratio-feedback');
    if (feedbackEl) feedbackEl.innerHTML = feedbackHtml;
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

    // Basic Ratios
    var currentRatio = currentLiab > 0 ? currentAssets / currentLiab : NaN;
    var quickRatio = currentLiab > 0 ? (currentAssets - inventory) / currentLiab : NaN;

    // Leverage Ratios
    var debtEquity = equity > 0 ? totalDebt / equity : NaN;
    var debtAssets = totalAssets > 0 ? totalDebt / totalAssets : NaN;
    var equityMult = equity > 0 ? totalAssets / equity : NaN;

    // Profitability Ratios
    var grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : NaN;
    var netMargin = revenue > 0 ? (netIncome / revenue) * 100 : NaN;
    var roe = equity > 0 ? (netIncome / equity) * 100 : NaN;
    var roa = totalAssets > 0 ? (netIncome / totalAssets) * 100 : NaN;

    // Advanced Ratios
    var equityRatio = totalAssets > 0 ? (equity / totalAssets) * 100 : NaN;
    var operatingMargin = revenue > 0 ? ((grossProfit * 0.8) / revenue) * 100 : NaN;
    var assetTurnover = totalAssets > 0 ? revenue / totalAssets : NaN;
    var dupont = (netMargin / 100) * assetTurnover * equityMult;

    // Set status for each ratio
    var s1 = ratioStatus(currentRatio, 1.5, 3);
    var s2 = ratioStatus(quickRatio, 1, 2.5);
    var s3 = ratioStatus(debtEquity, 0, 1);
    var s4 = ratioStatus(debtAssets, 0, 0.5);
    var s5 = ratioStatus(roe, 10, 100);
    var s6 = ratioStatus(roa, 5, 50);
    var s7 = ratioStatus(netMargin, 5, 100);
    var s8 = ratioStatus(grossMargin, 20, 100);
    var s9 = ratioStatus(operatingMargin, 10, 50);
    var s10 = ratioStatus(assetTurnover, 1, 3);

    // Display all ratios
    setRatioCard('ratio-current', formatRatio(currentRatio), s1.cls, s1.text);
    setRatioCard('ratio-quick', formatRatio(quickRatio), s2.cls, s2.text);
    setRatioCard('ratio-debt-equity', formatRatio(debtEquity), s3.cls, debtEquity <= 1 ? s3.text : 'High leverage');
    setRatioCard('ratio-debt-assets', formatPct(debtAssets * 100), s4.cls, s4.text);
    setRatioCard('ratio-equity-mult', formatRatio(equityMult), 'info', 'Leverage effect');
    setRatioCard('ratio-roe', formatPct(roe), s5.cls, s5.text);
    setRatioCard('ratio-roa', formatPct(roa), s6.cls, s6.text);
    setRatioCard('ratio-net-margin', formatPct(netMargin), s7.cls, s7.text);
    setRatioCard('ratio-gross-margin', formatPct(grossMargin), s8.cls, s8.text);
    setRatioCard('ratio-equity', formatPct(equityRatio), ratioStatus(equityRatio, 30, 70).cls, 'Of total assets');
    setRatioCard('ratio-operating-margin', formatPct(operatingMargin), s9.cls, s9.text);
    setRatioCard('ratio-asset-turnover', formatRatio(assetTurnover), s10.cls, s10.text);
    setRatioCard('ratio-dupont', formatPct(dupont * 100), ratioStatus(dupont * 100, 5, 50).cls, 'DuPont ROE');

    // Generate feedback
    generateRatioFeedback(currentRatio, quickRatio, debtEquity, roe, roa, netMargin);
  }

  var ratiosBtn = document.getElementById('ratios-calc-btn');
  if (ratiosBtn) ratiosBtn.addEventListener('click', calcRatios);

  // File upload handler
  var fileUploadBtn = document.getElementById('ratio-upload-btn');
  if (fileUploadBtn) {
    fileUploadBtn.addEventListener('click', function () {
      var fileInput = document.getElementById('ratio-file-upload');
      if (fileInput.files.length === 0) {
        alert('Please select a file');
        return;
      }

      var file = fileInput.files[0];
      var reader = new FileReader();

      reader.onload = function (e) {
        var text = e.target.result;
        var lines = text.split('\n');
        if (lines.length > 1) {
          var values = lines[1].split(',');
          if (values.length >= 9) {
            document.getElementById('ratio-current-assets').value = values[0].trim();
            document.getElementById('ratio-inventory').value = values[1].trim();
            document.getElementById('ratio-current-liab').value = values[2].trim();
            document.getElementById('ratio-total-debt').value = values[3].trim();
            document.getElementById('ratio-equity').value = values[4].trim();
            document.getElementById('ratio-total-assets').value = values[5].trim();
            document.getElementById('ratio-revenue').value = values[6].trim();
            document.getElementById('ratio-gross-profit').value = values[7].trim();
            document.getElementById('ratio-net-income').value = values[8].trim();
            calcRatios();
          }
        }
      };
      reader.readAsText(file);
    });
  }

  /* ── Style input method buttons ─────────────────────── */
  var style = document.createElement('style');
  style.textContent = '.ratio-input-method.active { background: var(--gold) !important; border-color: var(--gold) !important; color: var(--bg) !important; font-weight: 600; }';
  document.head.appendChild(style);

  /* ── Auto-calculate on load with defaults ─────────── */
  calcSIP();
  calcLoan();
  calcRatios();
})();
