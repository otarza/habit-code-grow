// Local-only UI checks for /ai-starter against the Vite dev server.
// Blocks every external request (Flitt, YouTube, pixels), so nothing is paid,
// emailed or tracked. Usage: npm run dev, then node scripts/smoke-ai-starter.mjs
import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const origin = process.env.STARTER_TEST_ORIGIN || 'http://localhost:8080';
const output = '/tmp/bitcamp-starter-qa';
fs.mkdirSync(output, { recursive: true });

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', r => r.url().startsWith(origin + '/') || r.url().startsWith('data:') ? r.continue() : r.abort());
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Reduced motion makes the price countdown and scrolling instant and deterministic.
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  // Record analytics calls locally (the real pixel script is blocked anyway).
  const recordEvents = () => page.evaluate(() => {
    window.__events = [];
    window.fbq = (...args) => window.__events.push(args[1]);
    window.gtag = () => {};
  });

  const visibleCard = () => page.evaluateHandle(() =>
    [...document.querySelectorAll('.campaign-buy-anchor')].find(el => el.offsetParent !== null));
  const cardText = async (selector) => (await visibleCard()).evaluate((card, s) => card.querySelector(s)?.textContent ?? null, selector);
  const clickInCard = async (selector) => (await visibleCard()).evaluate((card, s) => card.querySelector(s).click(), selector);
  const events = () => page.evaluate(() => window.__events);
  const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);

  for (const width of [1440, 390, 320]) {
    await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
    await page.goto(`${origin}/ai-starter`, { waitUntil: 'networkidle0' });
    await recordEvents();
    assert.equal(await page.title(), 'AI Starter — პირველი ნაბიჯები AI-ში | BitCamp');

    // Before activation: promo is the primary action, full-price buy is secondary, no email field.
    assert.equal(await page.$eval('.campaign-sticky-cta strong', el => el.textContent), '₾249');
    assert(await cardText('.starter-promo-call'), 'promo button visible in card');
    assert.equal(await (await visibleCard()).evaluate(c => c.querySelector('button[type=submit]').classList.contains('starter-cta--secondary')), true);
    assert.equal(await page.$$eval('.campaign-inline-checkout__email input', els => els.length), 0);
    assert((await cardText('.starter-assurances')).includes('5-დღიანი გარანტია'));
    assert((await cardText('.campaign-offer-promo .starter-countdown')).includes('შეთავაზება სრულდება 18 ოქტომბერს · დარჩა '));

    // Buying at full price first shows the in-card discount prompt.
    await clickInCard('button[type=submit]');
    assert((await cardText('.starter-nudge')).includes('მოიცა! შენ გაქვს ₾170 ფასდაკლება'));
    await clickInCard('.starter-nudge__activate');
    await page.waitForSelector('.starter-promo-applied');
    assert.equal(await page.$eval('.campaign-sticky-cta strong', el => el.textContent), '₾79');
    assert(await page.$$eval('.campaign-price__current .sr-only', els => els.every(el => el.textContent === '₾79')));
    assert.equal(await cardText('button[type=submit] span'), 'შეიძინე AI Starter — ₾79');

    // Email step: invalid email blocks checkout, valid email opens the inline checkout.
    await clickInCard('button[type=submit]');
    assert.equal(await cardText('.campaign-inline-checkout__error'), 'შეიყვანე სწორი ელ. ფოსტა');
    const input = await (await visibleCard()).evaluateHandle(c => c.querySelector('input[type=email]'));
    await input.type('starter-test@example.invalid');
    await clickInCard('button[type=submit]');
    await page.waitForSelector('.campaign-inline-checkout');
    assert((await cardText('.campaign-inline-checkout__summary')).includes('starter-test@example.invalid'));
    assert.equal(await page.$$('[role="dialog"]').then(d => d.length), 0, 'no checkout modal');
    assert(await noOverflow(), 'horizontal overflow');
    await page.screenshot({ path: `${output}/${width}.png`, fullPage: true });

    const fired = await events();
    for (const name of ['StarterPromoNudgeShown', 'StarterPromoActivated', 'StarterPromoNudgeChoice', 'InitiateCheckout', 'Lead']) {
      assert(fired.includes(name), `event ${name}`);
    }
    console.log(`${width}px: promo-first nudge, 249→79, email validation, inline checkout, events, no overflow`);
  }

  // Course preview: 31 lessons, 3 free previews, locked rows lead to the offer.
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(`${origin}/ai-starter`, { waitUntil: 'networkidle0' });
  await recordEvents();
  assert.equal(await page.$$eval('#starter-curriculum .starter-curriculum__lesson', els => els.length), 31);
  assert.equal(await page.$$eval('#starter-curriculum button.is-preview', els => els.length), 3);
  assert.equal(await page.$$eval('#starter-curriculum button.is-locked', els => els.length), 28);
  await page.$eval('#starter-curriculum button.is-preview .starter-curriculum__title', el => el.click());
  await page.waitForSelector('#starter-curriculum .starter-curriculum__player iframe');
  await page.$eval('#starter-curriculum button.is-locked', el => el.click());
  await page.waitForSelector('.campaign-buy-anchor.starter-offer--celebrate');
  assert.equal(await page.$$('.starter-promo-applied').then(e => e.length), 0, 'locked lesson does not auto-activate promo');
  const fired = await events();
  assert(fired.includes('StarterPreviewPlay') && fired.includes('StarterLockedLessonClick'));
  // Hero link and the #preview deep link open the first free lesson.
  await page.goto(`${origin}/ai-starter`, { waitUntil: 'networkidle0' });
  await page.$eval('.starter-preview-link', el => el.click());
  await page.waitForSelector('#starter-lesson-intro .starter-curriculum__player iframe');
  await page.goto(`${origin}/ai-starter#preview`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#starter-lesson-intro .starter-curriculum__player iframe');
  await page.$$eval('.campaign-faq__item button', els => els.at(-1).click());
  console.log('Curriculum: 31 lessons, 3 previews, 28 locked rows, preview player, locked → offer highlight, hero link + #preview open the intro lesson');

  // After the promo deadline the page must fall back to a plain 249 offer.
  const expired = await browser.newPage();
  await expired.setRequestInterception(true);
  expired.on('request', r => r.url().startsWith(origin + '/') || r.url().startsWith('data:') ? r.continue() : r.abort());
  expired.on('pageerror', error => errors.push(error.message));
  await expired.evaluateOnNewDocument(() => {
    const offset = Date.parse('2026-10-19T10:00:00+04:00') - Date.now();
    const realNow = Date.now.bind(Date);
    Date.now = () => realNow() + offset;
  });
  await expired.setViewport({ width: 1440, height: 1000 });
  await expired.goto(`${origin}/ai-starter`, { waitUntil: 'networkidle0' });
  const card = '.campaign-buy-anchor[data-slot="desktop"]';
  const state = await expired.evaluate(c => ({
    promoBar: !!document.querySelector('.campaign-promo-bar'),
    promoRow: !!document.querySelector(`${c} .campaign-offer-promo`),
    countdowns: document.querySelectorAll('.starter-countdown').length,
    price: document.querySelector(`${c} .campaign-price__current .sr-only`).textContent,
    secondary: document.querySelector(`${c} button[type=submit]`).classList.contains('starter-cta--secondary'),
    faq79: document.body.innerText.includes('როგორ მივიღო 79₾'),
    curriculumCta: document.querySelector('.starter-curriculum__cta button').innerText.trim(),
  }), card);
  assert.deepEqual(state, { promoBar: false, promoRow: false, countdowns: 0, price: '₾249', secondary: false, faq79: false, curriculumCta: 'შეიძინე AI Starter — ₾249' });
  await expired.$eval(`${card} button[type=submit]`, b => b.click());
  await expired.waitForSelector(`${card} input[type=email]`);
  assert.equal(await expired.$(`${card} .starter-nudge`), null, 'no discount prompt after deadline');
  await expired.close();
  console.log('After deadline: no promo bar/row/countdown/FAQ, plain 249 checkout without discount prompt');

  // Learning page with soft access; Pro stays gated.
  await page.goto(`${origin}/learn/ai-starter`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('input[type="email"]');
  await page.evaluate(() => {
    localStorage.setItem('bitcamp_soft_access_ai_starter', 'true');
    localStorage.setItem('bitcamp_soft_access_ai_starter_email', 'starter-test@example.invalid');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.querySelector('h1')?.textContent === 'AI Starter — 3 ვიდეომოდული');
  assert(!(await page.evaluate(() => document.body.innerText)).includes('მოდული 4 იტვირთება'));
  assert(await page.$('a[href="/learn/ai-starter/fundamentals/intro"]'), 'first lesson link');
  assert.equal(await page.$('a[href="/learn/ai-starter/fundamentals/course-usage"]'), null, 'removed lesson is gone');
  await page.screenshot({ path: `${output}/learning.png`, fullPage: true });
  await page.goto(`${origin}/learn/ai-starter/fundamentals/intro`, { waitUntil: 'networkidle0' });
  assert(!(await page.evaluate(() => document.body.innerText)).includes('კურსი ვერ მოიძებნა'));
  await page.goto(`${origin}/learn/ai-pro`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('input[type="email"]');
  console.log('Learning: Starter course and first lesson load; Pro stays gated');

  assert.deepEqual(errors, []);
  console.log(`PASS — screenshots in ${output}`);
} finally {
  await browser.close();
}
