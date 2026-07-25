/* ═══ LE TASSI — script.js v3 (cart + WhatsApp) ═══ */
const WA_NUMBER = "213699012400";

function initNav(){
  const nav=document.querySelector('nav');
  if(nav)window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40),{passive:true});
  const page=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a,.mob-nav a').forEach(a=>{if((a.getAttribute('href')||'')===page)a.classList.add('active');});
  const burger=document.getElementById('burger'),mob=document.getElementById('mobNav');
  if(burger&&mob){
    burger.addEventListener('click',()=>{burger.classList.toggle('open');mob.classList.toggle('open');document.body.style.overflow=mob.classList.contains('open')?'hidden':'';});
    mob.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{burger.classList.remove('open');mob.classList.remove('open');document.body.style.overflow='';}));
  }
}
function initReveal(){
  const io=new IntersectionObserver(es=>{
    const v=[...es].filter(e=>e.isIntersecting);
    v.forEach((e,i)=>{setTimeout(()=>e.target.classList.add('in'),i*80);io.unobserve(e.target);});
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

/* ═══ CART ═══ */
const CART={
  items:JSON.parse(localStorage.getItem('lt_cart')||'[]'),
  save(){localStorage.setItem('lt_cart',JSON.stringify(this.items));this.updateUI();},
  add(name,price,size){
    const key=name+(size?'_'+size:'');
    const ex=this.items.find(i=>i.key===key);
    if(ex)ex.qty++;else this.items.push({key,name,price:+price,size:size||'',qty:1});
    this.save();this.pulse();
  },
  remove(key){this.items=this.items.filter(i=>i.key!==key);this.save();},
  updateQty(key,d){const it=this.items.find(i=>i.key===key);if(!it)return;it.qty+=d;if(it.qty<1)this.remove(key);else this.save();},
  total(){return this.items.reduce((s,i)=>s+i.price*i.qty,0);},
  count(){return this.items.reduce((s,i)=>s+i.qty,0);},
  clear(){this.items=[];this.save();},
  pulse(){const f=document.querySelector('.cart-float');if(f){f.style.transform='scale(1.15)';setTimeout(()=>f.style.transform='',220);}},
  updateUI(){
    const cnt=document.querySelector('.cart-count');
    if(cnt){const c=this.count();cnt.textContent=c;cnt.classList.toggle('show',c>0);}
    const box=document.querySelector('.cart-items');
    if(!box)return;
    if(!this.items.length){box.innerHTML='<div class="cart-empty">Votre panier est vide</div>';}
    else{
      box.innerHTML=this.items.map(i=>`<div class="c-item"><div class="c-info"><div class="c-name">${i.name}</div>${i.size?`<div class="c-size">${i.size}</div>`:''}</div><div class="c-qty"><button onclick="CART.updateQty('${i.key.replace(/'/g,"\\'")}',-1)">−</button><span>${i.qty}</span><button onclick="CART.updateQty('${i.key.replace(/'/g,"\\'")}',1)">+</button></div><div class="c-price">${(i.price*i.qty).toLocaleString()} DA</div></div>`).join('');
    }
    const tot=document.querySelector('.ct-val');if(tot)tot.textContent=this.total().toLocaleString()+' DA';
    const btn=document.querySelector('.order-btn');if(btn)btn.style.display=this.items.length?'flex':'none';
  }
};
function toggleCart(){
  document.querySelector('.cart-panel')?.classList.toggle('open');
  document.querySelector('.cart-overlay')?.classList.toggle('show');
  CART.updateUI();
}
function openOrderForm(){
  document.querySelector('.order-modal')?.classList.add('show');
  document.querySelector('.cart-panel')?.classList.remove('open');
  document.querySelector('.cart-overlay')?.classList.remove('show');
}
function closeOrderForm(){document.querySelector('.order-modal')?.classList.remove('show');}
function handleOrderType(){
  const del=document.getElementById('type-delivery');
  const df=document.querySelector('.delivery-fields');
  if(del&&df)df.classList.toggle('show',del.checked);
}
function submitOrder(){
  const name=document.getElementById('o-name')?.value?.trim();
  const phone=document.getElementById('o-phone')?.value?.trim();
  const type=document.querySelector('input[name="otype"]:checked')?.value;
  const addr=document.getElementById('o-addr')?.value?.trim();
  if(!name||!phone||!type){alert('Veuillez remplir tous les champs obligatoires.');return;}
  if(type==='delivery'&&!addr){alert('Veuillez entrer votre adresse de livraison.');return;}
  let msg=`☕ *Nouvelle commande — Le Tassi*\n\n`;
  msg+=`📦 Type: *${type==='delivery'?'Livraison':'Emporter'}*\n`;
  msg+=`👤 Nom: *${name}*\n📱 Tél: *${phone}*\n`;
  if(type==='delivery')msg+=`🏠 Adresse: *${addr}*\n`;
  msg+=`\n──────────────\n`;
  CART.items.forEach(i=>{msg+=`${i.qty}× ${i.name}${i.size?' ('+i.size+')':''} — ${(i.price*i.qty).toLocaleString()} DA\n`;});
  msg+=`──────────────\n💰 *Total: ${CART.total().toLocaleString()} DA*`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
  CART.clear();closeOrderForm();
}
window.selectSize=function(btn){
  btn.closest('.sz-group').querySelectorAll('.sz-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  const wrap=btn.closest('.cart-row');
  const ab=wrap.querySelector('.add-btn');
  ab.dataset.price=btn.dataset.price;
  ab.dataset.size=btn.dataset.size;
};
window.addToCart=function(btn){
  const name=btn.dataset.name, price=btn.dataset.price, size=btn.dataset.size||'';
  if(!price){alert('Choisissez une option');return;}
  CART.add(name,price,size);
};

document.addEventListener('DOMContentLoaded',()=>{
  initNav();initReveal();initTilt();initParticles('particles');
  CART.updateUI();
  document.querySelectorAll('input[name="otype"]').forEach(r=>r.addEventListener('change',handleOrderType));
});
