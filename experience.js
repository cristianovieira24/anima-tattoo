(()=>{'use strict';
const track=document.querySelector('#experience');if(!track)return;
const stage=track.querySelector('.experience-stage'),body=document.body;
const scenes=[...stage.querySelectorAll('.cinema-scene')],hero=scenes[0],archive=scenes[1],universe=scenes[2],process=scenes[3],closing=scenes[4];
const panels=[...archive.querySelectorAll('.work')],rail=archive.querySelector('.gallery-rail'),gallery=archive.querySelector('.gallery');
const reduced=matchMedia('(prefers-reduced-motion:reduce)'),desktop=matchMedia('(min-width:901px) and (min-height:680px)');
const stops={inicio:0,arquivo:.34,universo:.545,processo:.745,contacto:.98};
const names=['01 / ESSÊNCIA','02 / O ARQUIVO','03 / UNIVERSO ÂNIMA','04 / DA IDEIA À PEÇA','05 / O SEU PRÓXIMO CAPÍTULO'];
const dots=[...stage.querySelectorAll('.experience-controls nav a')],toggle=document.querySelector('#motion-toggle');
const clamp=x=>Math.max(0,Math.min(1,x)),phase=(p,a,b)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t)};
const move=(el,value)=>{el.style.transform=value},opacity=(el,v)=>{el.style.opacity=String(v)};
let userReduce=new URLSearchParams(location.search).get('motion')==='reduce',cinematic=false,mobile=false,raf=0,active=-1;
let mobileGalleryStart=0;
function setActive(index){if(active===index)return;active=index;scenes.forEach((s,i)=>{s.inert=i!==index;s.setAttribute('aria-hidden',String(i!==index))});dots.forEach((dot,i)=>i===index?dot.setAttribute('aria-current','step'):dot.removeAttribute('aria-current'));stage.querySelector('.chapter-name').textContent=names[index];}
function render(){raf=0;if(cinematic){
 const p=clamp(-track.getBoundingClientRect().top/(track.offsetHeight-stage.offsetHeight));
 const leave=phase(p,.015,.235),paper=phase(p,.405,.535),ink=phase(p,.59,.69),end=phase(p,.81,.94);
 move(hero.querySelector('.hero-image'),`scale(${1+leave*.2}) translate(${-leave*5}%,${leave*2}%)`);
 move(hero.querySelector('.hero-copy'),`translate(${-leave*12}%,${-leave*90}px)`);opacity(hero.querySelector('.hero-copy'),1-phase(p,.06,.19));
 opacity(hero,1-phase(p,.18,.35));move(hero.querySelector('.hero-star'),`rotate(${leave*100}deg) scale(${1-leave*.5})`);
 opacity(archive,phase(p,.095,.15)*(1-phase(p,.465,.54)));archive.style.setProperty('--archive-bg',phase(p,.13,.29));
 const title=archive.querySelector('.archive-heading');move(title,`translateY(${(1-phase(p,.16,.29))*65-paper*45}px)`);opacity(title,phase(p,.17,.29));
 opacity(archive.querySelector('.section-top'),phase(p,.2,.3));opacity(archive.querySelector('.filters'),phase(p,.27,.34));opacity(archive.querySelector('.archive-bottom'),phase(p,.27,.34));
 panels.forEach((panel,i)=>{const enter=phase(p,.115+i*.033,.27+i*.03),out=phase(p,.41+i*.012,.53+i*.012);const image=panel.querySelector('.work-img');image.style.clipPath=`inset(${(1-enter)*100}% ${out*28}% 0 ${out*28}%)`;move(image,`translate(${(i-1)*out*100}px,${(1-enter)*90-out*35}px) scale(${.82+enter*.18})`);opacity(panel.querySelector('.work-meta'),phase(p,.23+i*.03,.31+i*.03));opacity(panel.querySelector('.work-number'),enter);});
 universe.style.clipPath=`inset(${(1-paper)*100}% 0 0 0)`;opacity(universe,1-phase(p,.64,.74));
 move(universe.querySelector('.manifesto-art img'),`translate(${-ink*35}%,${(1-paper)*25}%) rotate(${(1-paper)*-13-ink*7}deg) scale(${.82+paper*.18})`);
 move(universe.querySelector('.manifesto-copy'),`translateY(${(1-phase(p,.44,.545))*80}px)`);opacity(universe.querySelector('.manifesto-copy'),phase(p,.45,.545));
 process.style.clipPath=`inset(0 0 0 ${(1-ink)*100}%)`;opacity(process,1-phase(p,.86,.95));
 move(process.querySelector('h2'),`translateX(${(1-ink)*110}px)`);
 [...process.querySelectorAll('.process-list article')].forEach((el,i)=>{const a=phase(p,.635+i*.022,.71+i*.022);move(el,`translateX(${(1-a)*80}px)`);opacity(el,a);const star=el.querySelector('.process-symbol');if(star)move(star,`rotate(${(1-a)*-90}deg)`)});
 closing.style.clipPath=`circle(${end*150}% at 88% 55%)`;
 [closing.querySelector('.micro'),closing.querySelector('h2'),closing.querySelector('.large-cta'),closing.querySelector('p:last-of-type')].forEach((el,i)=>{const a=phase(p,.85+i*.013,.92+i*.013);move(el,`translateY(${(1-a)*55}px)`);opacity(el,a)});
 move(closing.querySelector('.invitation-star'),`rotate(${(1-end)*100}deg) scale(${.6+end*.4})`);
 setActive(p<.21?0:p<.445?1:p<.625?2:p<.855?3:4);
 body.classList.toggle('paper-scene',(p>.51&&p<.637)||p>.93);move(stage.querySelector('.experience-progress span'),`scaleX(${p})`);
 }else if(mobile){
 const hr=hero.getBoundingClientRect(),depart=clamp(-hr.top/hr.height);move(hero.querySelector('.hero-image'),`translateY(${depart*35}px) scale(${1.04+depart*.09})`);move(hero.querySelector('.hero-copy'),`translateY(${-depart*22}px)`);
 if(!gallery.classList.contains('filtered')){const start=archive.getBoundingClientRect().top+mobileGalleryStart-innerHeight*.16;const duration=Math.max(1,archive.offsetHeight-mobileGalleryStart-gallery.offsetHeight-180);const p=clamp(-start/duration);const travel=Math.max(0,rail.scrollWidth-gallery.clientWidth);move(rail,`translateX(${-p*travel}px)`);}else rail.style.removeProperty('transform');
 const art=universe.querySelector('img'),ur=universe.getBoundingClientRect(),u=clamp((innerHeight-ur.top)/(innerHeight+ur.height));move(art,`rotate(${(u-.5)*9}deg) scale(${.95+u*.05})`);
 }
}
function schedule(){if(!raf)raf=requestAnimationFrame(render)}
function measure(){if(mobile){const old=gallery.style.position;gallery.style.position='relative';mobileGalleryStart=gallery.offsetTop;gallery.style.position=old;}schedule()}
function configure(){cinematic=desktop.matches&&!reduced.matches&&!userReduce;mobile=!desktop.matches&&!reduced.matches&&!userReduce;body.classList.toggle('cinematic',cinematic);body.classList.toggle('mobile-motion',mobile);body.classList.toggle('motion-reduce',!cinematic&&!mobile);body.classList.remove('paper-scene');active=-1;
 stage.querySelectorAll('[style]').forEach(el=>el.removeAttribute('style'));scenes.forEach(s=>{s.inert=false;s.removeAttribute('aria-hidden')});toggle.textContent=userReduce?'Experiência scroll':'Modo leitura';toggle.setAttribute('aria-pressed',String(userReduce));measure();}
