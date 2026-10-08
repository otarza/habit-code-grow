// Local-only UI checks. Blocks external requests; does not submit a payment.
import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const origin = process.env.STARTER_TEST_ORIGIN || 'http://127.0.0.1:5174';
const output = '/tmp/bitcamp-starter-qa';
fs.mkdirSync(output, {recursive:true});
const browser = await puppeteer.launch({headless:true});
try {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', r => r.url().startsWith(origin + '/') || r.url().startsWith('data:') ? r.continue() : r.abort());
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for (const width of [1440,390,320]) {
    await page.setViewport({width,height:1000,deviceScaleFactor:1});
    await page.goto(`${origin}/ai-starter`,{waitUntil:'networkidle0'});
    assert.equal(await page.title(),'AI Starter — პირველი ნაბიჯები AI-ში | BitCamp');
    assert.equal(await page.$$eval('.campaign-module-card', els=>els.length),3);
    assert.equal(await page.$eval('.campaign-sticky-cta strong',el=>el.textContent),'₾249');
    await page.click('.campaign-promo-bar button');
    assert.equal(await page.$eval('.campaign-sticky-cta strong',el=>el.textContent),'₾79');
    assert(await page.$$eval('.campaign-price__current',els=>els.every(el=>el.textContent==='₾79')));
    assert(await page.$$eval('.campaign-promo-button',els=>els.every(el=>el.disabled)));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
    await page.screenshot({path:`${output}/${width}.png`,fullPage:true});
    const buttons = await page.$$('.campaign-hero .campaign-cta');
    for(const button of buttons) {
      if (await button.isVisible()) { await button.click(); break; }
    }
    await page.waitForSelector('[role="dialog"]');
    assert((await page.$eval('[role="dialog"]',el=>el.textContent)).includes('ონლაინ შეძენა ჯერ არ არის ხელმისაწვდომი'));
    await page.keyboard.press('Escape');
    await page.waitForSelector('[role="dialog"]',{hidden:true});
    await page.$eval('.campaign-faq__item:nth-child(4) button',el=>el.click());
    assert.equal(await page.$eval('.campaign-faq__item:nth-child(4) button',el=>el.getAttribute('aria-expanded')),'true');
    assert.equal(await page.$eval('#starter-faq-3',el=>el.hidden),false);
    console.log(`${width}px: layout, modules, 249→79 prices, activation, purchase guard, Escape and FAQ passed`);
  }
  // Exercise the actual checkout configuration without changing the launch gate,
  // sending an email, submitting a payment, or loading any external services.
  const details = await page.evaluate(async () => {
    const {handleBuy, PRODUCTS, STARTER_PROMO_CHECKOUT} = await import('/src/lib/checkout.ts');
    const events=[];
    const listener = event => events.push(event.detail);
    window.addEventListener('flitt:open',listener);
    handleBuy('starter');
    handleBuy('starter',STARTER_PROMO_CHECKOUT);
    window.removeEventListener('flitt:open',listener);
    return {events, proButton: PRODUCTS.pro.buttonId};
  });
  assert.deepEqual(details.events.map(({product,buttonId,value})=>({product,buttonId,value})),[
    {product:'starter',buttonId:'8dd7438a4579ed39bd7ae731fb8b6f359a2aae58',value:249},
    {product:'starter',buttonId:'6e34b7a462c13603d26c45affbc44ae17bddf82d',value:79},
  ]);
  assert.equal(details.proButton,'811bb88862b6e4eb4b1a1bfdb86ba16cac23d8f8');
  await page.waitForSelector('[role="dialog"]');
  assert((await page.$eval('[role="dialog"]',el=>el.textContent)).includes('₾79'));
  assert.equal(await page.$eval('#campaign-modal-email',el=>el.value),'');
  await page.keyboard.press('Escape');
  console.log('Starter checkout events: dedicated 249/79 GEL buttons, correct product, promo modal, and unchanged Pro config passed; no email/payment submitted');
  await page.setViewport({width:1440,height:1000});
  await page.goto(`${origin}/learn/ai-starter`,{waitUntil:'networkidle0'});
  await page.waitForSelector('input[type="email"]');
  await page.evaluate(() => {
    localStorage.setItem('bitcamp_soft_access_ai_starter','true');
    localStorage.setItem('bitcamp_soft_access_ai_starter_email','starter-test@example.invalid');
  });
  await page.reload({waitUntil:'networkidle0'});
  await page.waitForFunction(()=>document.querySelector('h1')?.textContent==='AI Starter — 3 ვიდეომოდული');
  assert(!(await page.evaluate(()=>document.body.innerText)).includes('მოდული 4 იტვირთება'));
  const lessonLink=await page.$('a[href="/learn/ai-starter/fundamentals/intro"]');
  assert(lessonLink,'Starter lesson navigation exists');
  await page.screenshot({path:`${output}/learning.png`,fullPage:true});
  await page.goto(`${origin}/learn/ai-starter/fundamentals/intro`,{waitUntil:'networkidle0'});
  assert(!(await page.evaluate(()=>document.body.innerText)).includes('კურსი ვერ მოიძებნა'));
  await page.goto(`${origin}/learn/ai-pro`,{waitUntil:'networkidle0'});
  await page.waitForSelector('input[type="email"]');
  console.log('Starter learning route and first lesson load; Pro remains separately gated in the normal UI');
  assert.deepEqual(errors,[]);
} finally { await browser.close(); }
