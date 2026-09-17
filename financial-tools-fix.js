/* Financial tools reliability + premium chart layer. */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function num(id) { var x = el(id); return x ? Number(x.value) : 0; }
  function optional(id) { var x = el(id); if (!x || String(x.value).trim() === '') return 0; var n = Number(x.value); return isFinite(n) ? n : 0; }
  function text(id, value) { var x = el(id); if (x) x.textContent = value; }
  function inr(n) { return isFinite(n) ? '₹' + Math.round(n).toLocaleString('en-IN') : '—'; }
  function pct(n) { return isFinite(n) ? n.toFixed(2) + '%' : '—'; }
  function ratio(n) { return isFinite(n) ? n.toFixed(2) + 'x' : '—'; }
  function valid(n) { return isFinite(n) && n >= 0; }

  var chartState = { sip: null, loan: null, ratios: null };

  function styles() {
    if (el('financial-chart-styles')) return;
    var s = document.createElement('style'); s.id = 'financial-chart-styles';
    s.textContent = `
      .pp-fin-chart{margin-top:30px;background:var(--card-bg,var(--card));border:1px solid var(--border,var(--bdr));border-radius:20px;padding:26px;overflow:visible;box-shadow:0 16px 45px rgba(30,24,12,.08)}
      .pp-fin-chart__head{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:18px;flex-wrap:wrap}
      .pp-fin-chart__title{font-family:'Lora',Georgia,serif;color:var(--text-primary,var(--th));font-size:1.35rem;font-weight:700;margin:0 0 5px}
      .pp-fin-chart__desc{color:var(--text-muted,var(--tm));font-size:.9rem;margin:0;line-height:1.55}
      .pp-fin-chart__tabs{display:flex;gap:4px;padding:4px;border:1px solid var(--border,var(--bdr));border-radius:999px;background:var(--bg-2,var(--bg2));flex-shrink:0}
      .pp-fin-chart__tab{border:0;border-radius:999px;padding:8px 15px;background:transparent;color:var(--text-body,var(--tb));font:600 .78rem 'DM Sans',sans-serif;cursor:pointer;transition:transform .2s,background .25s,color .25s,box-shadow .25s}
      .pp-fin-chart__tab:hover{color:var(--gold);transform:translateY(-1px)}
      .pp-fin-chart__tab.active{background:var(--gold);color:var(--bg,#080810);box-shadow:0 6px 18px rgba(193,138,39,.25)}
      .pp-fin-chart__stage{height:390px;min-height:320px;position:relative;border:1px solid var(--border,var(--bdr));border-radius:16px;background:linear-gradient(180deg,rgba(212,168,83,.055),transparent 72%);overflow:visible}
      .pp-fin-chart__stage svg{display:block;width:100%;height:100%;overflow:visible}
      .pp-fin-tooltip{position:absolute;z-index:20;pointer-events:none;opacity:0;transform:translate(-50%,-115%) scale(.96);padding:10px 13px;border:1px solid var(--gold);border-radius:11px;background:var(--card-bg,#fff);color:var(--text-primary,#222);box-shadow:0 14px 36px rgba(0,0,0,.18);font:600 .78rem/1.45 'DM Sans',sans-serif;white-space:nowrap;transition:opacity .12s ease,transform .12s ease}
      .pp-fin-tooltip.show{opacity:1;transform:translate(-50%,-125%) scale(1)}
      .pp-fin-tooltip strong{font-weight:700;color:var(--gold)}
      .pp-chart-grid{stroke:var(--border,var(--bdr));stroke-width:1;opacity:.72}
      .pp-chart-axis{fill:var(--text-muted,var(--tm));font:11px 'DM Sans',sans-serif}
      .pp-chart-line{fill:none;stroke:var(--gold);stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 4px 9px rgba(193,138,39,.22));stroke-dasharray:1000;stroke-dashoffset:1000;animation:ppLineDraw 1.15s cubic-bezier(.2,.75,.25,1) forwards}
      .pp-chart-area{fill:var(--gold);opacity:.08}
      .pp-chart-point{fill:var(--card-bg,var(--card));stroke:var(--gold);stroke-width:2.5;cursor:pointer;transition:r .15s,stroke-width .15s}
      .pp-chart-point:hover{stroke-width:4}
      .pp-chart-bar{fill:var(--gold);opacity:.9;cursor:pointer;transform-box:fill-box;transform-origin:center bottom;animation:ppBarIn .7s cubic-bezier(.2,.8,.2,1) both}
      .pp-chart-bar:hover{opacity:1;filter:drop-shadow(0 6px 12px rgba(193,138,39,.28))}
      .pp-chart-pie{cursor:pointer;transition:transform .18s,filter .18s;animation:ppPieIn .7s cubic-bezier(.2,.8,.2,1) both}
      .pp-chart-pie:hover{filter:brightness(1.08)}
      .pp-chart-center{fill:var(--text-primary,var(--th));font:700 18px 'DM Sans',sans-serif;text-anchor:middle}
      .pp-chart-center-sub{fill:var(--text-muted,var(--tm));font:12px 'DM Sans',sans-serif;text-anchor:middle}
      .pp-chart-legend{display:flex;gap:14px 18px;flex-wrap:wrap;margin-top:14px;color:var(--text-body,var(--tb));font-size:.78rem}
      .pp-chart-legend span{display:inline-flex;align-items:center;gap:7px}.pp-chart-dot{width:9px;height:9px;border-radius:50%;display:inline-block}
      @keyframes ppLineDraw{to{stroke-dashoffset:0}} @keyframes ppBarIn{from{opacity:0;transform:scaleY(0)}to{opacity:.9;transform:scaleY(1)}} @keyframes ppPieIn{from{opacity:0;transform:scale(.86)}to{opacity:1;transform:scale(1)}}
      @media(max-width:760px){.pp-fin-chart{padding:19px 14px}.pp-fin-chart__stage{height:330px;min-height:290px}.pp-fin-chart__tabs{width:100%;justify-content:space-between}.pp-fin-chart__tab{flex:1;padding:8px 7px}}
    `;
    document.head.appendChild(s);
  }

  function esc(v) { return String(v).replace(/[&<>\"]/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];}); }
  function svgEl(name, attrs) { var e=document.createElementNS('http://www.w3.org/2000/svg',name); Object.keys(attrs||{}).forEach(function(k){e.setAttribute(k,attrs[k]);}); return e; }

  function chartPanel(key,title,desc){
    styles(); var id='pp-fin-chart-'+key, panel=el(id); if(panel) return panel;
    panel=document.createElement('section'); panel.id=id; panel.className='pp-fin-chart';
    panel.innerHTML='<div class="pp-fin-chart__head"><div><h3 class="pp-fin-chart__title">'+esc(title)+'</h3><p class="pp-fin-chart__desc">'+esc(desc)+'</p></div><div class="pp-fin-chart__tabs" role="tablist"><button type="button" class="pp-fin-chart__tab active" data-chart="line">Line</button><button type="button" class="pp-fin-chart__tab" data-chart="bar">Bar</button><button type="button" class="pp-fin-chart__tab" data-chart="pie">Pie</button></div></div><div class="pp-fin-chart__stage"></div><div class="pp-chart-legend"></div>';
    (document.querySelector('.wrap')||document.body).appendChild(panel);
    panel.querySelectorAll('.pp-fin-chart__tab').forEach(function(btn){btn.addEventListener('click',function(){panel.querySelectorAll('.pp-fin-chart__tab').forEach(function(b){b.classList.remove('active');});btn.classList.add('active');renderChart(key,btn.getAttribute('data-chart'));});});
    return panel;
  }

  function renderChart(key,type){
    var state=chartState[key]; if(!state||!state.data||!state.data.length)return; var panel=el('pp-fin-chart-'+key); if(!panel)return;
    var stage=panel.querySelector('.pp-fin-chart__stage'),legend=panel.querySelector('.pp-chart-legend'); stage.innerHTML=''; legend.innerHTML='';
    var data=state.data,isRatio=key==='ratios',w=Math.max(640,stage.clientWidth||920),h=Math.max(300,stage.clientHeight||390);
    var series=state.series&&state.series.length?state.series:[{key:'value',label:'Value'}];
    var pad=isRatio&&type==='bar'?{l:150,r:42,t:30,b:28}:{l:82,r:28,t:30,b:54};
    var values=[];data.forEach(function(d){series.forEach(function(sr){var v=Number(d.values?d.values[sr.key]:d.value);if(isFinite(v))values.push(v);});});
    var max=Math.max.apply(null,values.concat([1])),min=Math.min.apply(null,values.concat([0]));
    if(min>0)min=0;if(max===min)max=min+1;
    var fmt=state.format||function(v){return inr(v);};
    var colors=state.colors,svg=svgEl('svg',{viewBox:'0 0 '+w+' '+h,preserveAspectRatio:'none'}),tip=document.createElement('div');tip.className='pp-fin-tooltip';stage.appendChild(tip);
    function val(d,sr){var v=Number(d.values?d.values[sr.key]:d.value);return isFinite(v)?v:0;}
    function tipShow(x,y,title,rows){var html='<strong>'+esc(title)+'</strong>';rows.forEach(function(r){html+='<br><span style="color:'+r.color+'">●</span> '+esc(r.label)+': '+esc(r.value);});tip.innerHTML=html;tip.style.left=Math.max(12,Math.min((stage.clientWidth||w)-12,x))+'px';tip.style.top=Math.max(42,Math.min((stage.clientHeight||h)-12,y))+'px';tip.classList.add('show');}
    function tipHide(){tip.classList.remove('show');}
    function grid(){for(var g=0;g<=4;g++){var gv=min+(max-min)*g/4,gy=pad.t+(h-pad.t-pad.b)*(1-(gv-min)/(max-min||1));svg.appendChild(svgEl('line',{class:'pp-chart-grid',x1:pad.l,x2:w-pad.r,y1:gy,y2:gy}));var tx=svgEl('text',{class:'pp-chart-axis',x:pad.l-10,y:gy+4,'text-anchor':'end'});tx.textContent=fmt(gv);svg.appendChild(tx);}}
    if(type==='line'){
      grid(); var pw=w-pad.l-pad.r,ph=h-pad.t-pad.b;
      series.forEach(function(sr,si){
        var pts=data.map(function(d,i){var v=val(d,sr);return{x:pad.l+(data.length===1?pw/2:i*pw/(data.length-1)),y:pad.t+ph-((v-min)/(max-min||1))*ph};});
        var path=svgEl('path',{class:'pp-chart-line pp-chart-line-'+si,d:pts.map(function(pt,i){return(i?'L':'M')+pt.x.toFixed(1)+' '+pt.y.toFixed(1);}).join(' ')});path.style.stroke=colors[si%colors.length];svg.appendChild(path);
        pts.forEach(function(pt,i){var c=svgEl('circle',{class:'pp-chart-point',cx:pt.x,cy:pt.y,r:5});c.style.stroke=colors[si%colors.length];c.addEventListener('mouseenter',function(){tipShow(pt.x,pt.y,data[i].label,series.map(function(s2,sj){return{label:s2.label,value:fmt(val(data[i],s2)),color:colors[sj%colors.length]};}));});c.addEventListener('mouseleave',tipHide);svg.appendChild(c);});
      });
      data.forEach(function(d,i){var x=pad.l+(data.length===1?pw/2:i*pw/(data.length-1)),tx=svgEl('text',{class:'pp-chart-axis',x:x,y:h-16,'text-anchor':'middle'});tx.textContent=d.label;svg.appendChild(tx);});
    }else if(type==='bar'){
      var horizontal=isRatio&&data.length>=7;
      if(horizontal){var left=pad.l,top=pad.t,plotW=w-pad.l-pad.r,rowH=(h-pad.t-pad.b)/data.length;data.forEach(function(d,i){var y=top+i*rowH+rowH*.18,bh=rowH*.64,slot=bh/Math.max(1,series.length);series.forEach(function(sr,si){var bw=val(d,sr)/(max||1)*plotW,yy=y+si*slot;if(si===0){var label=svgEl('text',{class:'pp-chart-axis',x:left-12,y:y+bh*.68,'text-anchor':'end'});label.textContent=d.label;svg.appendChild(label);}var r=svgEl('rect',{class:'pp-chart-bar',x:left,y:yy,width:Math.max(2,bw),height:Math.max(3,slot-4),rx:6});r.style.fill=colors[si%colors.length];r.style.animationDelay=(i*.045+si*.06)+'s';r.addEventListener('mouseenter',function(){tipShow(Math.min(left+bw,(stage.clientWidth||w)-20),yy,d.label,series.map(function(s2,sj){return{label:s2.label,value:fmt(val(d,s2)),color:colors[sj%colors.length]};}));});r.addEventListener('mouseleave',tipHide);svg.appendChild(r);});});}
      else{grid();var pw2=w-pad.l-pad.r,ph2=h-pad.t-pad.b,groupW=pw2/data.length,slotW=groupW/Math.max(1,series.length),bw2=Math.min(54,slotW*.68);data.forEach(function(d,i){series.forEach(function(sr,si){var v=Math.max(0,val(d,sr)),bh=ph2*(v/max),x=pad.l+i*groupW+si*slotW+(slotW-bw2)/2,y=h-pad.b-bh,r2=svgEl('rect',{class:'pp-chart-bar',x:x,y:y,width:bw2,height:Math.max(2,bh),rx:8});r2.style.fill=colors[si%colors.length];r2.style.animationDelay=(i*.045+si*.06)+'s';r2.addEventListener('mouseenter',function(){tipShow(x+bw2/2,y,d.label,series.map(function(s2,sj){return{label:s2.label,value:fmt(val(d,s2)),color:colors[sj%colors.length]};}));});r2.addEventListener('mouseleave',tipHide);svg.appendChild(r2);});var tx=svgEl('text',{class:'pp-chart-axis',x:pad.l+i*groupW+groupW/2,y:h-16,'text-anchor':'middle'});tx.textContent=d.label;svg.appendChild(tx);});}
    }else{
      var last=data[data.length-1],pieSeries=series.length>1?series.slice(0,8):series,totalBySeries=pieSeries.map(function(sr){return Math.max(0,val(last,sr));}),total=totalBySeries.reduce(function(a,b){return a+b;},0)||1,cx=w/2,cy=h/2,r=Math.min(110,(h-40)/2),circ=2*Math.PI*r,offset=0;
      pieSeries.forEach(function(sr,i){var dash=totalBySeries[i]/total*circ,c=svgEl('circle',{class:'pp-chart-pie',cx:cx,cy:cy,r:r,fill:'none',stroke:colors[i%colors.length],'stroke-width':40,'stroke-dasharray':dash+' '+circ,'stroke-dashoffset':-offset});c.style.transformOrigin=cx+'px '+cy+'px';c.style.animationDelay=(i*.05)+'s';c.addEventListener('mouseenter',function(){tipShow(cx,cy-r,sr.label,[{label:sr.label,value:fmt(totalBySeries[i]),color:colors[i%colors.length]}]);});c.addEventListener('mouseleave',tipHide);svg.appendChild(c);offset+=dash;});
      svg.appendChild(svgEl('circle',{cx:cx,cy:cy,r:r-22,fill:'var(--card-bg,var(--card))'}));var tv=svgEl('text',{class:'pp-chart-center',x:cx,y:cy-2});tv.textContent=fmt(total);svg.appendChild(tv);var ts=svgEl('text',{class:'pp-chart-center-sub',x:cx,y:cy+18});ts.textContent='Final';svg.appendChild(ts);
    }
    stage.appendChild(svg); series.forEach(function(sr,i){var dot=document.createElement('span');dot.innerHTML='<i class="pp-chart-dot" style="background:'+colors[i%colors.length]+'"></i>'+esc(sr.label);legend.appendChild(dot);});
  }

  function showChart(key,title,desc,data,format,series){chartState[key]={data:data,format:format,series:series||[{key:'value',label:'Value'}],colors:['#c18a27','#2bb8a8','#7f8ce8','#a88cf2','#e6bf69','#49cf78','#ee6f7f','#5d9bf0']};var panel=chartPanel(key,title,desc);renderChart(key,panel.querySelector('.pp-fin-chart__tab.active').getAttribute('data-chart'));}

  function calculateSIP(){
    var monthly=num('sip-amount'),annual=num('sip-rate'),years=num('sip-years');if(!(monthly>0)||!(years>0)||!valid(annual))return;
    var stepAmount=optional('sip-stepup-amount'),stepPercent=optional('sip-stepup-percent'),mr=annual/12/100,regularBalance=0,balance=0,invested=0,regularInvested=0,regularRows=[],stepRows=[],current=monthly;
    for(var y=1;y<=Math.floor(years);y++){var annualContribution=0,regularAnnual=0;for(var m=0;m<12;m++){regularInvested+=monthly;regularAnnual+=monthly;regularBalance=regularBalance*(1+mr)+monthly;invested+=current;annualContribution+=current;balance=balance*(1+mr)+current;}regularRows.push({year:y,monthly:monthly,annual:regularAnnual,invested:regularInvested,value:regularBalance});stepRows.push({year:y,monthly:current,annual:annualContribution,invested:invested,value:balance});if(stepPercent>0)current*=1+stepPercent/100;else if(stepAmount>0)current+=stepAmount;}
    var hasStep=stepAmount>0||stepPercent>0;text('sip-invested',inr(regularInvested));text('sip-returns',inr(regularBalance-regularInvested));text('sip-maturity',inr(regularBalance));text('sip-stepup-invested',hasStep?inr(invested):'—');text('sip-stepup-returns',hasStep?inr(balance-invested):'—');text('sip-stepup-maturity',hasStep?inr(balance):'—');text('sip-stepup-extra',hasStep?inr(balance-regularBalance):'—');
    var tbody=el('sip-progression-tbody');if(tbody){tbody.innerHTML='';(hasStep?stepRows:regularRows).forEach(function(r,i){var tr=tbody.insertRow();[r.year,inr(r.monthly),inr(r.annual),inr(r.invested),inr(r.value),inr(r.value-r.invested),hasStep?inr(r.value-regularRows[i].value):'—'].forEach(function(v){var td=tr.insertCell();td.textContent=v;});});}
    showChart('sip','SIP Principal vs Return','See how your invested principal compares with estimated returns over time.',(hasStep?stepRows:regularRows).map(function(r){return{label:'Y'+r.year,values:{principal:r.invested,returns:Math.max(0,r.value-r.invested)}};}),function(v){return inr(v);},[{key:'principal',label:'Principal Amount'},{key:'returns',label:'Estimated Return'}]);
  }

  function loanSchedule(principal,annual,years,extraAnnual){var months=Math.max(1,Math.round(years*12)),mr=annual/12/100,emi=mr===0?principal/months:principal*mr*Math.pow(1+mr,months)/(Math.pow(1+mr,months)-1);function run(extra){var balance=principal,interest=0,rows=[],paid=0;for(var y=1;y<=Math.ceil(years)&&balance>0;y++){var begin=balance,principalPaid=0,interestPaid=0,extraPaid=0;for(var m=0;m<12&&balance>0;m++){var ip=balance*mr,sp=mr===0?Math.min(emi,balance):Math.min(emi-ip,balance);if(sp<0)sp=0;balance=Math.max(0,balance-sp);interest+=ip;principalPaid+=sp;interestPaid+=ip;paid++;if(extra>0&&m===11&&balance>0){extraPaid=Math.min(extra,balance);balance-=extraPaid;}}rows.push({year:y,begin:begin,principal:principalPaid,extra:extraPaid,interest:interestPaid,end:balance,reduction:begin-balance});}return{rows:rows,interest:interest,months:paid,balance:balance};}return{emi:emi,regular:run(0),accelerated:extraAnnual>0?run(extraAnnual):null};}

  function calculateLoan(){var principal=num('loan-amount'),annual=num('loan-rate'),years=num('loan-years'),extra=optional('loan-extra-principal');if(!(principal>0)||!(years>0)||!valid(annual))return;var r=loanSchedule(principal,annual,years,extra);text('loan-emi',inr(r.emi));text('loan-interest',inr(r.regular.interest));text('loan-total',inr(principal+r.regular.interest));var tbody=el('loan-amortization-tbody');if(tbody){tbody.innerHTML='';(r.accelerated||r.regular).rows.forEach(function(row){var tr=tbody.insertRow();[row.year,inr(row.begin),inr(row.principal),inr(row.extra),inr(row.interest),inr(row.end),inr(row.reduction)].forEach(function(v){var td=tr.insertCell();td.textContent=v;});});}if(r.accelerated){var saved=Math.max(0,r.regular.interest-r.accelerated.interest),reduced=Math.max(0,r.regular.months-r.accelerated.months);text('loan-tenure-reduction',Math.floor(reduced/12)+' years '+(reduced%12)+' months');text('loan-interest-saved',inr(saved));text('loan-new-tenure',Math.floor(r.accelerated.months/12)+' years '+(r.accelerated.months%12)+' months');}else{text('loan-tenure-reduction','—');text('loan-interest-saved','—');text('loan-new-tenure','—');}var loanRows=(r.accelerated||r.regular).rows,loanPrincipalPaid=0,loanInterestPaid=0;var loanChartData=loanRows.map(function(row){loanPrincipalPaid+=row.principal+row.extra;loanInterestPaid+=row.interest;return{label:'Y'+row.year,values:{principal:loanPrincipalPaid,interest:loanInterestPaid}};});showChart('loan','Loan Principal vs Interest','Compare cumulative principal repaid with cumulative interest paid year by year.',loanChartData,function(v){return inr(v);},[{key:'principal',label:'Principal Repaid'},{key:'interest',label:'Interest Paid'}]);}

  function setRatio(prefix,value,kind){text('ratio-'+prefix+'-value',kind==='pct'?pct(value):ratio(value));var s=el('ratio-'+prefix+'-status');if(s){s.textContent='';s.className='ratio-status';s.style.display='none';}}
  function calculateRatios(){var ca=num('ratio-current-assets'),inv=num('ratio-inventory'),cl=num('ratio-current-liab'),debt=num('ratio-total-debt'),eq=num('ratio-equity'),assets=num('ratio-total-assets'),rev=num('ratio-revenue'),gross=num('ratio-gross-profit'),net=num('ratio-net-income');if(!(ca>0)||!(cl>0)||!(assets>0)||!(rev>0)||!(eq>0)){alert('Please enter positive values for Current Assets, Current Liabilities, Total Assets, Revenue and Equity.');return;}setRatio('current',ca/cl);setRatio('quick',(ca-inv)/cl);setRatio('debt-equity',debt/eq);setRatio('debt-assets',debt/assets);setRatio('equity-mult',assets/eq);setRatio('gross-margin',gross/rev*100,'pct');setRatio('net-margin',net/rev*100,'pct');setRatio('roa',net/assets*100,'pct');setRatio('roe',net/eq*100,'pct');setRatio('equity',eq/assets*100,'pct');setRatio('asset-turnover',rev/assets);setRatio('dupont',(net/rev)*(rev/assets)*(assets/eq),'pct');text('ratio-operating-margin-value','N/A');var op=el('ratio-operating-margin-status');if(op){op.textContent='Requires operating profit or overhead input';op.className='ratio-status';op.style.display='inline-block';}var feedback=el('ratio-feedback');if(feedback){var notes=[];notes.push('Current ratio: '+ratio(ca/cl)+'.');notes.push('Quick ratio: '+ratio((ca-inv)/cl)+'.');notes.push('Debt-to-equity: '+ratio(debt/eq)+'.');notes.push('Net profit margin: '+pct(net/rev*100)+'.');notes.push('ROA: '+pct(net/assets*100)+', ROE: '+pct(net/eq*100)+'.');feedback.innerHTML='<p>'+notes.join(' ')+'</p><p>These are calculated from the figures entered and are not a substitute for a full financial review.</p>';}var ratioData=[['Current Ratio',ca/cl],['Quick Ratio',(ca-inv)/cl],['Debt / Equity',debt/eq],['Debt / Assets',debt/assets],['Equity Multiplier',assets/eq],['Gross Margin',gross/rev*100],['Net Margin',net/rev*100],['ROA',net/assets*100],['ROE',net/eq*100]];showChart('ratios','Financial Ratio Overview','Compare your calculated ratios with an interactive visual view and hover values.',ratioData.map(function(r){return{label:r[0],value:Math.max(0,r[1])};}),function(v){return Number(v).toFixed(2);});}

  function bind(id,fn){var b=el(id);if(!b)return;b.addEventListener('click',function(e){e.preventDefault();try{fn();}catch(err){console.error('Financial tool error:',err);}});}
  styles();bind('sip-calc-btn',calculateSIP);bind('loan-calc-btn',calculateLoan);bind('ratios-calc-btn',calculateRatios);if(el('sip-calc-btn'))calculateSIP();if(el('loan-calc-btn'))calculateLoan();
})();
