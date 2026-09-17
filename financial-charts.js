(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var chartState = {};

  function money(n) {
    if (!isFinite(n)) return '—';
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }
  function compact(n) {
    if (!isFinite(n)) return '—';
    var a = Math.abs(n);
    if (a >= 10000000) return '₹' + (n / 10000000).toFixed(1) + 'Cr';
    if (a >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
    if (a >= 1000) return '₹' + (n / 1000).toFixed(1) + 'K';
    return '₹' + Math.round(n);
  }
  function numText(s) {
    var n = parseFloat(String(s || '').replace(/[^0-9.-]/g, ''));
    return isFinite(n) ? n : 0;
  }
  function svgEl(name, attrs) {
    var e = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }
  function theme() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      text: dark ? '#f6f1e7' : '#302818',
      muted: dark ? '#a9a3b6' : '#777087',
      grid: dark ? 'rgba(255,255,255,.09)' : 'rgba(50,40,25,.10)',
      gold: '#c18a27',
      gold2: '#e0b65c',
      teal: '#2bb8a8',
      surface: dark ? '#11111a' : '#ffffff'
    };
  }

  function readTable(id) {
    var table = document.getElementById(id);
    if (!table) return [];
    return Array.prototype.slice.call(table.querySelectorAll('tbody tr')).map(function (tr) {
      return Array.prototype.slice.call(tr.children).map(function (td) { return td.textContent.trim(); });
    });
  }

  function makeStyles() {
    if (document.getElementById('financial-chart-upgrade-styles')) return;
    var s = document.createElement('style');
    s.id = 'financial-chart-upgrade-styles';
    s.textContent = `
      .pp-chart-shell{width:100%;max-width:1180px;margin:22px auto 0;box-sizing:border-box}
      .pp-chart-toolbar{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:14px}
      .pp-chart-tabs{display:inline-flex;gap:4px;padding:4px;border:1px solid var(--border);background:var(--card-bg);border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.06)}
      .pp-chart-tab{border:0;background:transparent;color:var(--text-muted);padding:8px 16px;border-radius:999px;font:600 .78rem 'DM Sans',sans-serif;cursor:pointer;transition:transform .2s,background .25s,color .25s,box-shadow .25s}
      .pp-chart-tab:hover{transform:translateY(-1px);color:var(--text-primary)}
      .pp-chart-tab.active{background:var(--gold);color:var(--bg);box-shadow:0 6px 18px rgba(193,138,39,.25)}
      .pp-chart-kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:14px}
      .pp-chart-kpi{padding:12px 15px;border:1px solid var(--border);border-radius:12px;background:var(--card-soft);min-width:0}
      .pp-chart-kpi-label{font:600 .68rem 'DM Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted)}
      .pp-chart-kpi-value{margin-top:4px;font:700 1.08rem 'Lora',Georgia,serif;color:var(--gold);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .pp-chart-stage{position:relative;width:100%;height:420px;min-height:360px;border:1px solid var(--border);border-radius:16px;background:var(--bg-3);overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)}
      .pp-chart-svg{display:block;width:100%;height:100%;overflow:visible}
      .pp-chart-tooltip{position:absolute;z-index:5;pointer-events:none;opacity:0;transform:translate(-50%,-110%);padding:10px 12px;border:1px solid var(--gold);border-radius:10px;background:var(--card-bg);box-shadow:0 12px 35px rgba(0,0,0,.18);color:var(--text-primary);font:600 .78rem 'DM Sans',sans-serif;white-space:nowrap;transition:opacity .12s ease,transform .12s ease}
      .pp-chart-tooltip.show{opacity:1;transform:translate(-50%,-125%)}
      .pp-chart-empty{height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-weight:600}
      .pp-chart-legend{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin-top:12px;color:var(--text-muted);font-size:.76rem}
      .pp-chart-legend span{display:inline-flex;align-items:center;gap:7px}.pp-chart-dot{width:9px;height:9px;border-radius:50%;background:var(--gold);display:inline-block}.pp-chart-dot.teal{background:var(--teal)}
      @keyframes ppDraw{from{stroke-dashoffset:var(--dash)}to{stroke-dashoffset:0}}
      @keyframes ppRise{from{transform:scaleY(0);transform-origin:bottom}to{transform:scaleY(1);transform-origin:bottom}}
      @keyframes ppFade{from{opacity:0;transform:scale(.86)}to{opacity:1;transform:scale(1)}}
      .pp-line{animation:ppDraw 1.25s cubic-bezier(.2,.7,.2,1) forwards}.pp-bar{animation:ppRise .8s cubic-bezier(.2,.8,.2,1) both}.pp-pie{animation:ppFade .8s ease both}
      @media(max-width:700px){.pp-chart-kpis{grid-template-columns:1fr}.pp-chart-stage{height:360px;min-height:320px}.pp-chart-tab{padding:7px 12px}.pp-chart-toolbar{align-items:flex-start}.pp-chart-tabs{width:100%;justify-content:space-between}.pp-chart-tab{flex:1}}
    `;
    document.head.appendChild(s);
  }

  function ensureShell(container, kind) {
    if (container.dataset.ppChartReady) return container.querySelector('.pp-chart-shell');
    container.dataset.ppChartReady = '1';
    container.innerHTML = '';
    var shell = document.createElement('div'); shell.className = 'pp-chart-shell';
    var toolbar = document.createElement('div'); toolbar.className = 'pp-chart-toolbar';
    var tabs = document.createElement('div'); tabs.className = 'pp-chart-tabs';
    ['Line','Bar','Pie'].forEach(function (type) {
      var b=document.createElement('button'); b.type='button'; b.className='pp-chart-tab'; b.dataset.type=type.toLowerCase(); b.textContent=type;
      b.addEventListener('click',function(){ chartState[container.id].type=this.dataset.type; render(container,kind); }); tabs.appendChild(b);
    });
    toolbar.appendChild(tabs); shell.appendChild(toolbar);
    var kpis=document.createElement('div'); kpis.className='pp-chart-kpis'; kpis.dataset.kpis=''; shell.appendChild(kpis);
    var stage=document.createElement('div'); stage.className='pp-chart-stage'; stage.dataset.stage=''; shell.appendChild(stage);
    var legend=document.createElement('div'); legend.className='pp-chart-legend'; legend.dataset.legend=''; shell.appendChild(legend);
    container.appendChild(shell); chartState[container.id]={type:'line'}; return shell;
  }

  function setKpis(shell, items) {
    var k=shell.querySelector('[data-kpis]'); k.innerHTML='';
    items.forEach(function(it){var d=document.createElement('div');d.className='pp-chart-kpi';d.innerHTML='<div class="pp-chart-kpi-label">'+it[0]+'</div><div class="pp-chart-kpi-value">'+it[1]+'</div>';k.appendChild(d);});
  }
  function axis(stage, labels, max, colors) {
    var w=stage.clientWidth||900,h=stage.clientHeight||420,p={l:78,r:28,t:30,b:52};
    var plotW=w-p.l-p.r,plotH=h-p.t-p.b;
    var svg=svgEl('svg',{class:'pp-chart-svg',viewBox:'0 0 '+w+' '+h,preserveAspectRatio:'none'});
    var th=theme();
    for(var i=0;i<=4;i++){var y=p.t+plotH-(plotH*i/4);svg.appendChild(svgEl('line',{x1:p.l,y1:y,x2:w-p.r,y2:y,stroke:th.grid,'stroke-width':1}));var tx=svgEl('text',{x:p.l-12,y:y+4,'text-anchor':'end',fill:th.muted,'font-size':11,'font-family':'DM Sans, sans-serif'});tx.textContent=compact(max*i/4);svg.appendChild(tx);}
    labels.forEach(function(label,i){var x=p.l+(labels.length===1?plotW/2:plotW*i/(labels.length-1));var tx=svgEl('text',{x:x,y:h-18,'text-anchor':'middle',fill:th.muted,'font-size':11,'font-family':'DM Sans, sans-serif'});tx.textContent=label;svg.appendChild(tx);});
    return {svg:svg,w:w,h:h,p:p,plotW:plotW,plotH:plotH,th:th};
  }

  function lineChart(stage, labels, series) {
    stage.innerHTML=''; var max=1;series.forEach(function(s){s.values.forEach(function(v){if(v>max)max=v;});});
    var a=axis(stage,labels,max,series.map(function(s){return s.color;}));stage.appendChild(a.svg);
    var tip=document.createElement('div');tip.className='pp-chart-tooltip';stage.appendChild(tip);
    series.forEach(function(s,si){var pts=s.values.map(function(v,i){return [a.p.l+(labels.length===1?a.plotW/2:a.plotW*i/(labels.length-1)),a.p.t+a.plotH-(v/max*a.plotH)];});var d=pts.map(function(p,i){return (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' ');var path=svgEl('path',{d:d,fill:'none',stroke:s.color,'stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round',class:'pp-line'});var len=Math.max(1,path.getTotalLength());path.style.setProperty('--dash',len);path.style.strokeDasharray=len;path.style.strokeDashoffset=len;a.svg.appendChild(path);pts.forEach(function(p,i){var c=svgEl('circle',{cx:p[0],cy:p[1],r:5,fill:theme().surface,stroke:s.color,'stroke-width':3,cursor:'pointer'});c.addEventListener('mouseenter',function(){tip.innerHTML='<strong>'+labels[i]+'</strong><br>'+s.label+': '+money(s.values[i]);tip.style.left=(p[0]/a.w*100)+'%';tip.style.top=(p[1]/a.h*100)+'%';tip.classList.add('show');});c.addEventListener('mouseleave',function(){tip.classList.remove('show');});a.svg.appendChild(c);});});
  }

  function barChart(stage, labels, series) {
    stage.innerHTML='';var max=1;series.forEach(function(s){s.values.forEach(function(v){if(v>max)max=v;});});var a=axis(stage,labels,max,series.map(function(s){return s.color;}));stage.appendChild(a.svg);var tip=document.createElement('div');tip.className='pp-chart-tooltip';stage.appendChild(tip);var groupW=a.plotW/labels.length,barW=Math.min(42,(groupW-18)/series.length);
    labels.forEach(function(label,i){series.forEach(function(s,si){var v=s.values[i]||0,h=Math.max(2,v/max*a.plotH),x=a.p.l+i*groupW+groupW/2+(si-(series.length-1)/2)*(barW+5)-barW/2,y=a.p.t+a.plotH-h;var r=svgEl('rect',{x:x,y:y,width:barW,height:h,rx:7,fill:s.color,class:'pp-bar',cursor:'pointer',opacity:.92});r.addEventListener('mouseenter',function(){tip.innerHTML='<strong>'+label+'</strong><br>'+s.label+': '+money(v);tip.style.left=((x+barW/2)/a.w*100)+'%';tip.style.top=(y/a.h*100)+'%';tip.classList.add('show');});r.addEventListener('mouseleave',function(){tip.classList.remove('show');});a.svg.appendChild(r);});});
  }

  function pieChart(stage, items) {
    stage.innerHTML='';var th=theme(),w=stage.clientWidth||900,h=stage.clientHeight||420,cx=w/2,cy=h/2-5,r=Math.min(w*.26,h*.34),sum=items.reduce(function(a,x){return a+x.value;},0)||1;var svg=svgEl('svg',{class:'pp-chart-svg',viewBox:'0 0 '+w+' '+h});var tip=document.createElement('div');tip.className='pp-chart-tooltip';stage.appendChild(tip);var start=-Math.PI/2;
    items.forEach(function(it){var angle=it.value/sum*Math.PI*2,end=start+angle,large=angle>Math.PI;var x1=cx+r*Math.cos(start),y1=cy+r*Math.sin(start),x2=cx+r*Math.cos(end),y2=cy+r*Math.sin(end);var d='M '+cx+' '+cy+' L '+x1+' '+y1+' A '+r+' '+r+' 0 '+(large?1:0)+' 1 '+x2+' '+y2+' Z';var p=svgEl('path',{d:d,fill:it.color,stroke:th.surface,'stroke-width':3,class:'pp-pie',cursor:'pointer'});p.addEventListener('mouseenter',function(e){tip.innerHTML='<strong>'+it.label+'</strong><br>'+money(it.value)+' · '+(it.value/sum*100).toFixed(1)+'%';tip.style.left=((e.offsetX||cx)/w*100)+'%';tip.style.top=((e.offsetY||cy)/h*100)+'%';tip.classList.add('show');});p.addEventListener('mouseleave',function(){tip.classList.remove('show');});svg.appendChild(p);start=end;});var hole=svgEl('circle',{cx:cx,cy:cy,r:r*.52,fill:th.surface});svg.appendChild(hole);var t=svgEl('text',{x:cx,y:cy-4,'text-anchor':'middle',fill:th.text,'font-size':14,'font-weight':700,'font-family':'DM Sans, sans-serif'});t.textContent='Total';svg.appendChild(t);var tv=svgEl('text',{x:cx,y:cy+20,'text-anchor':'middle',fill:th.gold,'font-size':18,'font-weight':700,'font-family':'Lora, Georgia, serif'});tv.textContent=compact(sum);svg.appendChild(tv);stage.appendChild(svg);
  }

  function render(container,kind) {
    var shell=ensureShell(container,kind),state=chartState[container.id];shell.querySelectorAll('.pp-chart-tab').forEach(function(b){b.classList.toggle('active',b.dataset.type===state.type);});
    var stage=shell.querySelector('[data-stage]'),tableId=kind==='sip'?'sip-progression-table':'loan-amortization-table',rows=readTable(tableId);
    if(!rows.length){stage.innerHTML='<div class="pp-chart-empty">Calculate to generate your chart.</div>';return;}
    var labels=rows.map(function(r){return 'Y'+r[0];});
    if(kind==='sip'){
      var invested=rows.map(function(r){return numText(r[3]);}),value=rows.map(function(r){return numText(r[4]);}),returns=rows.map(function(r){return numText(r[5]);});
      setKpis(shell,[['Total Invested',money(invested[invested.length-1])],['Estimated Returns',money(returns[returns.length-1])],['Maturity Value',money(value[value.length-1])]]);
      if(state.type==='pie') pieChart(stage,[{label:'Invested',value:invested[invested.length-1],color:theme().gold},{label:'Returns',value:Math.max(0,returns[returns.length-1]),color:theme().teal}]);
      else if(state.type==='bar') barChart(stage,labels,[{label:'Invested',values:invested,color:theme().gold},{label:'Value',values:value,color:theme().teal}]);
      else lineChart(stage,labels,[{label:'Invested',values:invested,color:theme().gold},{label:'Accumulated Value',values:value,color:theme().teal}]);
    } else {
      var principal=rows.map(function(r){return numText(r[2]);}),interest=rows.map(function(r){return numText(r[4]);}),balance=rows.map(function(r){return numText(r[5]);});
      var p=principal.reduce(function(a,v){return a+v;},0),i=interest.reduce(function(a,v){return a+v;},0),total=p+i;
      setKpis(shell,[['Principal',money(p)],['Interest',money(i)],['Total Payment',money(total)]]);
      if(state.type==='pie') pieChart(stage,[{label:'Principal',value:p,color:theme().gold},{label:'Interest',value:i,color:theme().teal}]);
      else if(state.type==='bar') barChart(stage,labels,[{label:'Principal',values:principal,color:theme().gold},{label:'Interest',values:interest,color:theme().teal}]);
      else lineChart(stage,labels,[{label:'Remaining Balance',values:balance,color:theme().gold},{label:'Principal Paid',values:principal,color:theme().teal}]);
    }
  }

  function boot() {
    makeStyles();
    [['sip-chart','sip'],['loan-chart','loan']].forEach(function(pair){var c=document.getElementById(pair[0]);if(c)render(c,pair[1]);});

    // IMPORTANT: never observe the whole document. Chart rendering itself changes
    // the chart DOM, so a body-wide MutationObserver creates an infinite
    // render -> mutation -> render loop whenever a calculator button is clicked.
    [['sip-progression-table','sip'],['loan-amortization-table','loan']].forEach(function(pair){
      var table=document.getElementById(pair[0]);
      if(!table) return;
      var tbody=table.querySelector('tbody');
      if(!tbody) return;
      new MutationObserver(function(){
        var c=document.getElementById(pair[0]==='sip-progression-table'?'sip-chart':'loan-chart');
        if(c&&c.dataset.ppChartReady) render(c,pair[1]);
      }).observe(tbody,{childList:true});
    });

    window.addEventListener('resize',function(){[['sip-chart','sip'],['loan-chart','loan']].forEach(function(pair){var c=document.getElementById(pair[0]);if(c&&c.dataset.ppChartReady)render(c,pair[1]);});});
    new MutationObserver(function(){[['sip-chart','sip'],['loan-chart','loan']].forEach(function(pair){var c=document.getElementById(pair[0]);if(c&&c.dataset.ppChartReady)render(c,pair[1]);});}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
