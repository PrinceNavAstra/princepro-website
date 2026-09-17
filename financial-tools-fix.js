/* Financial tools reliability layer. Runs after products.js and provides
   deterministic client-side calculations for SIP, Loan and Ratio tools. */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function num(id) { var x = el(id); return x ? Number(x.value) : 0; }
  function optional(id) { var x = el(id); if (!x || x.value.trim() === '') return 0; var n = Number(x.value); return isFinite(n) ? n : 0; }
  function text(id, value) { var x = el(id); if (x) x.textContent = value; }
  function inr(n) { return isFinite(n) ? '₹' + Math.round(n).toLocaleString('en-IN') : '—'; }
  function pct(n) { return isFinite(n) ? n.toFixed(2) + '%' : '—'; }
  function ratio(n) { return isFinite(n) ? n.toFixed(2) + 'x' : '—'; }
  function valid(n) { return isFinite(n) && n >= 0; }

  function calculateSIP() {
    var monthly = num('sip-amount'), annual = num('sip-rate'), years = num('sip-years');
    if (!(monthly > 0) || !(years > 0) || !valid(annual)) return;
    var stepAmount = optional('sip-stepup-amount'), stepPercent = optional('sip-stepup-percent');
    var mr = annual / 12 / 100, regularBalance = 0, balance = 0, invested = 0, regularInvested = 0;
    var regularRows = [], stepRows = [], current = monthly;
    for (var y = 1; y <= Math.floor(years); y++) {
      var annualContribution = 0, regularAnnual = 0;
      for (var m = 0; m < 12; m++) {
        regularInvested += monthly; regularAnnual += monthly;
        regularBalance = regularBalance * (1 + mr) + monthly;
        invested += current; annualContribution += current;
        balance = balance * (1 + mr) + current;
      }
      regularRows.push({year:y, monthly:monthly, annual:regularAnnual, invested:regularInvested, value:regularBalance});
      stepRows.push({year:y, monthly:current, annual:annualContribution, invested:invested, value:balance});
      if (stepPercent > 0) current *= 1 + stepPercent / 100;
      else if (stepAmount > 0) current += stepAmount;
    }
    var hasStep = stepAmount > 0 || stepPercent > 0;
    text('sip-invested', inr(regularInvested));
    text('sip-returns', inr(regularBalance - regularInvested));
    text('sip-maturity', inr(regularBalance));
    text('sip-stepup-invested', hasStep ? inr(invested) : '—');
    text('sip-stepup-returns', hasStep ? inr(balance - invested) : '—');
    text('sip-stepup-maturity', hasStep ? inr(balance) : '—');
    text('sip-stepup-extra', hasStep ? inr(balance - regularBalance) : '—');
    var tbody = el('sip-progression-tbody');
    if (tbody) {
      tbody.innerHTML = '';
      (hasStep ? stepRows : regularRows).forEach(function (r, i) {
        var impact = hasStep ? r.value - regularRows[i].value : null;
        var tr = tbody.insertRow();
        [r.year, inr(r.monthly), inr(r.annual), inr(r.invested), inr(r.value), inr(r.value-r.invested), hasStep ? inr(impact) : '—'].forEach(function(v){ var td=tr.insertCell(); td.textContent=v; });
      });
    }
  }

  function loanSchedule(principal, annual, years, extraAnnual) {
    var months = Math.max(1, Math.round(years * 12)), mr = annual / 12 / 100;
    var emi = mr === 0 ? principal / months : principal * mr * Math.pow(1+mr, months) / (Math.pow(1+mr, months)-1);
    function run(extra) {
      var balance=principal, interest=0, rows=[], paid=0;
      for (var y=1; y<=Math.ceil(years) && balance>0; y++) {
        var begin=balance, principalPaid=0, interestPaid=0, extraPaid=0;
        for (var m=0;m<12 && balance>0;m++) {
          var ip=balance*mr, sp=mr===0 ? Math.min(emi,balance) : Math.min(emi-ip,balance);
          if (sp<0) sp=0;
          balance=Math.max(0,balance-sp); interest+=ip; principalPaid+=sp; interestPaid+=ip; paid++;
          if (extra>0 && m===11 && balance>0) { extraPaid=Math.min(extra,balance); balance-=extraPaid; }
        }
        rows.push({year:y,begin:begin,principal:principalPaid,extra:extraPaid,interest:interestPaid,end:balance,reduction:begin-balance});
      }
      return {rows:rows,interest:interest,months:paid,balance:balance};
    }
    var regular = run(0), accelerated = extraAnnual>0 ? run(extraAnnual) : null;
    return {emi:emi,regular:regular,accelerated:accelerated};
  }

  function calculateLoan() {
    var principal=num('loan-amount'), annual=num('loan-rate'), years=num('loan-years'), extra=optional('loan-extra-principal');
    if (!(principal>0) || !(years>0) || !valid(annual)) return;
    var r=loanSchedule(principal,annual,years,extra);
    text('loan-emi',inr(r.emi));
    text('loan-interest',inr(r.regular.interest));
    text('loan-total',inr(principal+r.regular.interest));
    var tbody=el('loan-amortization-tbody');
    if(tbody){ tbody.innerHTML=''; (r.accelerated||r.regular).rows.forEach(function(row){ var tr=tbody.insertRow(); [row.year,inr(row.begin),inr(row.principal),inr(row.extra),inr(row.interest),inr(row.end),inr(row.reduction)].forEach(function(v){var td=tr.insertCell();td.textContent=v;}); }); }
    if(r.accelerated){
      var saved=Math.max(0,r.regular.interest-r.accelerated.interest), reduced=Math.max(0,r.regular.months-r.accelerated.months);
      text('loan-tenure-reduction',Math.floor(reduced/12)+' years '+(reduced%12)+' months');
      text('loan-interest-saved',inr(saved));
      text('loan-new-tenure',Math.floor(r.accelerated.months/12)+' years '+(r.accelerated.months%12)+' months');
    } else { text('loan-tenure-reduction','—'); text('loan-interest-saved','—'); text('loan-new-tenure','—'); }
  }

  function setRatio(prefix, value, kind) {
    text('ratio-'+prefix+'-value', kind==='pct' ? pct(value) : ratio(value));
    var s=el('ratio-'+prefix+'-status');
    if(s){ s.textContent=''; s.className='ratio-status'; s.style.display='none'; }
  }

  function calculateRatios() {
    var ca=num('ratio-current-assets'), inv=num('ratio-inventory'), cl=num('ratio-current-liab'), debt=num('ratio-total-debt'), eq=num('ratio-equity'), assets=num('ratio-total-assets'), rev=num('ratio-revenue'), gross=num('ratio-gross-profit'), net=num('ratio-net-income');
    if(!(ca>0)||!(cl>0)||!(assets>0)||!(rev>0)||!(eq>0)) { alert('Please enter positive values for Current Assets, Current Liabilities, Total Assets, Revenue and Equity.'); return; }
    setRatio('current',ca/cl); setRatio('quick',(ca-inv)/cl); setRatio('debt-equity',debt/eq); setRatio('debt-assets',debt/assets); setRatio('equity-mult',assets/eq);
    setRatio('gross-margin',gross/rev*100,'pct'); setRatio('net-margin',net/rev*100,'pct'); setRatio('roa',net/assets*100,'pct'); setRatio('roe',net/eq*100,'pct');
    setRatio('equity',eq/assets*100,'pct'); setRatio('asset-turnover',rev/assets); setRatio('dupont',(net/rev)*(rev/assets)*(assets/eq),'pct');
    text('ratio-operating-margin-value','N/A');
    var op=el('ratio-operating-margin-status'); if(op){op.textContent='Requires operating profit or overhead input';op.className='ratio-status';op.style.display='inline-block';}
    var feedback=el('ratio-feedback');
    if(feedback){
      var notes=[];
      notes.push('Current ratio: '+ratio(ca/cl)+'.');
      notes.push('Quick ratio: '+ratio((ca-inv)/cl)+'.');
      notes.push('Debt-to-equity: '+ratio(debt/eq)+'.');
      notes.push('Net profit margin: '+pct(net/rev*100)+'.');
      notes.push('ROA: '+pct(net/assets*100)+', ROE: '+pct(net/eq*100)+'.');
      feedback.innerHTML='<p>'+notes.join(' ')+'</p><p>These are calculated from the figures entered and are not a substitute for a full financial review.</p>';
    }
  }

  function bind(id, fn){ var b=el(id); if(b){ b.addEventListener('click',function(e){e.preventDefault();try{fn();}catch(err){console.error('Financial tool error:',err);alert('Unable to calculate. Please check the entered values.');}}); } }
  bind('sip-calc-btn',calculateSIP);
  bind('loan-calc-btn',calculateLoan);
  bind('ratios-calc-btn',calculateRatios);

  // Give users an immediate working result on pages with default values.
  if(el('sip-calc-btn')) calculateSIP();
  if(el('loan-calc-btn')) calculateLoan();
})();
