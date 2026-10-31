// Executable components of the local F19/F20 acceptance cases. Speech and
// physical-display judgement remain human checks; no AX-tree substitution.
import assert from 'node:assert/strict';
import {mkdtemp, writeFile, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
assert.equal(process.env.WEBSEC_TEST_BROWSER || 'chromium', 'chromium', 'real tab zoom requires bundled Chromium');
const extension = await mkdtemp(join(tmpdir(), 'websec-zoom-extension-'));
const profile = await mkdtemp(join(tmpdir(), 'websec-zoom-profile-'));
await writeFile(join(extension,'manifest.json'), JSON.stringify({manifest_version:3,name:'Isolated local zoom acceptance',version:'1.0',host_permissions:['http://127.0.0.1/*'],background:{service_worker:'worker.js'}}));
await writeFile(join(extension,'worker.js'), 'chrome.runtime.onInstalled.addListener(() => {});');
const context = await chromium.launchPersistentContext(profile,{channel:'chromium',headless:true,viewport:{width:1440,height:1000},args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
const page = context.pages()[0];
const fontDiagnostics=new Set();
const fontResponses=[];
let installedFontProof=null;
context.on('response',response=>{const requested=new URL(response.url());if(requested.pathname.endsWith('/web/standard_fonts/LiberationSans-Regular.ttf')){const observed={origin:requested.origin,path:requested.pathname,status:response.status(),type:response.request().resourceType()};fontResponses.push(observed);if(fontResponses.length<=3)console.log('PDF_FONT_RESPONSE '+JSON.stringify(observed));}});
page.on('console',message=>{const text=message.text();if(/font.*Content Security Policy|standard_fonts.*(violates|failed)/i.test(text)&&fontDiagnostics.size<5&&!fontDiagnostics.has(text)){fontDiagnostics.add(text);console.log('PDF_FONT_DIAGNOSTIC '+JSON.stringify({type:message.type(),text:text.slice(0,1400)}));}});
page.setDefaultTimeout(10000);
const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
const url = process.env.WEBSEC_TEST_URL || 'http://127.0.0.1:4173/';
const views = ['evidence','museum','library','time','signals','constellation','terminal','favourites','desk'];
const results = [];
let currentSetup='';const captured=new Set();
async function capture(name) {
  if(process.env.WEBSEC_CASE_CAPTURE!=='1'||captured.has(name))return;
  if(name.endsWith('-desk')||name==='400-spacing-constellation'){
    assert.equal(await page.locator('dialog[open]').count(),0,'view capture has no open dialog');
    const target=page.locator(name.endsWith('-desk')?'.discovery-record [data-artifact]':'[data-topic-filter="XSS"]').first();
    await keyboard(target);await target.evaluate(e=>e.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'}));
    assert.ok(await target.evaluate(e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);let opaque=true;for(let p=e;p;p=p.parentElement)opaque=opaque&&Number(getComputedStyle(p).opacity)>.9;return !!hit&&(e===hit||e.contains(hit))&&opaque;}), 'capture target is visible and painted');
  }
  await page.evaluate(async()=>{await Promise.all(document.getAnimations().filter(a=>Number.isFinite(a.effect.getTiming().iterations)).map(a=>a.finished.catch(()=>{})));await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
  console.log('CAPTURE_GEOMETRY '+JSON.stringify(await page.evaluate(name=>({name,scrollY,width:innerWidth,height:innerHeight,focus:document.activeElement.id,main:document.querySelector('#main-content').getBoundingClientRect().toJSON()}),name)));
  const session=await context.newCDPSession(page);let screenshot;
  try{screenshot=await session.send('Page.captureScreenshot',{format:'jpeg',quality:65,fromSurface:true,captureBeyondViewport:false});}finally{await session.detach();}
  const bytes=Buffer.from(screenshot.data,'base64');assert.ok(bytes.length<512*1024,'bounded screenshot');
  assert.ok(await page.evaluate(async data=>{const image=new Image();image.src=`data:image/jpeg;base64,${data}`;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data,colors=new Set();for(let i=0;i<pixels.length;i+=400)colors.add(`${pixels[i]},${pixels[i+1]},${pixels[i+2]}`);return colors.size>2;},screenshot.data),'capture is not a uniform empty surface');
  console.log('CASE_CAPTURE '+JSON.stringify({name,format:'jpeg',bytes:bytes.length,data:bytes.toString('base64')}));captured.add(name);
}
const spacing = '* {line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important} p {margin-bottom:2em !important}';
const markdown = '# Accessibility fixture\n\nFirst-party inert text.\n\n'+Array.from({length:12},(_,i)=>`Paragraph ${i}: readable text to exercise vertical scrolling.`).join('\n\n')+'\n\n## Details\n\n[Reference link](https://example.org/)\n\nFinal readable paragraph.';
function pdfFixture(kind) {
  // Self-authored, no imported document bytes or embedded executable content.
  const streams = kind === 'columns' ? ['BT /F1 14 Tf 30 740 Td (Left column token one) Tj 0 -30 Td (Left column token two) Tj 270 30 Td (Right column token three) Tj ET'] : kind === 'scan' ? ['q 160 0 0 160 30 640 cm /Im1 Do Q'] : ['BT /F1 18 Tf 30 740 Td (Accessible token first page token) Tj ET','BT /F1 18 Tf 30 740 Td (Accessible token second page) Tj ET'];
  const objects=['<< /Type /Catalog /Pages 2 0 R >>',`<< /Type /Pages /Kids [${streams.map((_,i)=>`${3+i*2} 0 R`).join(' ')}] /Count ${streams.length} >>`];
  const fontId=3+streams.length*2;
  streams.forEach((stream,i)=>objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 800] /Resources << /Font << /F1 ${fontId} 0 R >> ${kind==='scan'?`/XObject << /Im1 ${fontId+1} 0 R >>`:''} >> /Contents ${4+i*2} 0 R >>`,`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`));
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  if(kind==='scan') {const bitmap=['00000000','00000000','11100111','11100111','11100111','11100111','11100111','11111111'].join('').split('').map(pixel=>pixel==='1'?'ff':'00').join('')+'>';objects.push(`<< /Type /XObject /Subtype /Image /Width 8 /Height 8 /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /ASCIIHexDecode /Length ${bitmap.length} >>\nstream\n${bitmap}\nendstream`);}
  let pdf='%PDF-1.4\n';const offsets=[0];objects.forEach((object,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${object}\nendobj\n`;});const xref=pdf.length;
  pdf+=`xref\n0 ${offsets.length}\n0000000000 65535 f \n${offsets.slice(1).map(o=>`${String(o).padStart(10,'0')} 00000 n \n`).join('')}trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf);
}
async function settled() {await page.waitForFunction(()=>!documentDismissal&&!restoringRoute&&dialogUnlockFrame===null&&(!document.querySelector('dialog[open]')?lockedDialogScrollY===null:true)&&!document.querySelector('#boot-screen'));}
async function record(caseNumber,view,setup,action) {
  try {const evidence=await action();const result={case:caseNumber,view,setup,status:'pass',evidence:evidence||{}};results.push(result);console.log('CASE_RESULT '+JSON.stringify(result));}
  catch(error) {const result={case:caseNumber,view,setup,status:'fail',error:error.message};results.push(result);console.log('CASE_RESULT '+JSON.stringify(result));throw error;}
}
async function keyboard(control) {
  assert.ok(await control.isVisible(),`target control visible: ${control}`);assert.ok(await control.isEnabled(),`target control enabled: ${control}`);
  await control.focus();await page.keyboard.press('Shift');
  // Real sequential navigation must return to this control; then inspect the
  // rendered control after the browser scrolls it into view.
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');
  assert.ok(await control.evaluate(e=>document.activeElement===e),'sequential keyboard return');
  // Browser focus scrolling follows the page's smooth-scroll policy and can
  // outlast one animation frame, especially after a real tab-zoom transition.
  // Observe that natural scroll settling; never reposition the target here.
  await control.evaluate(async e=>{
    const deadline=performance.now()+3000;
    do {
      await new Promise(requestAnimationFrame);
      const r=e.getBoundingClientRect(),x=Math.max(0,Math.min(innerWidth-1,r.left+r.width/2)),y=Math.max(0,Math.min(innerHeight-1,r.top+r.height/2)),hit=document.elementFromPoint(x,y);
      if(document.activeElement===e&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth&&hit&&(e===hit||e.contains(hit)))return;
    } while(performance.now()<deadline);
  });
  const geometry=await control.evaluate(async e=>{
    await new Promise(requestAnimationFrame);await Promise.all(e.getAnimations().map(a=>a.finished.catch(()=>{})));
    const r=e.getBoundingClientRect(),s=getComputedStyle(e),x=Math.max(0,Math.min(innerWidth-1,r.left+r.width/2)),y=Math.max(0,Math.min(innerHeight-1,r.top+r.height/2));
    const hit=document.elementFromPoint(x,y);
    // Decorative card pseudo-elements intentionally extend beyond the card;
    // summary previews deliberately clamp. Check the actual heading label.
    const label=e.matches('.artifact-card')?e.querySelector('h3'):e;
    const titlePreview=e.matches('.book')&&s.textOverflow==='ellipsis'&&!!e.getAttribute('aria-label');
    return {left:r.left,top:r.top,width:r.width,height:r.height,hit:hit?{tag:hit.tagName,id:hit.id,class:hit.className}:null,inViewport:r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth,unoccluded:!!hit&&(e===hit||e.contains(hit)),outline:parseFloat(s.outlineWidth),font:parseFloat(s.fontSize),titlePreview,clipped:!titlePreview&&(label.scrollWidth>label.clientWidth+2||label.scrollHeight>label.clientHeight+2)};
  });
  assert.ok(geometry.inViewport&&geometry.unoccluded,`focus visible in viewport ${control}: ${JSON.stringify(geometry)}`);
  assert.ok(geometry.outline>=2,`focus outline ${JSON.stringify(geometry)}`);
  assert.ok(!geometry.clipped,`control text clipped ${JSON.stringify(geometry)}`);
  return geometry;
}
async function enter(control) {await keyboard(control);await page.keyboard.press('Enter');}
async function fits(surface=page) {assert.ok(await surface.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'document has no horizontal overflow');}
async function measureReadability(){
  await fits();
  const measures=await page.locator('#view-root .case-tab,#view-root .year-pill,#view-root .topic-key button,#view-root .saved-modes button,#view-root .signal-tuner button,#view-root .constellation-filters button,#view-root .discovery-more,#view-root #terminal-command,#view-root .desk-filters :is(input,select,button)').evaluateAll(elements=>elements.filter(e=>e.getClientRects().length).map(e=>parseFloat(getComputedStyle(e).fontSize)));
  assert.ok(measures.length>0,'each view exposes measured primary controls');
  assert.ok(measures.every(size=>size>=12),'primary filter labels at least 12 CSS px');
  const preview=await page.locator('.book').first().evaluate(e=>({font:parseFloat(getComputedStyle(e).fontSize),ellipsis:getComputedStyle(e).textOverflow==='ellipsis',completeName:!!e.getAttribute('aria-label')})).catch(()=>null);
  return {primaryControls:measures.length,minFont:measures.length?Math.min(...measures):null,maxFont:measures.length?Math.max(...measures):null,bookPreview:preview,comfort:'requires a human physical-display judgement'};
}
async function pressedContrastProbe(){
  const axeSource=await readFile(process.env.AXE_SOURCE,'utf8');await page.evaluate(axeSource);
  const observations=[];
  await page.setViewportSize({width:720,height:1000});await page.emulateMedia({forcedColors:'none',reducedMotion:'reduce'});
  for(const view of views){
    await page.evaluate(()=>{const item=state.items.find(i=>i.id===window.caseSeedId);setReadState(item,true);setFavouriteState(item,true);});
    await chooseView(view);
    if(view==='terminal'){const origin=await viewAction(view);await escape('artifact-dialog',origin);}
    for(const type of ['reader','pdf']){
      const origin=await artifact(view);await enter(page.locator(type==='reader'?'#open-reader':'#open-pdf-reader'));
      if(type==='reader')await page.locator('#reader-content h2').waitFor();else await page.frameLocator('#pdf-frame').locator('#text-mode:not([disabled])').waitFor();
      const dialog=page.locator(`#${type}-dialog`);
      if(await dialog.getAttribute('data-reading-theme')!=='light')await enter(page.locator(`#${type}-theme-toggle`));
      for(const state of ['read','favourite'])if(await page.locator(`#${type}-${state}-toggle`).getAttribute('aria-pressed')!=='true')await enter(page.locator(`#${type}-${state}-toggle`));
      await page.evaluate(async()=>{await Promise.all(document.getAnimations().filter(a=>Number.isFinite(a.effect.getTiming().iterations)).map(a=>a.finished.catch(()=>{})));await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
      const controls=await dialog.locator('button[aria-pressed="true"]').evaluateAll(elements=>elements.filter(e=>/-(read|favourite)-toggle$/.test(e.id)).map(e=>{
        const style=getComputedStyle(e), luminance=color=>{const channels=color.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;};
        const fg=luminance(style.color),bg=luminance(style.backgroundColor);return {id:e.id,foreground:style.color,background:style.backgroundColor,font:style.fontSize,ratio:(Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05)};
      }));
      const audit=await page.evaluate(id=>axe.run(document.getElementById(id),{runOnly:{type:'rule',values:['color-contrast']}}),`${type}-dialog`);
      const row={case:type==='reader'?11:12,view,setup:'pressed light contrast',controls,violations:audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))};
      assert.equal(controls.length,2,'both pressed Read and Favourite measured');observations.push(row);console.log('PRESSED_CONTRAST '+JSON.stringify(row));
      await escape(`${type}-dialog`,origin);
    }
  }
  const failures=observations.filter(row=>row.controls.some(c=>c.ratio<4.5)||row.violations.length);
  console.log('PRESSED_SUMMARY '+JSON.stringify({rows:observations.length,failures:failures.length}));
  assert.equal(failures.length,0,'pressed reader labels require 4.5 contrast and focused axe contrast audits');
  for(const row of observations)await record(row.case,row.view,row.setup,async()=>({controls:row.controls,focusedAxeViolations:row.violations.length}));
}
async function chooseView(view) {
  await settled();
  if(await page.locator('#mobile-menu').isVisible()) await enter(page.locator('#mobile-menu'));
  await enter(page.locator(`.nav-item[data-view="${view}"]`));
  await page.waitForFunction(view=>state.view===view&&document.activeElement.id===(view==='terminal'?'terminal-command':'main-content'),view);
  assert.equal(await page.locator(`.nav-item[data-view="${view}"]`).getAttribute('aria-current'),'page');
  await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('#main-content').contains(document.activeElement)),'Tab enters view');await page.keyboard.press('Shift+Tab');
}
async function escape(dialog,opener) {
  await page.keyboard.press('Escape');await page.waitForFunction(id=>!document.getElementById(id).open,dialog);await settled();
  assert.ok(await opener.evaluate(e=>document.activeElement===e),'exact opener focus restored');
}
async function artifact(view) {
  if(view!=='constellation')await page.locator('#view-root [data-artifact]:visible').first().waitFor({state:'visible'});
  // Collection cards use progressive source metadata. Load selected existing
  // record metadata before choosing a record with both reader formats.
  const ids=await page.locator('#view-root [data-artifact]:visible').evaluateAll(elements=>elements.map(e=>e.dataset.artifact));
  let id;
  for(const candidate of ids)if(await page.evaluate(async id=>{const i=await ensureItemLoaded(id);return !!(i?.mdPath&&i?.pdfPath)},candidate)){id=candidate;break;}
  let opener=page.locator(`#view-root [data-artifact="${id}"]:visible`).first();
  if(view==='constellation') {
    const scene=page.locator('#constellation-space');await keyboard(scene);await scene.press('Home');
    const count=await page.evaluate(()=>constellationExperience.nodes.filter(n=>n.type==='article').length);
    for(let index=0;index<count;index++) {
      if(await page.evaluate(async()=>{const i=await ensureItemLoaded(constellationExperience.selected.item.id);return !!(i.mdPath&&i.pdfPath)}))break;
      await scene.press('PageDown');
    }
    await page.locator('#space-open-artifact').waitFor({state:'visible'});opener=page.locator('#space-open-artifact');
  }
  await enter(opener);await page.locator('#artifact-dialog[open]').waitFor();
  assert.ok((await page.locator('#artifact-title').innerText()).length>0);
  assert.equal(await page.locator('#artifact-title').innerText(),await page.evaluate(()=>state.items.find(i=>i.id===artifactCurrentId).title),'complete record title');
  assert.equal(await page.locator('#artifact-dialog').getAttribute('aria-labelledby'),'artifact-title');
  await keyboard(page.locator('#artifact-read-toggle'));await keyboard(page.locator('#artifact-favourite-toggle'));await fits();
  return opener;
}
async function viewAction(view) {
  if(['evidence','library'].includes(view)) {await enter(page.locator('[data-year="2024"]').first());assert.equal(await page.evaluate(()=>state.year),'2024');}
  if(view==='museum') {if(await page.locator('[data-room-filter="XSS"]').getAttribute('aria-pressed')==='true')await enter(page.locator('[data-room-filter="reset"]'));await enter(page.locator('[data-room-filter="XSS"]'));assert.equal(await page.locator('[data-room-filter="XSS"]').getAttribute('aria-pressed'),'true');assert.ok(await page.evaluate(()=>roomFilterActive()));}
  if(view==='signals') {await enter(page.locator('[data-signal-topic="HTTP"]'));assert.equal(await page.locator('[data-signal-topic="HTTP"]').getAttribute('aria-pressed'),'true');assert.equal(await page.evaluate(()=>state.signalTopic),'HTTP');}
  if(view==='time') {
    const button=page.locator('[data-discovery-action="time-expand"]').first(),year=await button.getAttribute('data-discovery-value'),selector=`[data-discovery-action="time-expand"][data-discovery-value="${year}"]`;
    const before=await page.locator(`#time-${year} .discovery-record`).count();await enter(button);assert.equal(await page.locator(selector).getAttribute('aria-expanded'),'true');assert.ok(await page.locator(`#time-${year} .discovery-record`).count()>before);
    await enter(page.locator(selector));assert.equal(await page.locator(selector).getAttribute('aria-expanded'),'false');assert.ok(await page.locator(selector).evaluate(e=>document.activeElement===e));
  }
  if(view==='constellation') {
    await enter(page.locator('[data-year="2024"]').first());await enter(page.locator('[data-topic-filter="XSS"]'));assert.equal(await page.locator('[data-topic-filter="XSS"]').getAttribute('aria-pressed'),'true');
    for(const selector of ['[data-star-status="all"]','#space-zoom-in','#space-zoom-range','#space-autorotate']) await keyboard(page.locator(selector));
    await enter(page.locator('[data-star-status="all"]'));assert.equal(await page.locator('[data-star-status="all"]').getAttribute('aria-pressed'),'true');
    const distance=Number(await page.locator('#space-zoom-range').getAttribute('aria-valuenow'));await enter(page.locator('#space-zoom-in'));assert.ok(Number(await page.locator('#space-zoom-range').getAttribute('aria-valuenow'))<distance);
    // The old decorative navigation dial is intentionally display:none. The
    // live keyboard camera movements are on the focusable scene itself.
    await page.locator('#constellation-space').focus();const yaw=await page.evaluate(()=>constellationExperience.camera.yaw);await page.keyboard.down('ArrowLeft');await page.waitForFunction(yaw=>constellationExperience.camera.yaw!==yaw,yaw);await page.keyboard.up('ArrowLeft');
    const scene=page.locator('#constellation-space');await scene.press('Home');const first=await page.evaluate(()=>constellationExperience.selected.item.id);await scene.press('End');assert.equal(await page.evaluate(()=>constellationExperience.selected.item.id),await page.evaluate(()=>constellationExperience.nodes.filter(n=>n.type==='article').at(-1).item.id));await scene.press('PageDown');assert.equal(await page.evaluate(()=>constellationExperience.selected.item.id),first);await scene.press('PageUp');assert.equal(await page.evaluate(()=>constellationExperience.selected.item.id),await page.evaluate(()=>constellationExperience.nodes.filter(n=>n.type==='article').at(-1).item.id));
    assert.ok(await page.locator('#space-key-help').isVisible(),'canvas key help visible');
    assert.ok((await page.locator('#space-selection-status').innerText()).includes(await page.evaluate(()=>constellationExperience.selected.item.title)),'selected title exposed by scoped status');
    assert.match(await scene.getAttribute('aria-describedby'),/space-selection-status/);
    await scene.press('Enter');await page.locator('#artifact-dialog[open]').waitFor();await escape('artifact-dialog',scene);
    await page.locator('#constellation-space').focus();await page.keyboard.press('Tab');assert.notEqual(await page.evaluate(()=>document.activeElement.id),'constellation-space','canvas does not swallow Tab');
  }
  if(view==='terminal') {
    const input=page.locator('#terminal-command');await input.fill('help');await input.press('Enter');await page.waitForFunction(()=>!state.terminalBusy);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));assert.match(await page.locator('#terminal-output').innerText(),/help|Commands/i);
    const focusState=()=>page.evaluate(()=>({id:document.activeElement.id,class:document.activeElement.className,tag:document.activeElement.tagName,runVisible:!!document.querySelector('.terminal-run').getClientRects().length}));
    await input.fill('hel');await input.press('Tab');assert.equal(await input.inputValue(),'help');assert.ok(await input.evaluate(e=>e===document.activeElement),'completion retains command input');await input.press('Tab');assert.ok(await page.locator('.terminal-run').evaluate(e=>e===document.activeElement),`unchanged completion permits Tab exit: ${JSON.stringify(await focusState())}`);
    await input.focus();await input.press('Shift+Tab');assert.ok(await page.locator('#terminal-output').evaluate(e=>e===document.activeElement||e.contains(document.activeElement)),'Shift+Tab leaves command input for output controls');await input.focus();await input.press('Escape');await input.fill('');await input.press('Tab');assert.ok(await page.locator('.terminal-run').evaluate(e=>e===document.activeElement),`empty command permits Tab exit: ${JSON.stringify(await focusState())}`);
    await input.fill('ls /2024');await input.press('Enter');await page.waitForFunction(()=>!state.terminalBusy);
    const id=await page.evaluate(()=>state.items.find(i=>i.year==='2024'&&i.mdPath&&i.pdfPath).id);await input.fill(`open ${id}`);await input.press('Enter');await page.waitForFunction(()=>!state.terminalBusy);
  }
  if(view==='desk') {
    await page.evaluate(()=>window.caseStatusNode=document.querySelector('.view-metric'));
    await keyboard(page.locator('#desk-query'));await page.locator('#desk-query').fill('no-match-accessibility-zzzz');assert.equal(await page.locator('#view-count').innerText(),'0');assert.equal(await page.locator('.discovery-record').count(),0);
    await page.locator('#desk-query').fill('');await page.locator('#desk-topic').selectOption('XSS');assert.equal(await page.locator('#view-count').innerText(),await page.evaluate(()=>deskFilteredRecords().length.toLocaleString()));
    await enter(page.locator('[data-discovery-action="desk-reset"]'));await enter(page.locator('[data-discovery-action="desk-next"]'));assert.match(await page.locator('#view-count-label').innerText(),/showing 21\u201340.*page 2/);
    await enter(page.locator('[data-discovery-action="desk-prev"]'));assert.match(await page.locator('#view-count-label').innerText(),/showing 1\u201320.*page 1/);await enter(page.locator('[data-discovery-action="desk-reset"]'));
    assert.ok(await page.evaluate(()=>window.caseStatusNode===document.querySelector('.view-metric')));assert.equal(await page.locator('.view-metric').getAttribute('role'),'status');assert.equal(await page.locator('.view-metric').getAttribute('aria-atomic'),'true');assert.equal(await page.locator('#view-root').getAttribute('aria-live'),null);
  }
  if(view==='favourites') {
    await enter(page.locator('[data-saved-mode="read"]'));const item=await page.evaluate(()=>state.items.find(i=>i.read&&i.favourite).id);
    await enter(page.locator(`[data-favourite="${item}"]`));assert.ok(await page.evaluate(id=>{const i=state.items.find(i=>i.id===id);return i.read&&!i.favourite},item));assert.equal(await page.locator(`[data-artifact="${item}"]`).count(),1);
    // Removing read status is a partial state transition too. Restore for the
    // subsequent reader action inside this disposable profile.
    await enter(page.locator(`[data-saved-unread="${item}"]`));assert.equal(await page.locator(`[data-artifact="${item}"]`).count(),0);
    await page.evaluate(id=>{const i=state.items.find(i=>i.id===id);setReadState(i,true);setFavouriteState(i,true);},item);
  }
  await fits();
  if(currentSetup==='400% + spacing'&&['desk','constellation'].includes(view))await capture(`400-spacing-${view}`);
  if(currentSetup.startsWith('forced colours')&&view==='desk')await capture(`forced-${currentSetup.endsWith('light')?'light':'dark'}-desk`);
  const opener=await artifact(view);return opener;
}
async function markdownReader(view,artifactOpener,direct=false) {
  const read=direct?artifactOpener:page.locator('#open-reader');await enter(read);await page.locator('#reader-content h2').waitFor();
  const evidence=[];
  for(const theme of ['light','dark']) {
    if(await page.locator('#reader-dialog').getAttribute('data-reading-theme')!==theme) await enter(page.locator('#reader-theme-toggle'));
    assert.equal(await page.locator('#reader-dialog').getAttribute('data-reading-theme'),theme);
    const toc=page.locator('#reader-toc [data-reader-target]').last();
    if(!await toc.isVisible()) {
      await enter(page.locator('#reader-contents-toggle'));assert.equal(await page.locator('#reader-contents-toggle').getAttribute('aria-expanded'),'true');
      assert.ok(await page.locator('#reader-scroll').evaluate(e=>e.inert),'overlay makes covered article inert');
      await toc.focus();await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>!document.querySelector('#reader-scroll').contains(document.activeElement)),'Tab cannot enter covered article links');
      await page.keyboard.press('Escape');assert.ok(await page.locator('#reader-dialog').evaluate(e=>e.open),'nested Contents Escape keeps reader open');assert.ok(await page.locator('#reader-contents-toggle').evaluate(e=>document.activeElement===e),`nested Contents Escape returns toggle: ${JSON.stringify(await page.evaluate(()=>({focus:document.activeElement.id,expanded:document.querySelector('#reader-contents-toggle').getAttribute('aria-expanded'),panel:document.querySelector('#reader-dialog').classList.contains('is-contents-open')})))}`);
      assert.ok(await page.locator('#reader-scroll').evaluate(e=>!e.inert),'Escape restores article interaction');
      await enter(page.locator('#reader-contents-toggle'));
    }
    await enter(toc);
    assert.ok(await page.locator('#reader-scroll').evaluate(e=>!e.inert),'heading selection restores article interaction');
    const target=await toc.getAttribute('data-reader-target');
    try {await page.waitForFunction(id=>{const s=document.querySelector('#reader-scroll').getBoundingClientRect(),r=document.getElementById(id).getBoundingClientRect();return document.activeElement.id===id&&r.top>=s.top-2&&r.top<s.bottom},target);}
    catch(error){console.log('MARKDOWN_GEOMETRY '+JSON.stringify(await page.evaluate(id=>({focus:document.activeElement.id,dialogOpen:document.querySelector('#reader-dialog').open,panel:document.querySelector('#reader-dialog').classList.contains('is-contents-open'),inert:document.querySelector('#reader-scroll').inert,scroll:document.querySelector('#reader-scroll').getBoundingClientRect().toJSON(),target:document.getElementById(id).getBoundingClientRect().toJSON(),scrollTop:document.querySelector('#reader-scroll').scrollTop,scrollHeight:document.querySelector('#reader-scroll').scrollHeight}),target)));throw error;}
    for(const selector of ['#reader-actions a:last-child','#reader-read-toggle','#reader-favourite-toggle','.reader-close']) await keyboard(page.locator(selector));
    for(const selector of ['#reader-read-toggle','#reader-favourite-toggle']){const old=await page.locator(selector).getAttribute('aria-pressed');await enter(page.locator(selector));assert.notEqual(await page.locator(selector).getAttribute('aria-pressed'),old);await enter(page.locator(selector));}
    assert.ok(await page.evaluate(()=>document.querySelector('.reader-bar strong').getBoundingClientRect().bottom<=document.querySelector('#reader-actions').getBoundingClientRect().top+1),'Markdown title and actions do not overlap');
    await fits();const readingGeometry=await page.locator('#reader-scroll').evaluate(e=>({height:e.clientHeight,rect:e.getBoundingClientRect().toJSON(),dialog:document.querySelector('#reader-dialog').getBoundingClientRect().toJSON(),toolbar:document.querySelector('.reader-bar').getBoundingClientRect().toJSON(),focus:document.activeElement.id,panel:document.querySelector('#reader-dialog').classList.contains('is-contents-open'),inert:e.inert}));assert.ok(readingGeometry.height>=40,`Markdown reading area remains available: ${JSON.stringify(readingGeometry)}`);evidence.push({theme,headings:await page.locator('#reader-content :is(h1,h2)').count(),readingHeight:readingGeometry.height});
  }
  if(currentSetup==='400% + spacing'&&view==='desk')await capture('400-spacing-markdown');
  await escape('reader-dialog',artifactOpener);return evidence;
}
async function pdfReader(kind,spacingOn,returnOpener) {
  // Ordinary desktop widths deliberately choose the browser-native viewer.
  // Exercise the separate PDF.js reader through its real <=820px branch at
  // 100%; actual 200/400% tab zoom already reaches that branch at 1440px.
  // Open a first-party fixture through an existing keyboard PDF opener in the
  // real record dialog. Only the selected path is changed, not reader logic.
  const opener=page.locator('#open-pdf-reader');await enter(opener);
  try{await page.locator('#pdf-frame').waitFor({state:'visible'});}catch(error){console.log('PDF_HOST_GEOMETRY '+JSON.stringify(await page.evaluate(()=>({width:innerWidth,dpr:devicePixelRatio,inSite:state.pdfUsesInSiteReader,mode:state.pdfView,path:state.pdfPath,dialogOpen:document.querySelector('#pdf-dialog').open,dialog:document.querySelector('#pdf-dialog').getBoundingClientRect().toJSON(),header:document.querySelector('.pdf-bar').getBoundingClientRect().toJSON(),frame:document.querySelector('#pdf-frame').getBoundingClientRect().toJSON(),hidden:document.querySelector('#pdf-frame').hidden,src:document.querySelector('#pdf-frame').src,loading:document.querySelector('#pdf-loading').innerText,fallback:document.querySelector('#pdf-fallback-message').innerText,fallbackHidden:document.querySelector('#pdf-fallback').hidden}))));throw error;}
  try {await page.frameLocator('#pdf-frame').locator('#text-mode:not([disabled])').waitFor();}
  catch(error) {console.log('PDF_DIAGNOSTIC '+JSON.stringify({src:await page.locator('#pdf-frame').getAttribute('src'),frames:await Promise.all(page.frames().map(async frame=>({url:frame.url(),error:await frame.locator('#reader-error-text').textContent().catch(()=>null)})))}));throw error;}
  const frame=page.frames().find(f=>f.url().includes('pdf-reader.html'));assert.ok(frame);assert.notEqual(new URL(frame.url()).origin,new URL(page.url()).origin);
  if(!installedFontProof){installedFontProof=await frame.evaluate(async()=>{const {PDFJS_ROOT}=await import(new URL('pdfjs-release.mjs',location.href));const url=new URL('web/standard_fonts/LiberationSans-Regular.ttf',PDFJS_ROOT);if(url.origin!==location.origin)throw Error('installed font must use isolated reader origin');const font=new FontFace('AcceptanceInstalledStandardFont',`url("${url.href}")`);await font.load();return {url:url.href,status:font.status};});assert.equal(installedFontProof.status,'loaded','installed standard font decodes and loads under reader CSP');console.log('PDF_FONT_PROOF '+JSON.stringify(installedFontProof));}
  const hostGeometry=await page.evaluate(()=>({frameHeight:document.querySelector('#pdf-frame').clientHeight,headerHeight:document.querySelector('.pdf-bar').clientHeight,titleLength:document.querySelector('#pdf-title').textContent.length,path:state.pdfPath}));
  assert.ok(hostGeometry.frameHeight>=80,`host iframe retains toolbar and reading space: ${JSON.stringify(hostGeometry)}`);
  await frame.locator('#text-mode:not([disabled])').waitFor();
  if(spacingOn) await frame.evaluate(url=>new Promise((resolve,reject)=>{const link=document.createElement('link');link.rel='stylesheet';link.href=url;link.onload=resolve;link.onerror=()=>reject(Error('selected spacing stylesheet failed to load'));document.head.append(link);}),new URL('/__accessibility-spacing.css',frame.url()).href);
  const evidence=[];
  for(const theme of ['light','dark']) {
    if(await page.locator('#pdf-dialog').getAttribute('data-reading-theme')!==theme) await enter(page.locator('#pdf-theme-toggle'));
    await frame.waitForFunction(theme=>document.documentElement.dataset.theme===theme,theme);
    if(await frame.locator('#text-mode').getAttribute('aria-pressed')==='true')await enter(frame.locator('#text-mode'));
    await keyboard(frame.locator('#zoom-in'));
    const canvas=frame.locator('.pdf-page.is-rendered canvas:visible').first();await canvas.waitFor({state:'visible'});
    const rendered=await canvas.evaluate(canvas=>{const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;let marks=0;for(let i=0;i<data.length;i+=4)if(data[i+3]>0&&Math.min(data[i],data[i+1],data[i+2])<200)marks++;return {width:canvas.width,height:canvas.height,marks,fonts:Array.from(document.fonts,font=>({family:font.family,status:font.status}))};});
    assert.ok(rendered.marks>40,'ordinary/raster PDF canvas contains visible fixture marks');
    if(kind==='ordinary'&&theme==='light'&&currentSetup==='100%'&&await page.evaluate(()=>state.view==='desk'))await capture('font-visual-pdf');
    assert.equal(await frame.locator('#previous-page').getAttribute('aria-label'),'Previous page');
    if(kind==='ordinary') {await enter(frame.locator('#next-page'));await frame.waitForFunction(()=>document.querySelector('#page-status').textContent.includes('2 /'));await enter(frame.locator('#previous-page'));await frame.waitForFunction(()=>document.querySelector('#page-status').textContent.includes('1 /'));}
    assert.ok(await frame.locator('#previous-page').isDisabled());
    if(await page.evaluate(()=>matchMedia('(forced-colors: active)').matches)) {
      const gray=await frame.evaluate(()=>{const e=document.createElement('span');e.style.setProperty('color','GrayText','important');document.body.append(e);const color=getComputedStyle(e).color;e.remove();return color;});
      assert.equal(await frame.locator('#previous-page').evaluate(e=>getComputedStyle(e).color),gray,'disabled system GrayText');
    }
    // Sequential Tab enters the separate-origin iframe, then exits back to a
    // host dialog control; do not infer this from an accessibility snapshot.
    await page.locator('#pdf-dialog').focus();let entered=false,exited=false;
    for(let i=0;i<45;i++){await page.keyboard.press('Tab');const active=await page.evaluate(()=>document.activeElement.id);if(active==='pdf-frame')entered=true;else if(entered){exited=true;break;}}
    assert.ok(entered&&exited,'keyboard iframe entry and exit');
    if(await frame.locator('#text-mode').getAttribute('aria-pressed')!=='true') await enter(frame.locator('#text-mode'));
    assert.equal(await frame.locator('#text-mode').getAttribute('aria-pressed'),'true');await frame.locator('.page-text h2').first().waitFor({state:'visible'});await frame.locator('#text-query:not([disabled])').waitFor();
    if(kind==='scan') {assert.match(await frame.locator('#pdf-pages').innerText(),/no.*text|OCR/i);await frame.locator('#text-query').fill('token');await frame.locator('#text-query').press('Enter');assert.match(await frame.locator('#text-status').innerText(),/No matches in extracted text/);}
    else {
      await keyboard(frame.locator('#text-query'));await frame.locator('#text-query').fill('token');await frame.locator('#text-query').press('Enter');await frame.waitForFunction(()=>document.activeElement.tagName==='MARK');
      const first=await frame.evaluate(()=>document.activeElement.textContent);assert.match(first,/token/i);await enter(frame.locator('#text-find'));await frame.waitForFunction(()=>document.activeElement.tagName==='MARK');
      assert.match(await frame.locator('#text-status').innerText(),/\d/);
      if(kind==='columns')assert.equal(await frame.locator('.page-text-content').first().innerText(),'Left column token one\nLeft column token two\nRight column token three','fixture extraction preserves its authored stream order');
    }
    await fits();await fits(frame);assert.ok(await frame.locator('#document-scroll').evaluate(e=>e.clientHeight>=40));assert.ok(await frame.locator('#zoom-in').isDisabled(),'PDF visual zoom disabled in text mode');
    for(const selector of ['#pdf-read-toggle','#pdf-favourite-toggle']) {const old=await page.locator(selector).getAttribute('aria-pressed');await enter(page.locator(selector));assert.notEqual(await page.locator(selector).getAttribute('aria-pressed'),old);await enter(page.locator(selector));}
    assert.ok(await page.evaluate(()=>document.querySelector('.pdf-bar strong').getBoundingClientRect().bottom<=document.querySelector('.pdf-actions').getBoundingClientRect().top+1),'PDF title and actions do not overlap');
    await keyboard(page.locator('.pdf-close'));
    evidence.push({theme,pages:await frame.locator('.pdf-page').count(),text:await frame.locator('.page-text-content').allTextContents(),readingHeight:await frame.locator('#document-scroll').evaluate(e=>e.clientHeight),rendered});
  }
  if(currentSetup==='400% + spacing'&&await page.evaluate(()=>state.view==='desk'))await capture('400-spacing-pdf');
  const windowGeometry=await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio}));
  await enter(page.locator('.pdf-close'));await settled();assert.ok(await returnOpener.evaluate(e=>document.activeElement===e),'PDF restores underlying view opener');
  return {palettes:evidence,window:windowGeometry,host:hostGeometry};
}
async function zoom(value) {
  const actual=await worker.evaluate(async value=>{const [tab]=await chrome.tabs.query({url:'http://127.0.0.1/*'});if(!tab||new URL(tab.url).port!=='4173')throw Error('selected local preview tab required');await chrome.tabs.setZoomSettings(tab.id,{mode:'automatic',scope:'per-tab'});await chrome.tabs.setZoom(tab.id,value);return {ratio:await chrome.tabs.getZoom(tab.id),settings:await chrome.tabs.getZoomSettings(tab.id)};},value);
  assert.ok(Math.abs(actual.ratio-value)<1e-10,`browser reports requested ratio ${actual.ratio}`);await page.waitForFunction(value=>Math.abs(devicePixelRatio-value)<.01,value);
  const geometry=await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,rect:document.querySelector('#main-content').getBoundingClientRect().width,cssZoom:getComputedStyle(document.documentElement).zoom}));
  assert.ok(Math.abs(geometry.width-1440/value)<=1);assert.equal(geometry.cssZoom,'1');console.log('ZOOM_RESULT '+JSON.stringify({...actual,...geometry}));return {...actual,...geometry};
}
try {
  await context.route('**/archived-references/md/**',r=>r.fulfill({contentType:'text/plain',body:markdown}));
  let pdfKind='ordinary';
  await context.route('**/archived-references/pdf/**',r=>{const pdf=pdfFixture(pdfKind);return r.fulfill({contentType:'application/pdf',headers:{'access-control-allow-origin':'*','content-length':String(pdf.length)},body:pdf});});
  await context.route('**/__accessibility-spacing.css',r=>r.fulfill({contentType:'text/css',body:spacing}));
  await page.goto(url+'#desk');await page.locator('.discovery-record').first().waitFor();await settled();await page.waitForFunction(()=>discoveryLoadState().missing.length===0);
  console.log('Browser: Chromium '+context.browser().version());
  // Establish actual browser zoom before running the action matrix.
  for(const value of [1,2,4,1]) await zoom(value);
  // Seed one known ordinary record by keyboard, then only disposable-profile
  // state resets are used between matrix rows.
  const seed=await page.evaluate(()=>state.items.find(i=>i.mdPath&&i.pdfPath));
  await page.evaluate(id=>{window.caseSeedId=id;state.items.forEach(i=>{i.read=false;i.favourite=false});},seed.id);
  await artifact('desk');await enter(page.locator('#artifact-read-toggle'));await enter(page.locator('#artifact-favourite-toggle'));await page.keyboard.press('Escape');await settled();
  await record(1,'skip link','100%',async()=>{await page.locator('.skip-link').focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'main-content');});
  if(process.env.WEBSEC_CASE_PRESSED_CONTRAST==='1'){await pressedContrastProbe();}else{
  const setups=[{name:'100%',zoom:1},{name:'200%',zoom:2},{name:'400%',zoom:4},{name:'100% + spacing',zoom:1,spacing:true},{name:'200% + spacing',zoom:2,spacing:true},{name:'400% + spacing',zoom:4,spacing:true},{name:'forced colours / light',zoom:1,forced:'light'},{name:'forced colours / dark',zoom:1,forced:'dark'},{name:'320px narrow',zoom:1,narrow:true}];
  const startSetup=process.env.WEBSEC_CASE_START_SETUP||setups[0].name,startView=process.env.WEBSEC_CASE_START_VIEW||views[0],endSetup=process.env.WEBSEC_CASE_END_SETUP||setups.at(-1).name;
  const measurementOnly=process.env.WEBSEC_CASE_MEASURE_ONLY==='1';
  assert.ok(!measurementOnly||(startSetup==='100%'&&endSetup==='100%'),'measurement probe limited to baseline');
  assert.ok(setups.some(s=>s.name===startSetup)&&setups.some(s=>s.name===endSetup)&&views.includes(startView),'fixed resume selectors');
  console.log('CASE_SELECTION '+JSON.stringify({startSetup,startView,endSetup}));
  for(const setup of setups) {
    if(setups.indexOf(setup)<setups.findIndex(s=>s.name===startSetup))continue;
    if(setups.indexOf(setup)>setups.findIndex(s=>s.name===endSetup))break;
    currentSetup=setup.name;
    await page.setViewportSize({width:1440,height:1000});const zoomEvidence=await zoom(setup.zoom);
    await page.emulateMedia({forcedColors:setup.forced?'active':'none',colorScheme:setup.forced||'light',reducedMotion:'reduce'});
    if(setup.narrow)await page.setViewportSize({width:320,height:568});
    const style=setup.spacing?await page.addStyleTag({content:spacing}):null;
    for(const view of views) {
      if(setup.name===startSetup&&views.indexOf(view)<views.indexOf(startView))continue;
      await page.evaluate(()=>{const i=state.items.find(i=>i.id===window.caseSeedId);setReadState(i,true);setFavouriteState(i,true);});
      await record(1,view,setup.name,()=>chooseView(view));
      if(measurementOnly){await record(18,view,setup.name,measureReadability);if(view==='constellation')await record(7,view,setup.name,async()=>{const opener=await viewAction(view);await escape('artifact-dialog',opener);return {actualKeys:'Home/End/PageUp/PageDown/Enter/Escape',zoom:zoomEvidence};});continue;}
      let opener;
      await record({evidence:2,museum:3,library:4,time:5,signals:6,constellation:7,terminal:8,favourites:9,desk:10}[view],view,setup.name,async()=>{opener=await viewAction(view);await escape('artifact-dialog',opener);return {zoom:zoomEvidence};});
      await record(18,view,setup.name,measureReadability);
      if(!(process.env.WEBSEC_CASE_FIRST_COMPONENT==='pdf'&&setup.name===startSetup&&view===startView)){
      const readerOpener=await artifact(view);
      await record(11,view,setup.name,async()=>({palettes:await markdownReader(view,readerOpener),returnFocus:'underlying view artifact; detail closes during reader handoff'}));
      }
      if(view==='desk')await record(11,'desk direct Read',setup.name,async()=>{const direct=page.locator('.discovery-record [data-discovery-action="read"]').first();return {palettes:await markdownReader(view,direct,true),returnFocus:'exact direct Read action after read-state partial refresh'};});
      const originalViewport=page.viewportSize();
      if(await page.evaluate(()=>innerWidth>820))await page.setViewportSize({width:720,height:1000});
      const pdfOpener=await artifact(view);
      pdfKind='ordinary';await record(12,view,setup.name,async()=>({fixture:pdfKind,palettes:await pdfReader(pdfKind,!!setup.spacing,pdfOpener)}));
      await page.setViewportSize(originalViewport);
      if(await page.locator('#artifact-dialog').evaluate(e=>e.open)){await page.keyboard.press('Escape');await settled();}
    }
    if(await page.locator('#mobile-menu').isVisible())await record(1,'mobile menu',setup.name,async()=>{await enter(page.locator('#mobile-menu'));assert.equal(await page.locator('#mobile-menu').getAttribute('aria-expanded'),'true');await enter(page.locator('#close-mobile-menu'));assert.ok(await page.locator('#mobile-menu').evaluate(e=>e===document.activeElement));await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>!document.querySelector('#concept-sidebar').contains(document.activeElement)));});
    await style?.evaluate(e=>e.remove());
  }
  await page.setViewportSize({width:1440,height:1000});await zoom(1);await page.emulateMedia({forcedColors:'none',colorScheme:'light'});
  await page.setViewportSize({width:720,height:1000});await chooseView('desk');
  for(const kind of measurementOnly?['ordinary']:['columns','scan']) {pdfKind=kind;const opener=await artifact('desk');await record(12,'PDF '+kind,'100%',async()=>({fixture:kind,palettes:await pdfReader(kind,false,opener)}));}
  await record(9,'removed reader opener','100%',async()=>{
    await page.evaluate(()=>{const i=state.items.find(i=>i.id===window.caseSeedId);setReadState(i,true);setFavouriteState(i,true);});
    await chooseView('favourites');await enter(page.locator('[data-saved-mode="read"]'));
    const opener=await artifact('favourites');const id=await page.evaluate(()=>artifactCurrentId);
    await enter(page.locator('#open-reader'));await page.locator('#reader-content h2').waitFor();
    await enter(page.locator('#reader-read-toggle'));await page.keyboard.press('Escape');await settled();
    assert.equal(await page.locator(`#view-root [data-artifact="${id}"]`).count(),0,'unread record removed from read filter');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'main-content','removed opener falls back to main after route restoration');
    await page.evaluate(id=>setReadState(state.items.find(i=>i.id===id),true),id);
    return {id,focus:'main-content'};
  });
  await page.setViewportSize({width:1440,height:1000});
  await record(15,'recovery','100% no spacing no forced colours',async()=>{assert.equal(await page.evaluate(()=>devicePixelRatio),1);assert.ok(await page.evaluate(()=>!matchMedia('(forced-colors: active)').matches));assert.ok(await page.evaluate(()=>parseFloat(getComputedStyle(document.querySelector('#main-content')).letterSpacing)||0)<1);await chooseView('desk');await viewAction('desk');return {zoom:await zoom(1)};});
  assert.equal(fontDiagnostics.size,0,'installed PDF standard fonts are not blocked by reader CSP');
  console.log('PDF_FONT_RESPONSES '+JSON.stringify(fontResponses));
  assert.ok(fontResponses.some(r=>r.origin==='http://127.0.0.1:4174'&&/^\/webhacklist\/vendor\/pdfjs\/releases\/[a-f0-9]{64}\/web\/standard_fonts\/LiberationSans-Regular\.ttf$/.test(r.path)&&r.status===200&&r.type==='font'),'versioned standard font loads successfully from isolated reader origin');
  }
  console.log('CASE_SUMMARY '+JSON.stringify({browser:context.browser().version(),passed:results.length,results}));
} finally {await context.close();await rm(extension,{recursive:true,force:true});await rm(profile,{recursive:true,force:true});}
