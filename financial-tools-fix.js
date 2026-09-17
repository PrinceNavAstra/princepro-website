/* Financial tools reliability + chart layer. Runs after products.js. */
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

  var chartState = { sip: null, loan: null, ratios: null };

  function addChartStyles() {
    if (el('financial-chart-styles')) return;
    var s = document.createElement('style');
    s.id = 'financial-chart-styles';
    s.textContent = `
      .pp-fin-chart { margin-top: 28px; background: var(--card-bg, var(--card)); border: 1px solid var(--border, var(--bdr)); border-radius: 18px; padding: 24px; overflow: hidden; box-shadow: var(--shadow-card, 0 10px 30px rgba(0,0,0,.08)); }
      .pp-fin-chart__head { display:flex; justify-content:space-between; align-items:flex-start; gap:18px; margin-bottom:18px; flex-wrap:wrap; }
      .pp-fin-chart__title { font-family:'Lora',Georgia,serif; color:var(--text-primary,var(--th)); font-size:1.25rem; font-weight:700; margin:0 0 5px; }
      .pp-fin-chart__desc { color:var(--text-muted,var(--tm)); font-size:.9rem; margin:0; }
      .pp-fin-chart__tabs { display:flex; gap:7px; padding:4px; border:1px solid var(--border,var(--bdr)); border-radius:999px; background:var(--bg-2,var(--bg2)); }
      .pp-fin-chart__tab { border:0; border-radius:999px; padding:8px 13px; background:transparent; color:var(--text-body,var(--tb)); font:500 .78rem 'DM Sans',sans-serif; cursor:pointer; transition:all .22s ease; }
      .pp-fin-chart__tab:hover { color:var(--gold); transform:translateY(-1px); }
      .pp-fin-chart__tab.active { background:var(--gold); color:var(--bg,#080810); box-shadow:0 5px 16px rgba(212,168,83,.24); }
      .pp-fin-chart__stage { min-height:300px; position:relative; border:1px solid var(--border,var(--bdr)); border-radius:14px; background:linear-gradient(180deg, rgba(212,168,83,.035), transparent); padding:12px 8px 2px; }
      .pp-fin-chart__stage svg { display:block; width:100%; height:300px; overflow:visible; }
      .pp-chart-grid { stroke:var(--border,var(--bdr)); stroke-width:1; opacity:.8; }
      .pp-chart-axis { fill:var(--text-muted,var(--tm)); font:11px 'DM Sans',sans-serif; }
      .pp-chart-line { fill:none; stroke:var(--gold); stroke-width:3.5; stroke-linecap:round; stroke-linejoin:round; filter:drop-shadow(0 4px 9px rgba(212,168,83,.25)); stroke-dasharray:1000; stroke-dashoffset:1000; animation:ppLineDraw 1.15s cubic-bezier(.2,.75,.25,1) forwards; }
      .pp-chart-area { fill:url(#ppChartArea); opacity:.28; }
      .pp-chart-point { fill:var(--card-bg,var(--card)); stroke:var(--gold); stroke-width:2.5; transform-box:fill-box; transform-origin:center; animation:ppPointIn .5s cubic-bezier(.2,.8,.2,1) both; }
      .pp-chart-bar { fill:var(--gold); opacity:.88; transform-box:fill-box; transform-origin:center bottom; animation:ppBarIn .65s cubic-bezier(.2,.8,.2,1) both; }
      .pp-chart-bar:hover { opacity:1; filter:drop-shadow(0 5px 10px rgba(212,168,83,.3)); }
      .pp-chart-donut { fill:none; stroke-width:38; transform:rotate(-90deg); transform-origin:50% 50%; animation:ppDonutIn 1s cubic-bezier(.2,.75,.25,1) both; }
      .pp-chart-center { fill:var(--text-primary,var(--th)); font:700 16px 'DM Sans',sans-serif; text-anchor:middle; }
      .pp-chart-legend { display:flex; gap:14px; flex-wrap:wrap; margin-top:12px; color:var(--text-body,var(--tb)); font-size:.8rem; }
      .pp-chart-legend span { display:inline-flex; align-items:center; gap:6px; }
      .pp-chart-dot { width:9px; height:9px; border-radius:50%; background:var(--gold); display:inline-block; }
      @keyframes ppLineDraw { to { stroke-dashoffset:0; } }
      @keyframes ppPointIn { from { opacity:0; transform:scale(.2); } to { opacity:1; transform:scale(1); } }
      @keyframes ppBarIn { from { opacity:0; transform:scaleY(0); } to { opacity:.88; transform:scaleY(1); } }
      @keyframes ppDonutIn { from { stroke-dashoffset:var(--dash); opacity:.1; } to { stroke-dashoffset:var(--offset); opacity:1; } }
      @media (max-width:640px) { .pp-fin-chart { padding:17px 13px; } .pp-fin-chart__stage svg { height:260px; } .pp-fin-chart__stage { min-height:260px; } .pp-fin-chart__tabs { width:100%; justify-content:space-between; } .pp-fin-chart__tab { flex:1; padding:8px 7px; } }
    `;
    document.head.appendChild(s);
  }

  function chartPanel(key, title, desc, anchor) {
    addChartStyles();
    var id = 'pp-fin-chart-' + key;
    var panel = el(id);
    if (!panel) {
      panel = document.createElement('section');
      panel.id = id;
      panel.className = 'pp-fin-chart';
      panel.innerHTML = '<div class="pp-fin-chart__head"><div><h3 class="pp-fin-chart__title">' + title + '</h3><p class="pp-fin-chart__desc">' + desc + '</p></div><div class="pp-fin-chart__tabs" role="tablist"><button type="button" class="pp-fin-chart__tab active" data-chart="line">Line</button><button type="button" class="pp-fin-chart__tab" data-chart="bar">Bar</button><button type="button" class="pp-fin-chart__tab" data-chart="pie">Pie</button></div></div><div class="pp-fin-chart__stage"></div><div class="pp-chart-legend"></div>';
      (anchor || document.querySelector('.wrap') || document.body).appendChild(panel);
      panel.querySelectorAll('.pp-fin-chart__tab').forEach(function (btn) {
        btn.addEventListener('click', function () {
          panel.querySelectorAll('.pp-fin-chart__tab').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          renderChart(key, btn.getAttribute('data-chart'));
        });
      });
    }
    return panel;
  }

  function esc(v) { return String(v).replace(/[&<>\"]/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]); }); }
  function renderChart(key, type) {
    var state = chartState[key];
    if (!state || !state.data || !state.data.length) return;
    var panel = el('pp-fin-chart-' + key); if (!panel) return;
    var stage = panel.querySelector('.pp-fin-chart__stage');
    var legend = panel.querySelector('.pp-chart-legend');
    var data = state.data;
    var w = 920, h = 300, pad = {l:58,r:24,t:20,b:42};
    var values = data.map(function(d){return Math.max(0, Number(d.value)||0);});
    var max = Math.max.apply(null, values.concat([1]));
    var min = Math.min.apply(null, values.concat([0]));
    if (max === min) max = min + 1;
    var x = function(i){ return pad.l + (data.length===1 ? (w-pad.l-pad.r)/2 : i*(w-pad.l-pad.r)/(data.length-1)); };
    var y = function(v){ return pad.t + (max-v)/(max-min)*(h-pad.t-pad.b); };
    var labels = data.map(function(d){return d.label;});
    var fmt = state.format || function(v){return inr(v);};
    var grid = '';
    for(var g=0;g<=4;g++){ var gv=min+(max-min)*(g/4); var gy=y(gv); grid += '<line class="pp-chart-grid" x1="'+pad.l+'" x2="'+(w-pad.r)+'" y1="'+gy+'" y2="'+gy+'"/><text class="pp-chart-axis" x="'+(pad.l-9)+'" y="'+(gy+4)+'" text-anchor="end">'+esc(fmt(gv))+'</text>'; }
    var svg='';
    if(type==='line'){
      var pts=data.map(function(d,i){return x(i)+','+y(d.value);}).join(' ');
      var areaPts=pad.l+','+(h-pad.b)+' '+pts+' '+(w-pad.r)+','+(h-pad.b);
      svg='<defs><linearGradient id="ppChartArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".55"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><polyline class="pp-chart-area" points="'+areaPts+'"/><polyline class="pp-chart-line" points="'+pts+'"/>';
      data.forEach(function(d,i){svg+='<circle class="pp-chart-point" cx="'+x(i)+'" cy="'+y(d.value)+'" r="5" style="animation-delay:'+(i*.035)+'s"><title>'+esc(d.label)+': '+esc(fmt(d.value))+'</title></circle>';});
    } else if(type==='bar'){
      var bw=Math.max(12, Math.min(54,(w-pad.l-pad.r)/data.length*.58));
      data.forEach(function(d,i){var bh=h-pad.b-y(d.value); var bx=x(i)-bw/2; svg+='<rect class="pp-chart-bar" x="'+bx+'" y="'+y(d.value)+'" width="'+bw+'" height="'+Math.max(0,bh)+'" rx="7" style="animation-delay:'+(i*.045)+'s"><title>'+esc(d.label)+': '+esc(fmt(d.value))+'</title></rect>';});
    } else {
      var total=values.reduce(function(a,b){return a+b;},0)||1, cx=w/2, cy=h/2-2, r=88, circ=2*Math.PI*r, offset=0;
      var colors=['#d4a853','#2dd4bf','#818cf8','#a78bfa','#f0c878','#4ade80','#fb7185','#60a5fa'];
      data.forEach(function(d,i){var dash=values[i]/total*circ; var col=colors[i%colors.length]; svg+='<circle class="pp-chart-donut" cx="'+cx+'" cy="'+cy+'" r="'+r+'" stroke="'+col+'" stroke-dasharray="'+dash+' '+circ+'" stroke-dashoffset="'+(-offset)+'" style="--offset:'+(-offset)+'px;--dash:'+(-offset-dash)+'px"><title>'+esc(d.label)+': '+esc(fmt(d.value))+'</title></circle>'; offset+=dash;});
      svg+='<text class="pp-chart-center" x="'+cx+'" y="'+(cy-2)+'">'+esc(fmt(total))+'</text><text class="pp-chart-axis" x="'+cx+'" y="'+(cy+17)+'" text-anchor="middle">Total</text>';
    }
    var xLabels='';
    if(type!=='pie') data.forEach(function(d,i){xLabels+='<text class="pp-chart-axis" x="'+x(i)+'" y="'+(h-15)+'" text-anchor="middle">'+esc(d.label)+'</text>';});
    stage.innerHTML='<svg viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none">'+(type==='pie'?'':grid)+' '+svg+xLabels+'</svg>';
    legend.innerHTML=data.map(function(d,i){return '<span><i class="pp-chart-dot" style="background:'+(type==='pie'?['#d4a853','#2dd4bf','#818cf8','#a78bfa','#f0c878','#4ade80','#fb7185','#60a5fa'][i%8]:'var(--gold)')+'"></i>'+esc(d.label)+'</span>';}).join('');
  }

  function showChart(key, title, desc, data, anchor, format) {
    chartState[key] = {data:data, format:format};
    chartPanel(key,title,desc,anchor);
    renderChart(key,'line');
  }

  function calculateSIP() {
    var monthly=num('sip-amount'), annual=num('sip-rate'), years=num('sip-years');
    if (!(monthly>0) || !(years>0) || !valid(annual)) return;
    var stepAmount=optional('sip-stepup-amount'), stepPercent=optional('sip-stepup-percent');
    var mr=annual/12/100, regularBalance=0, balance=0, invested=0, regularInvested=0, regularRows=[], stepRows=[], current=monthly;
    for(var y=1;y<=Math.floor(years);y++){
      var annualContribution=0, regularAnnual=0;
      for(var m=0;m<12;m++){regularInvested+=monthly;regularAnnual+=monthly;regularBalance=regularBalance*(1+mr)+monthly;invested+=current;annualContribution+=current;balance=balance*(1+mr)+current;}
      regularRows.push({year:y,monthly:monthly,annual:regularAnnual,invested:regularInvested,value:regularBalance});
      stepRows.push({year:y,monthly:current,annual:annualContribution,invested:invested,value:balance});
      if(stepPercent>0) current*=1+stepPercent/100; else if(stepAmount>0) current+=stepAmount;
    }
    var hasStep=stepAmount>0||stepPercent>0;
    text('sip-invested',inr(regularInvested)); text('sip-returns',inr(regularBalance-regularInvested)); text('sip-maturity',inr(regularBalance));
    text('sip-stepup-invested',hasStep?inr(invested):'—'); text('sip-stepup-returns',hasStep?inr(balance-invested):'—'); text('sip-stepup-maturity',hasStep?inr(balance):'—'); text('sip-stepup-extra',hasStep?inr(balance-regularBalance):'—');
    var tbody=el('sip-progression-tbody'); if(tbody){tbody.innerHTML='';(hasStep?stepRows:regularRows).forEach(function(r,i){var impact=hasStep?r.value-regularRows[i].value:null;var tr=tbody.insertRow();[r.year,inr(r.monthly),inr(r.annual),inr(r.invested),inr(r.value),inr(r.value-r.invested),hasStep?inr(impact):'—'].forEach(function(v){var td=tr.insertCell();td.textContent=v;});});}
    var wrap=el('sip-progression-tbody') ? el('sip-progression-tbody').closest('.calc-card, .wrap') : null;
    var anchor=wrap && wrap.parentElement ? wrap.parentElement : document.querySelector('.wrap');
    showChart('sip','SIP Growth & Wealth Journey','Switch between line, bar and pie views to explore your investment progression.',(hasStep?stepRows:regularRows).map(function(r){return {label:'Y'+r.year,value:r.value};}),anchor,function(v){return inr(v);});
  }

  function loanSchedule(principal,annual,years,extraAnnual){
    var months=Math.max(1,Math.round(years*12)),mr=annual/12/100;
    var emi=mr===0?principal/months:principal*mr*Math.pow(1+mr,months)/(Math.pow(1+mr,months)-1);
    function run(extra){var balance=principal,interest=0,rows=[],paid=0;for(var y=1;y<=Math.ceil(years)&&balance>0;y++){var begin=balance,principalPaid=0,interestPaid=0,extraPaid=0;for(var m=0;m<12&&balance>0;m++){var ip=balance*mr,sp=mr===0?Math.min(emi,balance):Math.min(emi-ip,balance);if(sp<0)sp=0;balance=Math.max(0,balance-sp);interest+=ip;principalPaid+=sp;interestPaid+=ip;paid++;if(extra>0&&m===11&&balance>0){extraPaid=Math.min(extra,balance);balance-=extraPaid;}}rows.push({year:y,begin:begin,principal:principalPaid,extra:extraPaid,interest:interestPaid,end:balance,reduction:begin-balance});}return {rows:rows,interest:interest,months:paid,balance:balance};}
    var regular=run(0),accelerated=extraAnnual>0?run(extraAnnual):null;return {emi:emi,regular:regular,accelerated:accelerated};
  }

  function calculateLoan(){
    var principal=num('loan-amount'),annual=num('loan-rate'),years=num('loan-years'),extra=optional('loan-extra-principal');if(!(principal>0)||!(years>0)||!valid(annual))return;
    var r=loanSchedule(principal,annual,years,extra);text('loan-emi',inr(r.emi));text('loan-interest',inr(r.regular.interest));text('loan-total',inr(principal+r.regular.interest));
    var tbody=el('loan-amortization-tbody');if(tbody){tbody.innerHTML='';(r.accelerated||r.regular).rows.forEach(function(row){var tr=tbody.insertRow();[row.year,inr(row.begin),inr(row.principal),inr(row.extra),inr(row.interest),inr(row.end),inr(row.reduction)].forEach(function(v){var td=tr.insertCell();td.textContent=v;});});}
    if(r.accelerated){var saved=Math.max(0,r.regular.interest-r.accelerated.interest),reduced=Math.max(0,r.regular.months-r.accelerated.months);text('loan-tenure-reduction',Math.floor(reduced/12)+' years '+(reduced%12)+' months');text('loan-interest-saved',inr(saved));text('loan-new-tenure',Math.floor(r.accelerated.months/12)+' years '+(r.accelerated.months%12)+' months');}else{text('loan-tenure-reduction','—');text('loan-interest-saved','—');text('loan-new-tenure','—');}
    var anchor=el('loan-chart') ? el('loan-chart').parentElement : document.querySelector('.wrap');
    showChart('loan','Loan Balance Journey','Track how the outstanding balance falls year by year.',(r.accelerated||r.regular).rows.map(function(row){return {label:'Y'+row.year,value:row.end};}),anchor,function(v){return inr(v);});
  }

  function setRatio(prefix,value,kind){text('ratio-'+prefix+'-value',kind==='pct'?pct(value):ratio(value));var s=el('ratio-'+prefix+'-status');if(s){s.textContent='';s.className='ratio-status';s.style.display='none';}}
  function calculateRatios(){
    var ca=num('ratio-current-assets'),inv=num('ratio-inventory'),cl=num('ratio-current-liab'),debt=num('ratio-total-debt'),eq=num('ratio-equity'),assets=num('ratio-total-assets'),rev=num('ratio-revenue'),gross=num('ratio-gross-profit'),net=num('ratio-net-income');
    if(!(ca>0)||!(cl>0)||!(assets>0)||!(rev>0)||!(eq>0)){alert('Please enter positive values for Current Assets, Current Liabilities, Total Assets, Revenue and Equity.');return;}
    setRatio('current',ca/cl);setRatio('quick',(ca-inv)/cl);setRatio('debt-equity',debt/eq);setRatio('debt-assets',debt/assets);setRatio('equity-mult',assets/eq);setRatio('gross-margin',gross/rev*100,'pct');setRatio('net-margin',net/rev*100,'pct');setRatio('roa',net/assets*100,'pct');setRatio('roe',net/eq*100,'pct');setRatio('equity',eq/assets*100,'pct');setRatio('asset-turnover',rev/assets);setRatio('dupont',(net/rev)*(rev/assets)*(assets/eq),'pct');
    text('ratio-operating-margin-value','N/A');var op=el('ratio-operating-margin-status');if(op){op.textContent='Requires operating profit or overhead input';op.className='ratio-status';op.style.display='inline-block';}
    var feedback=el('ratio-feedback');if(feedback){var notes=[];notes.push('Current ratio: '+ratio(ca/cl)+'.');notes.push('Quick ratio: '+ratio((ca-inv)/cl)+'.');notes.push('Debt-to-equity: '+ratio(debt/eq)+'.');notes.push('Net profit margin: '+pct(net/rev*100)+'.');notes.push('ROA: '+pct(net/assets*100)+', ROE: '+pct(net/eq*100)+'.');feedback.innerHTML='<p>'+notes.join(' ')+'</p><p>These are calculated from the figures entered and are not a substitute for a full financial review.</p>';}
    var ratioData=[['Current Ratio',ca/cl],['Quick Ratio',(ca-inv)/cl],['Debt / Equity',debt/eq],['Debt / Assets',debt/assets],['Equity Multiplier',assets/eq],['Gross Margin',gross/rev*100],['Net Margin',net/rev*100],['ROA',net/assets*100],['ROE',net/eq*100]];
    var anchor=el('ratio-feedback') ? el('ratio-feedback').parentElement : document.querySelector('.wrap');
    showChart('ratios','Financial Ratio Overview','Compare the calculated ratios visually. Pie view shows their relative magnitudes, while line and bar views compare each metric.',ratioData.map(function(r){return {label:r[0],value:Math.max(0,r[1])};}),anchor,function(v){return Number(v).toFixed(2);});
  }

  function bind(id,fn){var b=el(id);if(b){b.addEventListener('click',function(e){e.preventDefault();try{fn();}catch(err){console.error('Financial tool error:',err);alert('Unable to calculate. Please check the entered values.');}});}}
  bind('sip-calc-btn',calculateSIP);bind('loan-calc-btn',calculateLoan);bind('ratios-calc-btn',calculateRatios);
  if(el('sip-calc-btn'))calculateSIP();
  if(el('loan-calc-btn'))calculateLoan();
  window.addEventListener('load',function(){ if(el('ratio-current-assets')&&el('ratio-current-assets').value) { /* ratios remain user-triggered */ } });
})();
