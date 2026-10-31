/* First-party, pointer-transparent Halloween scenery. No archive data is read. */
(() => {
  "use strict";
  if (window.self !== window.top || window.WebHackHalloweenWorld) return;
  const TAU = Math.PI * 2;
  const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
  const random = (seed) => { const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value); };
  let layer, canvas, ctx, active = false, frame = null, last = 0, time = 0, width = 1, height = 1, ratio = 1;
  let light = false, reduced = false, burstUntil = 0, pointer = {x:.72,y:.28}, print = false;
  let headerBounds, sidebarBounds, inputBusy = false;
  const ghosts = [], bugs = [], sparks = [];
  const root = document.documentElement;
  const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const colourQuery = matchMedia("(forced-colors: active)");
  const printQuery = matchMedia("print");
  function mount() {
    if (layer) return api;
    layer = document.createElement("div");
    layer.id = "halloween-world";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = `<div class="haunt-sky"><div class="haunt-blood-moon"></div><div class="haunt-moon-orbit"></div></div>
      <div class="haunt-web haunt-web-left"></div><div class="haunt-web haunt-web-right"></div>
      <div class="haunt-fog-bank"></div><canvas id="halloween-world-canvas"></canvas>
      <div class="haunt-edge-code"><span>0xDEAD · PATCH WINDOW CLOSED</span><span>UNDEAD PROCESS DETECTED</span></div>`;
    canvas = layer.querySelector("canvas");
    ctx = canvas.getContext("2d", {alpha:true});
    place();
    resize();
    const syncSoon = () => sync();
    new MutationObserver(syncSoon).observe(document.body, {attributes:true,attributeFilter:["class"]});
    new MutationObserver(syncSoon).observe(root, {attributes:true,attributeFilter:["data-halloween","data-discovery-theme","data-view"]});
    new MutationObserver(syncSoon).observe(document.body, {subtree:true,attributes:true,attributeFilter:["open"]});
    const main = document.querySelector("#main-content");
    if (main) new MutationObserver(() => { place(); sync(); }).observe(main, {attributes:true,attributeFilter:["class"]});
    addEventListener("resize", resize, {passive:true});
    addEventListener("pointermove", event => {
      if (!active || event.pointerType === "touch") return;
      pointer = {x:event.clientX / width,y:event.clientY / height};
    }, {passive:true});
    document.addEventListener("visibilitychange", sync);
    document.addEventListener("fullscreenchange", () => { place(); resize(); });
    motionQuery.addEventListener("change", sync);
    colourQuery.addEventListener("change", sync);
    printQuery.addEventListener("change", sync);
    addEventListener("beforeprint", () => { print = true; sync(); });
    addEventListener("afterprint", () => { print = false; sync(); });
    document.addEventListener("webhacklist:haunt-breach", event => {
      if (!active || reduced) return;
      const contained=event.detail?.contained || event.detail?.phase==="contained";
      burstUntil = time + (contained ? 2 : 11);
      const count = contained ? 18 : 40;
      for (let n=0;n<count;n++) sparks.push({x:width*.5,y:height*.45,vx:(random(n+time)-.5)*210,vy:(random(n+89+time)-.7)*160,life:2+random(n+30)*3,mark:n%3?"0":"1"});
      const budget=width<700 ? 40 : 72;
      if (sparks.length>budget) sparks.splice(0,sparks.length-budget);
      sync();
    });
    return api;
  }
  function place() {
    if (!layer || !document.body) return;
    const host = document.fullscreenElement || document.webkitFullscreenElement || document.querySelector("main.view-fullscreen-fallback") || document.body;
    if (layer.parentElement !== host) host.append(layer);
  }
  function resize() {
    if (!canvas) return;
    width = Math.max(1,innerWidth); height = Math.max(1,innerHeight);
    ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width*ratio); canvas.height = Math.round(height*ratio);
    canvas.style.width = width+"px"; canvas.style.height = height+"px";
    if (ctx) ctx.setTransform(ratio,0,0,ratio,0,0);
    ghosts.length = bugs.length = 0;
    const narrow = width < 700;
    for (let n=0;n<(narrow?3:5);n++) ghosts.push({seed:n+1,scale:(narrow?21:29)+random(n+3)*17,phase:random(n+20)*TAU,speed:.018+random(n+16)*.013});
    for (let n=0;n<(narrow?8:15);n++) bugs.push({seed:n+11,phase:random(n+60),speed:.009+random(n+7)*.012,size:4+random(n+19)*3});
    draw(); sync();
  }
  function sync() {
    if (!layer) return;
    light = root.dataset.discoveryTheme === "light";
    reduced = motionQuery.matches || document.body.classList.contains("reduce-motion");
    const modal = Boolean(document.querySelector("dialog[open]"));
    const paused = !active || document.hidden || modal || reduced || colourQuery.matches || print || printQuery.matches;
    layer.hidden = !active || colourQuery.matches || print || printQuery.matches;
    layer.dataset.motion = paused ? "still" : "roaming";
    layer.dataset.palette = light ? "light" : "dark";
    layer.classList.toggle("haunt-world-paused", paused);
    if (paused) {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null; last = 0;
      if (active && !document.hidden && !modal) draw();
    } else if (frame === null && ctx) { last = 0; frame = requestAnimationFrame(tick); }
  }
  function tick(stamp) {
    frame = null;
    if (!active || document.hidden || reduced || document.querySelector("dialog[open]")) { sync(); return; }
    if (last && stamp-last<32) { frame = requestAnimationFrame(tick); return; }
    const dt = last ? Math.min((stamp-last)/1000,.08) : 1/30;
    last = stamp; time += dt;
    for (let n=sparks.length-1;n>=0;n--) {
      const spark=sparks[n]; spark.life-=dt; spark.x+=spark.vx*dt; spark.y+=spark.vy*dt; spark.vy+=12*dt;
      if (spark.life<=0) sparks.splice(n,1);
    }
    draw(); frame=requestAnimationFrame(tick);
  }
  function perimeter(progress, inset=18) {
    const w=Math.max(1,width-inset*2),h=Math.max(1,height-inset*2),length=2*(w+h);
    let d=((progress%1)+1)%1*length;
    if(d<w)return{x:inset+d,y:inset,angle:0}; d-=w;
    if(d<h)return{x:width-inset,y:inset+d,angle:Math.PI/2}; d-=h;
    if(d<w)return{x:width-inset-d,y:height-inset,angle:Math.PI}; d-=w;
    return{x:inset,y:height-inset-d,angle:-Math.PI/2};
  }
  function ghost(being) {
    const seed=being.seed, along=being.phase/TAU+time*being.speed;
    const path=perimeter(along, 28+seed*9);
    const roaming=seed===3 || seed===5;
    const x=roaming ? width*(.5+Math.sin(time*.11+being.phase)*.48) : path.x+Math.sin(time*.7+seed)*12;
    const y=roaming ? height*(.5+Math.cos(time*.09+being.phase)*.44) : path.y+Math.cos(time*.9+seed)*13;
    const reader=root.hasAttribute("data-halloween-reader");
    const r=being.scale*(reader ? .55 : 1), sway=Math.sin(time*1.5+seed), lookX=clamp((pointer.x*width-x)/180,-1,1), lookY=clamp((pointer.y*height-y)/180,-1,1);
    const inReadingArea=x>Math.max(80,width*.18)&&x<width-90&&y>165&&y<height-90;
    const overHeader=headerBounds && x+r>headerBounds.left && x-r<headerBounds.right && y-r<headerBounds.bottom && y+r>headerBounds.top;
    const overSidebar=sidebarBounds && x+r>sidebarBounds.left && x-r<sidebarBounds.right && y+r>sidebarBounds.top && y-r<sidebarBounds.bottom;
    const opacity=(inReadingArea ? time<burstUntil ? .26 : .15 : light ? .48 : .62)*(reader ? .3 : 1)*(overHeader ? .14 : 1)*(overSidebar ? .35 : 1)*(inputBusy ? .35 : 1);
    ctx.save(); ctx.translate(x,y); ctx.rotate(sway*.09); ctx.globalAlpha=opacity;
    const haze=ctx.createRadialGradient(0,0,r*.3,0,0,r*2.1);
    haze.addColorStop(0,light?"#69438448":"#bb8aff44"); haze.addColorStop(1,"#b886ff00");
    ctx.fillStyle=haze;ctx.fillRect(-r*2.1,-r*2.1,r*4.2,r*4.2);
    ctx.shadowColor=light?"#4b315f":"#c5b5ff";ctx.shadowBlur=14;
    const shroud=ctx.createLinearGradient(0,-r,0,r*1.25);
    shroud.addColorStop(0,light?"#72578e":"#eee8ff");shroud.addColorStop(.55,light?"#8e74a0c9":"#c1b6e9c9");shroud.addColorStop(1,"#9d73bf00");
    ctx.fillStyle=shroud;ctx.beginPath();
    ctx.moveTo(-r*.72,r*.7);ctx.bezierCurveTo(-r*.85,-r*.15,-r*.67,-r,r*.01,-r);
    ctx.bezierCurveTo(r*.76,-r,r*.8,-r*.08,r*.73,r*.65);
    for(let n=0;n<7;n++){const xx=r*.73-n*r*.24;ctx.quadraticCurveTo(xx-r*.12,r*(n%2?1.28:1.03)+sway*5,xx-r*.24,r*(n%2?.78:.9));}
    ctx.closePath();ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle="#140d26";
    ctx.save();ctx.translate(lookX*2,lookY*2);ctx.beginPath();
    ctx.moveTo(-r*.46,-r*.27);ctx.lineTo(-r*.12,-r*.13);ctx.lineTo(-r*.17,r*.08);ctx.lineTo(-r*.4,r*.01);ctx.closePath();
    ctx.moveTo(r*.46,-r*.27);ctx.lineTo(r*.12,-r*.13);ctx.lineTo(r*.17,r*.08);ctx.lineTo(r*.4,r*.01);ctx.closePath();ctx.fill();ctx.restore();
    ctx.fillStyle=seed%2?"#e9a2ff":"#b9ffe1";ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=9;
    ctx.beginPath();ctx.arc(-r*.26+lookX*3,-r*.055+lookY*3,1.8,0,TAU);ctx.arc(r*.26+lookX*3,-r*.055+lookY*3,1.8,0,TAU);ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle="#20112c";ctx.beginPath();ctx.moveTo(-r*.2,r*.3);ctx.lineTo(0,r*.38);ctx.lineTo(r*.2,r*.3);ctx.lineTo(r*.12,r*.54);ctx.lineTo(0,r*.46);ctx.lineTo(-r*.12,r*.54);ctx.closePath();ctx.fill();
    ctx.strokeStyle=light?"#351c494d":"#41305055";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(-r*.35,r*.03);ctx.lineTo(-r*.29,r*.28);ctx.moveTo(r*.35,r*.03);ctx.lineTo(r*.29,r*.28);ctx.stroke();
    ctx.globalAlpha=opacity*.6;ctx.fillStyle=light?"#4d2e69":"#c7a5ec";ctx.font="8px monospace";ctx.textAlign="center";
    ctx.fillText(["use_after_free()","0xDEAD","wont_fix","heap spirit","NULL soul"][seed-1],0,r*1.5);
    ctx.restore();
  }
  function bug(being) {
    const pos=perimeter(being.phase+time*being.speed, 7+being.seed%4*3),s=being.size;
    const gait=Math.sin(time*17+being.seed)*s*.5;
    ctx.save();ctx.translate(pos.x,pos.y);ctx.rotate(pos.angle);ctx.globalAlpha=light?.66:.7;
    ctx.strokeStyle=light?"#633960":"#ce8cb2";ctx.lineWidth=1;
    for(let n=-1;n<=1;n++)for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(n*s*.5,side*s*.3);ctx.lineTo(n*s*.8+gait*(n%2?1:-1),side*s*1.1);ctx.lineTo(n*s*.8-s*.5,side*s*1.45);ctx.stroke();}
    ctx.fillStyle=light?"#362035":"#1c1122";ctx.beginPath();ctx.ellipse(0,0,s,s*.6,0,0,TAU);ctx.fill();
    ctx.strokeStyle=light?"#854950":"#fa966f";ctx.beginPath();ctx.moveTo(-s,0);ctx.lineTo(s*.7,0);ctx.stroke();
    ctx.fillStyle="#ed9578";ctx.beginPath();ctx.arc(s*.72,-s*.2,1.3,0,TAU);ctx.arc(s*.72,s*.2,1.3,0,TAU);ctx.fill();ctx.restore();
  }
  function cemetery() {
    const narrow=width<700;
    const strip=ctx.createLinearGradient(0,height-85,0,height);strip.addColorStop(0,"#170f2000");strip.addColorStop(1,light?"#422e5a16":"#08070e7a");
    ctx.fillStyle=strip;ctx.fillRect(0,height-85,width,85);
    for(let n=0;n<(narrow?4:10);n++){
      const x=20+n*(width/(narrow?4:10))+random(n+93)*19,y=height+14,h=30+random(n+24)*39,w=20+random(n+6)*18;
      ctx.save();ctx.translate(x,y);ctx.rotate((random(n+48)-.5)*.23);ctx.globalAlpha=light?.22:.32;
      ctx.fillStyle=light?"#4a315f":"#201426";ctx.strokeStyle=light?"#8d668d":"#72506f";ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(-w/2,0);ctx.lineTo(-w/2,-h+w/2);ctx.arc(0,-h+w/2,w/2,Math.PI,0);ctx.lineTo(w/2,0);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle=light?"#3a244b":"#bb92b4";ctx.font="7px monospace";ctx.textAlign="center";ctx.fillText(n%3?"RIP":"EOL",0,-h*.55);ctx.restore();
    }
    // A pair of eyes emerges from the abandoned rack at either edge.
    for(const x of [16,width-30]){ctx.fillStyle=light?"#914c7855":"#bb77df66";ctx.shadowColor="#c481ed";ctx.shadowBlur=11;ctx.fillRect(x,height*.64,4,2);ctx.fillRect(x+8,height*.64,4,2);ctx.shadowBlur=0;}
  }
  function bats() {
    for(let n=0;n<4;n++){
      const x=width*.82+Math.sin(time*.12+n*1.9)*Math.min(170,width*.24),y=78+Math.sin(time*.25+n)*42,wing=5+Math.sin(time*5+n)*3;
      ctx.save();ctx.translate(x,y);ctx.globalAlpha=light?.26:.34;ctx.fillStyle=light?"#37203d":"#18101f";
      ctx.beginPath();ctx.moveTo(0,3);ctx.quadraticCurveTo(-7,-wing,-14,-5);ctx.lineTo(-10,3);ctx.lineTo(-5,1);ctx.lineTo(0,5);ctx.lineTo(5,1);ctx.lineTo(10,3);ctx.lineTo(14,-5);ctx.quadraticCurveTo(7,-wing,0,3);ctx.fill();ctx.restore();
    }
  }
  function draw() {
    if (!ctx || !active) return;
    headerBounds=document.querySelector(".topbar, .masthead, .reader-toolbar")?.getBoundingClientRect();
    sidebarBounds=document.querySelector(".sidebar")?.getBoundingClientRect();
    inputBusy=Boolean(document.activeElement?.matches("input,textarea,select"));
    ctx.clearRect(0,0,width,height);
    cemetery(); bats();
    for(const being of ghosts) ghost(being);
    for(const being of bugs) bug(being);
    const count=width<700?9:19;
    ctx.font="10px monospace";
    for(let n=0;n<count;n++){
      const y=(random(n+83)*height+time*(4+random(n+17)*8))%(height+25)-12;
      const x=n%2?12+random(n+7)*22:width-34+random(n+12)*20;
      ctx.globalAlpha=.12+random(n+27)*.15;ctx.fillStyle=light?"#6d3e72":"#be9dce";
      ctx.fillText(n%4?"0":"1",x,y);
    }
    for(const spark of sparks){ctx.globalAlpha=Math.min(.65,spark.life*.3);ctx.fillStyle="#f8b8d7";ctx.fillText(spark.mark,spark.x,spark.y);}
    if(time<burstUntil){ctx.globalAlpha=.18*(.7+.3*Math.sin(time*1.4));ctx.strokeStyle="#dd628e";ctx.lineWidth=2;ctx.strokeRect(4,4,width-8,height-8);}
    ctx.globalAlpha=1;
  }
  function setActive(value) { active=Boolean(value); if(active) mount(); if(layer){layer.hidden=!active;if(!active){sparks.length=0;if(ctx)ctx.clearRect(0,0,width,height);}sync();} }
  const api={mount,setActive};
  window.WebHackHalloweenWorld=api;
})();
