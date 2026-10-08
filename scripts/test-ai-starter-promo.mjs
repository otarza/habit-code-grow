// Local browser checks only; no analytics, email or payment requests.
import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
const browser=await puppeteer.launch({headless:true});
try {
  const page=await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request',r=>r.url().startsWith('http://127.0.0.1:5174/')||r.url().startsWith('data:')?r.continue():r.abort());
  await page.evaluateOnNewDocument(()=>{
    const original=Element.prototype.scrollIntoView;
    window.promoScrollCalls=[];
    Element.prototype.scrollIntoView=function(options){
      window.promoScrollCalls.push({options,visible:this.offsetParent!==null,price:this.querySelector('.campaign-price__current')?.textContent});
      return original.call(this,options);
    };
  });
  for(const [width,selector,reduced] of [
    [1440,'.campaign-promo-bar button',false],
    [390,'.campaign-promo-bar button',false],
    [1440,'.campaign-final .campaign-promo-button',false],
    [390,'.campaign-hero__offer--inline .campaign-promo-button',false],
    [390,'.campaign-final .campaign-promo-button',true],
  ]) {
    await page.setViewport({width,height:900});
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:reduced?'reduce':'no-preference'}]);
    await page.goto('http://127.0.0.1:5174/ai-starter',{waitUntil:'networkidle0'});
    await page.click(selector);
    await page.waitForSelector('.campaign-promo-confetti');
    assert.equal(await page.$$eval('.campaign-promo-confetti span',els=>els.length),20);
    await page.waitForFunction(()=>window.promoScrollCalls.length===1);
    const call=await page.evaluate(()=>window.promoScrollCalls[0]);
    assert.deepEqual(call,{options:{behavior:reduced?'instant':'smooth',block:'center'},visible:true,price:'₾79'});
    assert.equal(await page.$eval('.campaign-promo-confetti span',el=>getComputedStyle(el).animationName),reduced?'none':'campaign-promo-confetti-pop');
    await page.waitForSelector('.campaign-promo-confetti',{hidden:true,timeout:3000});
    assert(await page.evaluate(()=>{
      const el=[...document.querySelectorAll('.campaign-hero .campaign-price__current')].find(el=>el.offsetParent!==null);
      const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;
    }),'Updated visible offer price is on screen');
    assert(await page.$$eval('.campaign-promo-button',els=>els.every(el=>el.disabled)));
    console.log(`PASS ${width}px ${selector}: updated price scrolled into view, confetti burst cleaned up, reduced-motion=${reduced}`);
  }
}finally{await browser.close();}
