// Offline browser contracts. Display emulation is not physical installation.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {launchBrowser,browserName,mobileEmulation} from "./browser-test.mjs";
import {iconSpecs,renderIcon,sha256} from "./install-icons.mjs";
const base=process.env.WEBSEC_TEST_URL || "http://127.0.0.1:4173/";
const browser=await launchBrowser();
const provenance=JSON.parse(await readFile(new URL("./install-icons.json",import.meta.url),"utf8"));
const svg=await readFile(new URL("./brand-mark.svg",import.meta.url),"utf8");
const manifestResponse=await fetch(new URL("site.webmanifest",base));
assert.equal(manifestResponse.status,200); assert.match(manifestResponse.headers.get("content-type"),/application\/manifest\+json/);
const manifest=await manifestResponse.json();
assert.equal(manifest.display,"standalone"); assert.equal(manifest.short_name,"WebHackList");
for(const field of ["id","scope","start_url"]) assert.equal(new URL(manifest[field],base).href,new URL(base).href);
assert.equal(manifest.icons.length,3);
assert.equal(provenance.source_sha256,sha256(svg));
assert.equal(provenance.generator_sha256,sha256(await readFile(new URL("./install-icons.mjs",import.meta.url))));
let audits=0;
try {
  const context=await browser.newContext({viewport:{width:320,height:568},...(mobileEmulation?{isMobile:true,hasTouch:true}:{})});
  const page=await context.newPage();
  const errors=[];page.on("pageerror",error=>errors.push(error.message));
  await page.goto(`${base}?q=HTTP&year=2024#desk`);
  await page.waitForSelector(".discovery-record");await page.waitForFunction(()=>!document.querySelector("#boot-screen"));
  const meta=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll("meta[name]")].map(node=>[node.name,node.content])));
  assert.equal(meta["apple-mobile-web-app-title"],manifest.short_name);
  assert.equal(meta["apple-mobile-web-app-capable"],"yes");
  assert.equal(meta["apple-mobile-web-app-status-bar-style"],"default");
  assert.match(meta.viewport,/width=device-width/);assert.match(meta.viewport,/initial-scale=1/);
  assert.equal(await page.locator('link[rel="apple-touch-icon"]').getAttribute("href"),"apple-touch-icon.png");
  assert.equal(await page.locator('link[rel="apple-touch-icon"]').getAttribute("sizes"),"180x180");
  for(const spec of iconSpecs) {
    if(spec.purpose!=="apple") assert.deepEqual(manifest.icons.find(icon=>icon.src===spec.name),{src:spec.name,sizes:`${spec.size}x${spec.size}`,type:"image/png",purpose:spec.purpose});
    const response=await fetch(new URL(spec.name,base));assert.equal(response.status,200);assert.match(response.headers.get("content-type"),/^image\/png/);
    const bytes=Buffer.from(await response.arrayBuffer()), expected=provenance.icons.find(icon=>icon.name===spec.name);
    assert.ok(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));assert.equal(sha256(bytes),expected.sha256);assert.equal(expected.purpose,spec.purpose);
    const decoded=await page.evaluate(async spec=>{
      const image=new Image();image.src=spec.name;await image.decode();
      const canvas=document.createElement("canvas");canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
      const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(image,0,0);
      const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;let painted=0,transparent=0,outsideSafe=0;
      for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
        const i=(y*canvas.width+x)*4;if(data[i+3]!==255)transparent++;
        if(data[i]!==12||data[i+1]!==14||data[i+2]!==21){painted++;if(Math.hypot(x+.5-canvas.width/2,y+.5-canvas.height/2)>canvas.width*.4)outsideSafe++;}
      }
      return {width:image.naturalWidth,height:image.naturalHeight,painted,transparent,outsideSafe};
    },spec);
    assert.equal(decoded.width,spec.size);assert.equal(decoded.height,spec.size);assert.equal(decoded.painted,expected.painted);assert.equal(decoded.transparent,0);
    if(spec.purpose==="maskable")assert.equal(decoded.outsideSafe,0);
    if(browserName==="chromium") {
      // about:blank avoids the application's CSP rejecting data-image generation.
      const renderer=await context.newPage();
      try {
        const first=await renderIcon(renderer,svg,spec),second=await renderIcon(renderer,svg,spec);
        assert.equal(first.data,second.data,"repeat source render reproduces");
        if(provenance.renderer===`Chromium ${browser.version()}`)assert.equal(first.data,bytes.toString("base64"),"published PNG reproduces in recorded renderer");
        else console.log(`Raster equality uses recorded ${provenance.renderer}; current ${browser.version()} verifies decoded content and source repeatability.`);
      }finally{await renderer.close();}
    }
  }
  const before=page.url(),historyLength=await page.evaluate(()=>history.length);
  await page.locator("#mobile-menu").click();
  await page.locator("#show-installation-guidance").focus();await page.keyboard.press("Enter");
  await page.waitForFunction(()=>document.activeElement===document.querySelector("#installation-guidance summary"));
  assert.equal(page.url(),before);assert.equal(await page.evaluate(()=>history.length),historyLength);
  assert.equal(await page.locator("#mobile-menu").getAttribute("aria-expanded"),"false");
  assert.equal(await page.locator(".workspace").evaluate(node=>node.inert),false);
  const summary=page.locator("#installation-guidance summary");
  const geometry=await summary.evaluate(node=>{const r=node.getBoundingClientRect(),h=document.querySelector(".topbar").getBoundingClientRect();return {top:r.top,bottom:r.bottom,header:h.bottom,left:r.left,right:r.right,height:r.height,focus:document.activeElement===node,outline:parseFloat(getComputedStyle(node).outlineWidth),overflow:document.documentElement.scrollWidth>innerWidth+1};});
  assert.ok(geometry.top>=geometry.header+8 && geometry.bottom<=568 && geometry.height>=44 && geometry.left>=0 && geometry.right<=320 && geometry.focus && geometry.outline>=2 && !geometry.overflow,JSON.stringify(geometry));
  const guidance=await page.locator("#installation-guidance").innerText();
  assert.match(guidance,/internet connection is required/);assert.match(guidance,/does not download the archive/);assert.match(guidance,/preserved documents are not saved for offline use/);assert.match(guidance,/Clearing website data removes/);
  await page.keyboard.press("Enter");assert.equal(await page.locator("#installation-guidance").evaluate(node=>node.open),false);
  await page.keyboard.press("Enter");
  const axe=await readFile(process.env.AXE_SOURCE,"utf8");await page.evaluate(axe);
  for(const theme of ["dark","light"]) {
    await page.evaluate(theme=>{discoveryState.theme=theme;updateDiscoveryAppearance();},theme);
    const result=await page.evaluate(()=>axe.run(document.querySelector("#installation-guidance"),{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa","wcag22aa"]}}));
    assert.deepEqual(result.violations,[]);audits++;
  }
  // A failed request still leaves the already-open guidance usable. This does
  // not claim a new offline launch or cached preserved documents.
  await context.setOffline(true);await page.keyboard.press("Enter");await page.keyboard.press("Enter");
  assert.equal(await summary.isVisible(),true);assert.equal(await page.evaluate(async()=>{try{await fetch("site.webmanifest?offline-probe");return true;}catch{return false;}}),false);
  await context.setOffline(false);
  assert.equal(await page.evaluate(async()=>navigator.serviceWorker?(await navigator.serviceWorker.getRegistrations()).length:0),0);
  await page.evaluate(()=>setView("museum"));await page.waitForFunction(()=>state.view==="museum");
  await page.goBack();await page.waitForFunction(()=>state.view==="desk");assert.equal(page.url(),before);
  await page.goForward();await page.waitForFunction(()=>state.view==="museum");
  if(["chromium","chrome"].includes(browserName)) {
    const cdp=await context.newCDPSession(page);
    const parsed=await cdp.send("Page.getAppManifest");assert.deepEqual(parsed.errors,[]);assert.equal(JSON.parse(parsed.data).short_name,"WebHackList");
    const installability=await cdp.send("Page.getInstallabilityErrors");console.log("CDP installability diagnostic (desktop disposable browser; not OS installation): "+JSON.stringify(installability));
    if(browserName==="chrome" && process.env.WEBSEC_TEST_HEADED==="1") {
      const {chromium}=await import(process.env.PLAYWRIGHT_MODULE);
      const persistent=await chromium.launchPersistentContext("/tmp/installation-profile",{channel:"chrome",headless:false,viewport:{width:390,height:844}});
      const installPage=persistent.pages()[0]; await installPage.goto(base); await installPage.waitForSelector("#app-shell:not([hidden])");
      const installCDP=await persistent.newCDPSession(installPage),manifestId=new URL(manifest.id,base).href;
      let installed=false;
      try {
        await installCDP.send("PWA.install",{manifestId,installUrlOrBundleUrl:new URL(base).href});installed=true;
        console.log("Disposable persistent-profile Chrome installation completed: "+JSON.stringify(await installCDP.send("PWA.getOsAppState",{manifestId})));
        const launched=await installCDP.send("PWA.launch",{manifestId});
        // PWAs are a distinct target; Playwright's ordinary page event can
        // identify another tab. Attach to the exact returned app target.
        const target=await installCDP.send("Target.getTargetInfo",{targetId:launched.targetId});
        console.log("Actual installed launch returned target: "+JSON.stringify(target.targetInfo));
        const attached=await installCDP.send("Target.attachToTarget",{targetId:launched.targetId,flatten:false});
        let timer,listener;
        const response=new Promise((resolve,reject)=>{
          timer=setTimeout(()=>reject(Error("Installed target evaluation timed out")),20000);
          listener=event=>{
            if(event.sessionId!==attached.sessionId)return;
            if(event.message.length>65536)return reject(Error("Oversized installed target response"));
            const message=JSON.parse(event.message);if(message.id===1)resolve(message);
          };
          installCDP.on("Target.receivedMessageFromTarget",listener);
        });
        try {
          await installCDP.send("Target.sendMessageToTarget",{sessionId:attached.sessionId,message:JSON.stringify({id:1,method:"Runtime.evaluate",params:{expression:`(async()=>{for(let i=0;i<100;i++){if(document.querySelector('#app-shell:not([hidden])'))break;await new Promise(r=>setTimeout(r,100));}return {url:location.href,standalone:matchMedia('(display-mode: standalone)').matches,browser:matchMedia('(display-mode: browser)').matches,ready:!!document.querySelector('#app-shell:not([hidden])'),find:!!document.querySelector('#find-research')};})()`,awaitPromise:true,returnByValue:true}})});
          const value=await response;
          if(value.error?.code===-32601)console.log("Installed-target standalone inspection unavailable in this CDP target: "+value.error.message+"; physical launch acceptance remains pending.");
          else {
            assert.ok(!value.error && !value.result?.exceptionDetails,JSON.stringify(value));
            const presentation=value.result.result.value;
            console.log("Actual installed Chrome target/default presentation: "+JSON.stringify({target:target.targetInfo,presentation}));
            assert.equal(presentation.standalone,true,"actual returned app target uses default standalone display");
            assert.equal(presentation.ready,true);assert.equal(presentation.find,true);assert.equal(new URL(presentation.url).origin,new URL(base).origin);
          }
        } finally {clearTimeout(timer);installCDP.off("Target.receivedMessageFromTarget",listener);await installCDP.send("Target.detachFromTarget",{sessionId:attached.sessionId});}
        console.log("Disposable Chrome install/launch commands completed: "+JSON.stringify(launched)+"; no physical OS launcher/Android/iOS acceptance claimed.");
      } catch(error) {
        if(installed)throw error;
        console.log("Disposable persistent-profile Chrome installation unavailable: "+error.message);
      } finally {
        if(installed){await installCDP.send("PWA.uninstall",{manifestId});console.log("Disposable Chrome app uninstalled; profile removed with container.");}
        await installCDP.detach();await persistent.close();
      }
    } else {
      console.log("Actual installation requires the optional headed Chrome persistent-profile probe; this incognito context checks metadata only.");
    }
    await cdp.send("Emulation.setEmulatedMedia",{features:[{name:"display-mode",value:"standalone"}]});
    const emulated=await page.evaluate(()=>matchMedia("(display-mode: standalone)").matches);
    console.log("Standalone media simulation: "+(emulated?"active":"unsupported by this CDP runtime"));
    // No UI hides navigation in standalone: check the existing shell remains usable.
    await page.evaluate(()=>setView("desk"));await page.waitForSelector("#desk-query");
    assert.equal(await page.locator("#find-research").isVisible(),true);assert.equal(await page.locator("#mobile-menu").isVisible(),true);
    await cdp.send("Emulation.setEmulatedMedia",{features:[]});await cdp.detach();
  } else console.log("WebKit checks platform metadata and phone presentation; native iOS installation is not available.");
  if(browserName==="chromium" && process.env.WEBSEC_INSTALLATION_CAPTURE==="1") {
    for(const width of [320,1440]) {
      await page.setViewportSize({width,height:width===320?568:1000});
      await page.evaluate(()=>{const d=document.querySelector("#installation-guidance");d.open=true;const summary=d.querySelector("summary");summary.focus({preventScroll:true});scrollBy({top:summary.getBoundingClientRect().top-document.querySelector(".topbar").getBoundingClientRect().bottom-12,behavior:"instant"});});
      await page.evaluate(()=>new Promise(requestAnimationFrame));
      const png=await page.screenshot();assert.ok(png.length<1024*1024);
      console.log("INSTALLATION_CAPTURE "+JSON.stringify({name:`guidance-${width}`,width,height:width===320?568:1000,data:png.toString("base64")}));
    }
  }
  assert.deepEqual(errors,[]);await context.close();
  console.log(`Installation: four decoded opaque PNGs, maskable safe circle, SVG/provenance hashes, manifest/touch metadata, 320px keyboard focus/URL/history and connectivity guidance passed; ${audits} focused axe audits.`);
} finally {await browser.close();}