function go(id,update=true){if(!(id in stops))return;if(update)history.pushState(null,'','#'+id);if(cinematic){scrollTo({top:scrollY+track.getBoundingClientRect().top+(track.offsetHeight-stage.offsetHeight)*stops[id],behavior:'instant'});render();}else document.getElementById(id).scrollIntoView({block:'start',behavior:'instant'});}
track.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.hash.slice(1);if(id in stops){e.preventDefault();go(id)}}));
addEventListener('hashchange',()=>go(location.hash.slice(1),false));addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);reduced.addEventListener('change',configure);desktop.addEventListener('change',configure);
toggle.addEventListener('click',()=>{const id=Object.keys(stops)[Math.max(0,active)];userReduce=!userReduce;configure();go(id,false)});
archive.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{measure();schedule()}));
// Keyboard focus advances the mobile rail through the same native scroll range.
panels.forEach((panel,i)=>panel.addEventListener('focus',()=>{if(!mobile||gallery.classList.contains('filtered')||!panel.matches(':focus-visible'))return;const duration=Math.max(1,archive.offsetHeight-mobileGalleryStart-gallery.offsetHeight-180);const top=scrollY+archive.getBoundingClientRect().top+mobileGalleryStart-innerHeight*.16+duration*i/(panels.length-1);scrollTo({top,behavior:'instant'});render();}));
configure();if(location.hash.slice(1) in stops)requestAnimationFrame(()=>go(location.hash.slice(1),false));
})();
