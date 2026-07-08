/* ═══ LE TASSI — script.js v2 ═══ */
function initNav(){
  const nav=document.querySelector('nav');
  if(nav)window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40),{passive:true});
  const page=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a,.mob-nav a').forEach(a=>{if((a.getAttribute('href')||'').includes(page))a.classList.add('active');});
  const burger=document.getElementById('burger'),mob=document.getElementById('mobNav');
  if(burger&&mob){
    burger.addEventListener('click',()=>{burger.classList.toggle('open');mob.classList.toggle('open');document.body.style.overflow=mob.classList.contains('open')?'hidden':'';});
    mob.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{burger.classList.remove('open');mob.classList.remove('open');document.body.style.overflow='';}));
  }
}
function initReveal(){
  const io=new IntersectionObserver(es=>{
    const visible=[...es].filter(e=>e.isIntersecting);
    visible.forEach((e,i)=>{
      setTimeout(()=>e.target.classList.add('in'),i*80);
      io.unobserve(e.target);
    });
  },{threshold:.06,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.reveal,.reveal-left,.reveal-scale').forEach(el=>io.observe(el));
}
function initParticles(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');let W,H;
  const rsz=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
  window.addEventListener('resize',rsz,{passive:true});rsz();
  const cols=['rgba(160,120,80,','rgba(232,220,200,','rgba(107,66,38,','rgba(212,197,169,'];
  const mk=()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1+.2,vy:-(Math.random()*.12+.03),vx:(Math.random()-.5)*.06,a:Math.random()*Math.PI*2,s:Math.random()*.01,o:Math.random()*.25+.02,col:cols[Math.floor(Math.random()*cols.length)]});
  const pts=Array.from({length:45},mk);
  (function draw(){ctx.clearRect(0,0,W,H);pts.forEach(p=>{p.a+=p.s;p.x+=p.vx+Math.sin(p.a)*.06;p.y+=p.vy;if(p.y<-4)Object.assign(p,mk(),{y:H+4});ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.col+p.o+')';ctx.fill();});requestAnimationFrame(draw);})();
}
window.loadDishViewer=function(btn){
  const d3=btn.closest('.dish-3d');if(!d3)return;
  d3.classList.add('loaded');
  const mv=d3.querySelector('model-viewer'),glb=d3.dataset.glb||'';
  if(mv&&glb)mv.setAttribute('src',glb);if(mv)mv.style.opacity='1';
};
function initTilt(){
  if(window.matchMedia('(hover:none)').matches)return;
  document.querySelectorAll('.dish-card,.ms-card').forEach(c=>{
    c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(800px) rotateY(${x*2}deg) rotateX(${-y*2}deg) translateY(-4px)`;});
    c.addEventListener('mouseleave',()=>{c.style.transform='';});
  });
}
/* Section bar active tracking */
function initSectionBar(){
  const btns=document.querySelectorAll('.sec-btn[data-section]');
  if(!btns.length)return;
  const sections=[];
  btns.forEach(b=>{
    const s=document.getElementById(b.dataset.section);
    if(s)sections.push({btn:b,el:s});
  });
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{
      const match=sections.find(s=>s.el===e.target);
      if(match)match.btn.classList.toggle('active',e.isIntersecting);
    });
  },{threshold:.15,rootMargin:'-80px 0px -50% 0px'});
  sections.forEach(s=>io.observe(s.el));
}
document.addEventListener('DOMContentLoaded',()=>{
  initNav();initReveal();initTilt();initSectionBar();
  initParticles('particles');initParticles('rparticles');
  document.querySelectorAll('.media-slot video').forEach(v=>v.addEventListener('click',()=>v.paused?v.play():v.pause()));
});
