/* Shared scroll motion + navbar progress indicator. */
(function(){
  'use strict';

  function init(){
    var nav=document.getElementById('nav');
    if(!nav) return;

    if(!document.getElementById('pp-scroll-progress')){
      var bar=document.createElement('div');
      bar.id='pp-scroll-progress';
      bar.setAttribute('aria-hidden','true');
      bar.innerHTML='<span></span>';
      nav.appendChild(bar);
    }

    if(!document.getElementById('pp-scroll-motion-styles')){
      var style=document.createElement('style');
      style.id='pp-scroll-motion-styles';
      style.textContent=`
        #pp-scroll-progress{position:absolute;left:0;right:0;bottom:-1px;height:2px;overflow:hidden;pointer-events:none;background:transparent;z-index:4}
        #pp-scroll-progress span{display:block;width:100%;height:100%;transform:scaleX(0);transform-origin:left center;background:linear-gradient(90deg,var(--gold),var(--gold-light),var(--teal));box-shadow:0 0 12px var(--gold-glow);will-change:transform}
        .scroll-effects-ready .reveal{opacity:0;transform:translate3d(0,28px,0);transition:opacity .72s cubic-bezier(.22,.75,.22,1),transform .72s cubic-bezier(.22,.75,.22,1)}
        .scroll-effects-ready .reveal.in{opacity:1;transform:none}
        .scroll-effects-ready .reveal[data-reveal-delay="1"]{transition-delay:.07s}
        .scroll-effects-ready .reveal[data-reveal-delay="2"]{transition-delay:.14s}
        .scroll-effects-ready .reveal[data-reveal-delay="3"]{transition-delay:.21s}
        @media(prefers-reduced-motion:reduce){.scroll-effects-ready .reveal,.scroll-effects-ready .reveal.in{opacity:1;transform:none;transition:none}#pp-scroll-progress span{transition:none}}
      `;
      document.head.appendChild(style);
    }

    /* Industry pages contain many content blocks without a reveal class.
       Promote those blocks to the same scroll choreography as the homepage. */
    if(document.querySelector('.ind-body')){
      var targets=document.querySelectorAll('.ind-body .fact-card,.ind-body .chart-card,.ind-body .diagram-card,.ind-body .ind-two-col,.ind-body .ind-caps,.ind-body .problem-card,.ind-body .cap-row');
      targets.forEach(function(el,i){
        if(!el.classList.contains('reveal')) el.classList.add('reveal');
        if(i%4===1) el.setAttribute('data-reveal-delay','1');
        else if(i%4===2) el.setAttribute('data-reveal-delay','2');
        else if(i%4===3) el.setAttribute('data-reveal-delay','3');
      });
    }

    document.documentElement.classList.add('scroll-effects-ready');

    var progress=nav.querySelector('#pp-scroll-progress span');
    var ticking=false;
    function updateProgress(){
      ticking=false;
      var max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
      var ratio=Math.max(0,Math.min(1,window.scrollY/max));
      if(progress) progress.style.transform='scaleX('+ratio+')';
    }
    function requestProgress(){if(!ticking){ticking=true;requestAnimationFrame(updateProgress);}}
    window.addEventListener('scroll',requestProgress,{passive:true});
    window.addEventListener('resize',requestProgress,{passive:true});
    window.addEventListener('load',requestProgress,{once:true});
    updateProgress();

    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var reveals=document.querySelectorAll('.reveal');
    if(!reveals.length || !('IntersectionObserver' in window)) return;

    /* Re-trigger when the visitor scrolls back up. */
    var revealObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
        }else if(entry.intersectionRatio===0){
          entry.target.classList.remove('in');
        }
      });
    },{threshold:[0,.08],rootMargin:'-5% 0px -5% 0px'});

    reveals.forEach(function(el){revealObserver.observe(el);});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
