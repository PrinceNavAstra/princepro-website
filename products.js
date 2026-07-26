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

  function parseOptionalNum(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    var value = el.value.trim();
    if (value === '') return null;
    var parsed = parseFloat(value);
    return isFinite(parsed) ? parsed : null;
  }

  function formatShortINR(num) {
    if (!isFinite(num)) return '—';
    var abs = Math.abs(num);
    if (abs >= 10000000) return '₹' + (num / 10000000).toFixed(1) + 'Cr';
    if (abs >= 100000) return '₹' + (num / 100000).toFixed(1) + 'L';
    if (abs >= 1000) return '₹' + (num / 1000).toFixed(1) + 'K';
    return '₹' + Math.round(num);
  }

  function formatTenure(months) {
    if (!isFinite(months) || months < 0) return '—';
    var totalMonths = Math.round(months);
    var years = Math.floor(totalMonths / 12);
    var remainingMonths = totalMonths % 12;

    if (years === 0) {
      return remainingMonths + ' months';
    }
    if (remainingMonths === 0) {
      return years + ' years';
    }
    return years + ' years ' + remainingMonths + ' months';
  }

  function renderMiniBarChart(containerId, categories, seriesList) {
    var container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (!categories || !categories.length || !seriesList || !seriesList.length) {
      container.innerHTML = '<div class="mini-chart-empty">No data yet.</div>';
      return;
    }

    var maxValue = 0;
    seriesList.forEach(function (series) {
      series.values.forEach(function (value) {
        if (isFinite(value) && value > maxValue) {
          maxValue = value;
        }
      });
    });

    if (maxValue <= 0) maxValue = 1;

    if (seriesList.length > 1) {
      var legend = document.createElement('div');
      legend.className = 'mini-chart-legend';
      seriesList.forEach(function (series) {
        var legendItem = document.createElement('span');
        legendItem.className = 'mini-chart-legend-item';
        legendItem.innerHTML = '<i class="mini-chart-swatch ' + (series.className || '') + '"></i>' + series.label;
        legend.appendChild(legendItem);
      });
      container.appendChild(legend);
    }

    var grid = document.createElement('div');
    grid.className = 'mini-chart-grid series-' + seriesList.length;

    categories.forEach(function (category, index) {
      var group = document.createElement('div');
      group.className = 'mini-chart-group';

      var bars = document.createElement('div');
      bars.className = 'mini-chart-bars';

      seriesList.forEach(function (series) {
        var value = series.values[index];
        var bar = document.createElement('div');
        bar.className = 'mini-chart-bar ' + (series.className || '');
        var height = isFinite(value) ? Math.max(8, (value / maxValue) * 100) : 0;
        bar.style.height = height + '%';
        bar.title = series.label + ': ' + (series.tooltip ? series.tooltip(value, category) : formatShortINR(value));

        var valueLabel = document.createElement('span');
        valueLabel.textContent = series.format ? series.format(value) : formatShortINR(value);
        bar.appendChild(valueLabel);
        bars.appendChild(bar);
      });

      var axis = document.createElement('div');
      axis.className = 'mini-chart-axis';
      axis.textContent = category;

      group.appendChild(bars);
      group.appendChild(axis);
      grid.appendChild(group);
    });

    container.appendChild(grid);
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

  /* ── Tool visibility rules (hero selection) ─────── */
  // Fundamental => hide SIP + Loan
  // Loans & debt => hide SIP + Financial Ratio
  // Investment => hide Loan + Financial Ratio
  var toolToPanelVisibility = {
    'ratios-analysis': { sip: false, loan: false, ratios: true },
    'loan-calculator': { sip: false, loan: true, ratios: false },
    'sip-calculator': { sip: true, loan: false, ratios: false }
  };

  function applyToolVisibility(toolId) {
    var rule = toolToPanelVisibility[toolId] || toolToPanelVisibility['sip-calculator'];

    var sipPanel = document.getElementById('sip-calculator');
    var loanPanel = document.getElementById('loan-calculator');
    var ratiosPanel = document.getElementById('ratios-analysis');

    if (sipPanel) sipPanel.classList.toggle('is-hidden', !rule.sip);
    if (loanPanel) loanPanel.classList.toggle('is-hidden', !rule.loan);
    if (ratiosPanel) ratiosPanel.classList.toggle('is-hidden', !rule.ratios);

    // Match tab active state
    activateTab(toolId);
  }

  // Hero quick-link clicks should update selection/visibility without requiring full reload.
  var heroLinks = document.querySelectorAll('.hero-ql[data-tool]');
  heroLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var toolId = this.getAttribute('data-tool');
      if (!toolId) return;

      // Prevent full navigation and just apply UI updates.
      // (Hash update still happens so refresh deep-links work.)
      e.preventDefault();

      applyToolVisibility(toolId);
      history.replaceState(null, '', '#' + toolId);

      var el = document.getElementById(toolId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Apply visibility on initial load / deep links.
  var initialTool = location.hash.replace('#', '');
  if (initialTool && document.getElementById(initialTool)) {
    applyToolVisibility(initialTool);
  } else {
    applyToolVisibility('sip-calculator');
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateTab(tab.dataset.panel);
      history.replaceState(null, '', '#' + tab.dataset.panel);
      applyToolVisibility(tab.dataset.panel);
    });
  });

  // Keep original hash->tab behavior too.
  var hash = location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    activateTab(hash);
  }

  /* ── SIP Calculator ───────────────────────────────── */
  function simulateRegularSIP(monthly, rate, years) {
    var monthlyRate = rate / 12 / 100;
    var balance = 0;
    var invested = 0;
    var rows = [];

    for (var year = 1; year <= years; year++) {
      var annualContribution = 0;

      for (var month = 0; month < 12; month++) {
        invested += monthly;
        annualContribution += monthly;
        balance = balance * (1 + monthlyRate) + monthly;
      }

      rows.push({
        year: year,
        monthly: monthly,
        annualContribution: annualContribution,
        cumulativeInvested: invested,
        accumulatedValue: balance,
        cumulativeReturns: balance - invested
      });
    }

    return {
      invested: invested,
      maturity: balance,
      returns: balance - invested,
      rows: rows
    };
  }

  function simulateStepUpSIP(monthly, rate, years, stepupAmount, stepupPercent) {
    var monthlyRate = rate / 12 / 100;
    var regular = simulateRegularSIP(monthly, rate, years);
    var currentMonthly = monthly;
    var balance = 0;
    var invested = 0;
    var rows = [];

    for (var year = 1; year <= years; year++) {
      var annualContribution = 0;

      for (var month = 0; month < 12; month++) {
        invested += currentMonthly;
        annualContribution += currentMonthly;
        balance = balance * (1 + monthlyRate) + currentMonthly;
      }

      rows.push({
        year: year,
        monthly: currentMonthly,
        annualContribution: annualContribution,
        cumulativeInvested: invested,
        accumulatedValue: balance,
        cumulativeReturns: balance - invested
      });

      if (stepupPercent > 0) {
        currentMonthly = currentMonthly * (1 + stepupPercent / 100);
      } else if (stepupAmount > 0) {
        currentMonthly += stepupAmount;
      }
    }

    return {
      regular: regular,
      stepUp: {
        invested: invested,
        maturity: balance,
        returns: balance - invested,
        extraReturns: balance - regular.maturity,
        rows: rows
      },
      hasStepUp: true
    };
  }

  function renderSIPTable(result) {
    var tbody = document.getElementById('sip-progression-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    var rows = result.hasStepUp ? result.stepUp.rows : result.regular.rows;

    rows.forEach(function (row, index) {
      var impact = result.hasStepUp ? Math.max(0, result.stepUp.rows[index].accumulatedValue - result.regular.rows[index].accumulatedValue) : null;
      var tr = tbody.insertRow();
      tr.innerHTML = '<td>' + row.year + '</td>' +
        '<td>' + formatINR(row.monthly) + '</td>' +
        '<td>' + formatINR(row.annualContribution) + '</td>' +
        '<td>' + formatINR(row.cumulativeInvested) + '</td>' +
        '<td>' + formatINR(row.accumulatedValue) + '</td>' +
        '<td>' + formatINR(row.cumulativeReturns) + '</td>' +
        '<td>' + (impact !== null ? formatINR(impact) : '—') + '</td>';
    });
  }

  function renderSIPChart(result) {
    var categories = result.regular.rows.map(function (row) {
      return 'Y' + row.year;
    });

    if (result.hasStepUp) {
      renderMiniBarChart('sip-chart', categories, [
        {
          label: 'Regular',
          className: 'regular',
          values: result.regular.rows.map(function (row) { return row.accumulatedValue; }),
          format: formatShortINR
        },
        {
          label: 'Step-Up',
          className: 'stepup',
          values: result.stepUp.rows.map(function (row) { return row.accumulatedValue; }),
          format: formatShortINR
        }
      ]);
    } else {
      renderMiniBarChart('sip-chart', categories, [
        {
          label: 'Accumulated Value',
          className: 'regular',
          values: result.regular.rows.map(function (row) { return row.accumulatedValue; }),
          format: formatShortINR
        }
      ]);
    }
  }

  function calcSIP() {
    var monthly = parseNum('sip-amount');
    var rate = parseNum('sip-rate');
    var years = parseNum('sip-years');
    var stepupAmount = parseOptionalNum('sip-stepup-amount') || 0;
    var stepupPercent = parseOptionalNum('sip-stepup-percent') || 0;

    if (monthly <= 0 || years <= 0) return;

    var result = stepupAmount > 0 || stepupPercent > 0 ?
      simulateStepUpSIP(monthly, rate, years, stepupAmount, stepupPercent) :
      {
        regular: simulateRegularSIP(monthly, rate, years),
        stepUp: null,
        hasStepUp: false
      };

    setText('sip-invested', formatINR(result.regular.invested));
    setText('sip-returns', formatINR(result.regular.returns));
    setText('sip-maturity', formatINR(result.regular.maturity));

    if (result.hasStepUp) {
      setText('sip-stepup-invested', formatINR(result.stepUp.invested));
      setText('sip-stepup-returns', formatINR(result.stepUp.returns));
      setText('sip-stepup-maturity', formatINR(result.stepUp.maturity));
      setText('sip-stepup-extra', formatINR(result.stepUp.extraReturns));
    } else {
      setText('sip-stepup-invested', '—');
      setText('sip-stepup-returns', '—');
      setText('sip-stepup-maturity', '—');
      setText('sip-stepup-extra', '—');
    }

    renderSIPTable(result);
    renderSIPChart(result);
  }

  /* ── Loan Calculator ──────────────────────────────── */
  function buildLoanSchedule(principal, rate, years, extraPrincipal) {
    var months = years * 12;
    var monthlyRate = rate / 12 / 100;
    var emi;

    if (monthlyRate === 0) {
      emi = principal / months;
    } else {
      emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    var total = emi * months;
    var interest = total - principal;

    function buildRows(extraAnnual) {
      var balance = principal;
      var rows = [];
      var monthsPaid = 0;
      var totalInterestPaid = 0;

      for (var year = 1; year <= years; year++) {
        var beginningBalance = balance;
        var yearPrincipal = 0;
        var yearInterest = 0;
        var yearExtraPrincipal = 0;

        for (var month = 0; month < 12; month++) {
          if (balance <= 0) break;

          var interestPayment = balance * monthlyRate;
          var scheduledPrincipal = monthlyRate === 0 ? emi : emi - interestPayment;
          if (scheduledPrincipal < 0) scheduledPrincipal = 0;

          var principalPayment = Math.min(balance, scheduledPrincipal);
          totalInterestPaid += interestPayment;
          yearInterest += interestPayment;
          yearPrincipal += principalPayment;
          balance -= principalPayment;
          monthsPaid++;

          if (balance <= 0) {
            balance = 0;
            break;
          }
        }

        if (balance > 0 && extraAnnual > 0) {
          var extraPayment = Math.min(extraAnnual, balance);
          balance -= extraPayment;
          yearExtraPrincipal += extraPayment;
        }

        rows.push({
          year: year,
          beginningBalance: beginningBalance,
          principalPayment: yearPrincipal,
          extraPrincipal: yearExtraPrincipal,
          interestPayment: yearInterest,
          endingBalance: balance,
          monthsPaid: monthsPaid
        });
      }

      return {
        rows: rows,
        monthsPaid: monthsPaid,
        totalInterestPaid: totalInterestPaid,
        finalBalance: balance
      };
    }

    var regular = buildRows(0);
    if (extraPrincipal <= 0) {
      return {
        emi: emi,
        total: total,
        interest: interest,
        regular: regular,
        scenario: null,
        hasExtra: false
      };
    }

    var scenario = buildRows(extraPrincipal);

    return {
      emi: emi,
      total: total,
      interest: interest,
      regular: regular,
      scenario: scenario,
      hasExtra: true,
      tenureReductionMonths: Math.max(0, years * 12 - scenario.monthsPaid),
      newTenureMonths: scenario.monthsPaid,
      interestSaved: Math.max(0, interest - scenario.totalInterestPaid)
    };
  }

  function renderLoanTable(result) {
    var tbody = document.getElementById('loan-amortization-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    var rows = result.hasExtra ? result.scenario.rows : result.regular.rows;

    rows.forEach(function (row, index) {
      var balanceReduction = result.hasExtra ? Math.max(0, result.regular.rows[index].endingBalance - row.endingBalance) : null;
      var tr = tbody.insertRow();
      tr.innerHTML = '<td>' + row.year + '</td>' +
        '<td>' + formatINR(row.beginningBalance) + '</td>' +
        '<td>' + formatINR(row.principalPayment) + '</td>' +
        '<td>' + formatINR(row.extraPrincipal) + '</td>' +
        '<td>' + formatINR(row.interestPayment) + '</td>' +
        '<td>' + formatINR(row.endingBalance) + '</td>' +
        '<td>' + (balanceReduction !== null ? formatINR(balanceReduction) : '—') + '</td>';
    });
  }

  function renderLoanChart(result) {
    var categories = result.regular.rows.map(function (row) {
      return 'Y' + row.year;
    });

    if (result.hasExtra) {
      renderMiniBarChart('loan-chart', categories, [
        {
          label: 'Regular Balance',
          className: 'regular',
          values: result.regular.rows.map(function (row) { return row.endingBalance; }),
          format: formatShortINR
        },
        {
          label: 'With Extra Principal',
          className: 'extra',
          values: result.scenario.rows.map(function (row) { return row.endingBalance; }),
          format: formatShortINR
        }
      ]);
    } else {
      renderMiniBarChart('loan-chart', categories, [
        {
          label: 'Ending Balance',
          className: 'regular',
          values: result.regular.rows.map(function (row) { return row.endingBalance; }),
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
