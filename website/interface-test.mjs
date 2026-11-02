import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {launchBrowser} from "./browser-test.mjs";
const browser = await launchBrowser();
const base = process.env.WEBSEC_TEST_URL || "http://127.0.0.1:8000/website/";
const views = ["evidence","museum","library","time","signals","constellation","terminal","desk","favourites"];
const errors = [];
const page = await browser.newPage({viewport:{width:1440,height:1000}});
page.on("pageerror",e=>errors.push(e.message));
page.on("console",m=>{if(m.type()==="error") errors.push(m.text());});
async function command(value) {
  await page.locator("#terminal-command").fill(value);
  await page.locator(".terminal-run").click();
  await page.waitForFunction(()=>!state.terminalBusy);
}
const axeSource = process.env.AXE_SOURCE ? await readFile(process.env.AXE_SOURCE,"utf8") : "";
async function terminalAudit(label) {
  if (!axeSource) return;
  await page.evaluate(axeSource);
  const result = await page.evaluate(()=>axe.run(".hacker-terminal",{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa","wcag22aa"]}}));
  assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,reason:n.failureSummary}))})),[],label);
}
try {
  await page.goto(`${base}#desk`);
  await page.waitForSelector(".discovery-record");
  await page.waitForFunction(()=>!document.querySelector("#boot-screen"));
  // A visitor can start a header search before the terminal's first animation
  // frame. Its deferred autofocus must respect that newer focus choice.
  await page.evaluate(async () => {
    await setView("terminal");
    document.querySelector("#global-search").focus();
    await new Promise(requestAnimationFrame);
  });
  assert.equal(await page.evaluate(()=>document.activeElement.id),"global-search","terminal opening preserves a newer header-search focus");
  await page.keyboard.type("HTTP");
  await page.waitForSelector("#global-results:not([hidden])");
  assert.equal(await page.locator("#global-search").inputValue(),"HTTP");
  assert.equal(await page.locator("#terminal-command").inputValue(),"","header-search typing never enters the terminal");
  await page.locator("#close-global-results").click();
  await page.evaluate(()=>setView("desk"));
  console.log("Terminal: opening autofocus preserves a newer header search and its typing");
  for (const viewport of [{width:1440,height:1000},{width:1440,height:700},{width:390,height:844},{width:320,height:568}]) {
    await page.setViewportSize(viewport);
    let expected;
    for (const view of views) {
      await page.evaluate(view=>setView(view),view);
      if (viewport.width <= 820) await page.locator("#mobile-menu").click();
      await page.locator("#concept-sidebar").evaluate(el=>{el.scrollTop=0;});
      const geometry = await page.evaluate(()=>{
        const sidebar = document.querySelector("#concept-sidebar");
        const first = document.querySelector(".nav-item");
        return [...document.querySelectorAll(".nav-item")].map(el=>({
          view:el.dataset.view,index:el.querySelector(".nav-index").textContent,
          top:Math.round((el.offsetTop-first.offsetTop)*100)/100,height:el.offsetHeight,width:el.offsetWidth,
          font:getComputedStyle(el.querySelector("strong")).fontSize,subfont:getComputedStyle(el.querySelector("em")).fontSize,
          start:first.offsetTop-sidebar.offsetTop
        }));
      });
      assert.deepEqual(geometry.map(g=>g.view),views);
      assert.deepEqual(geometry.map(g=>g.index),views.map((_,i)=>String(i+1).padStart(2,"0")));
      const kicker = await page.locator("#view-kicker").textContent();
      assert.ok(kicker.includes(String(views.indexOf(view)+1).padStart(2,"0")),`${view} heading number agrees`);
      expected ??= geometry;
      assert.deepEqual(geometry,expected,`${view} sidebar geometry at ${viewport.width}x${viewport.height}`);
      if (viewport.width <= 820) await page.locator("#close-mobile-menu").click();
    }
  }
  console.log("Sidebar: requested order, sequential numbering and identical spacing/fonts in all 9 views at 4 viewport sizes pass");

  await page.setViewportSize({width:1440,height:1000});
  await page.goto(`${base}#terminal`);
  await page.waitForSelector("#terminal-command");
  await page.waitForFunction(()=>!document.querySelector("#boot-screen"));
  await terminalAudit("Terminal welcome accessibility");
  assert.notEqual(await page.locator("#terminal-command").evaluate(el=>getComputedStyle(el).caretColor),"rgba(0, 0, 0, 0)");
  await command("echo hello archive");
  assert.ok((await page.locator("#terminal-output").innerText()).includes("hello archive"));
  await page.locator("#terminal-command").fill("draft to keep");
  await page.locator("#terminal-command").press("ArrowUp");
  assert.equal(await page.locator("#terminal-command").inputValue(),"echo hello archive");
  await page.locator("#terminal-command").press("ArrowDown");
  assert.equal(await page.locator("#terminal-command").inputValue(),"draft to keep");
  await page.locator("#terminal-command").fill("he");
  await page.locator("#terminal-command").press("Tab");
  assert.equal(await page.locator("#terminal-command").inputValue(),"help");
  assert.equal(await page.evaluate(()=>document.activeElement.id),"terminal-command");
  await page.locator("#terminal-command").press("Tab");
  assert.equal(await page.evaluate(()=>document.activeElement.className),"terminal-run");
  await page.keyboard.press("Shift+Tab");
  assert.equal(await page.evaluate(()=>document.activeElement.id),"terminal-command");
  await page.locator("#terminal-command").fill("gr");
  await page.locator("#terminal-complete").click();
  assert.equal(await page.locator("#terminal-command").inputValue(),"grep");
  await page.locator("[data-term-fill]").click();
  assert.equal(await page.locator("#terminal-command").inputValue(),"grep ");
  await command("grep HTTP");
  assert.ok(await page.locator(".term-row").count());
  await terminalAudit("Terminal search results accessibility");
  await page.selectOption("#terminal-collection","2024");
  await page.waitForFunction(()=>!state.terminalBusy);
  assert.ok((await page.locator("#terminal-output").innerText()).includes("2024"));
  await page.locator('.terminal-shortcuts [data-term-command="help"]').click();
  await page.waitForFunction(()=>!state.terminalBusy);
  assert.ok(await page.locator(".terminal-man").count());
  await terminalAudit("Terminal help accessibility");
  await command("not-a-command");
  assert.ok((await page.locator(".term-error").last().innerText()).includes("command not found"));
  await command("echo recovered");
  assert.ok((await page.locator("#terminal-output").innerText()).includes("recovered"));
  await page.locator("#terminal-command").fill("unfinished query");
  await page.evaluate(()=>setView("desk"));
  await page.evaluate(()=>setView("terminal"));
  assert.equal(await page.locator("#terminal-command").inputValue(),"unfinished query");
  await page.locator('.terminal-shortcuts [data-term-command="clear"]').click();
  await page.waitForFunction(()=>!state.terminalBusy);
  assert.equal(await page.locator(".term-echo").count(),0);
  await page.setViewportSize({width:320,height:568});
  await terminalAudit("Terminal mobile accessibility");
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  console.log("Terminal: Run, search, collection browsing, history/draft restoration, completion, Tab escape, help, errors, clear and mobile accessibility pass");

  // Delay a collection while changing views: a completed command must never
  // overwrite another theme, and duplicate commands must not race each other.
  const pending = await browser.newContext();
  let release;
  const gate = new Promise(resolve=>{release=resolve;});
  await pending.route("**/data/collections/2024.json*",async route=>{await gate;await route.continue();});
  const late = await pending.newPage();
  late.on("pageerror",e=>errors.push(e.message));
  await late.goto(`${base}#terminal`);
  await late.waitForSelector("#terminal-command");
  await late.evaluate(()=>{runTerminalCommand("ls /2024");runTerminalCommand("echo duplicate");});
  assert.equal(await late.evaluate(()=>state.terminalBusy),true);
  assert.ok(await late.locator(".terminal-run").isDisabled());
  await late.evaluate(()=>setView("museum"));
  release();
  await late.waitForFunction(()=>!state.terminalBusy);
  assert.equal(await late.locator("html").getAttribute("data-view"),"museum");
  assert.equal(await late.locator(".hacker-terminal").count(),0);
  assert.equal(await late.evaluate(()=>state.terminalHistory.includes("echo duplicate")),false);
  await pending.close();
  console.log("Terminal: a pending command preserves the active route and duplicate submissions are blocked");
  assert.deepEqual(errors,[]);
} finally {await browser.close();}
