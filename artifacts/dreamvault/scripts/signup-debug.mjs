import { chromium } from 'playwright';

(async ()=>{
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  page.on('console', msg => console.log('[console]', msg.text()));
  page.on('pageerror', err => console.log('[pageerror]', err.message));

  const base = 'https://dreamvault.vercel.app';
  await page.goto(base + '/signup', { waitUntil: 'networkidle' });
  console.log('url', page.url());

  // fill step 0
  await page.fill('[data-testid="input-username"]', 'e2eTester');
  const email = `e2e+${Date.now()}@example.com`;
  await page.fill('[data-testid="input-email-signup"]', email);
  await page.waitForTimeout(400);
  await page.click('[data-testid="button-next-step"]');
  await page.waitForTimeout(800);

  // step 1 - password
  await page.fill('[data-testid="input-password-signup"]', 'Password123!');
  await page.fill('[data-testid="input-confirm-password"]', 'Password123!');
  await page.waitForTimeout(400);
  await page.click('[data-testid="button-next-step"]');
  await page.waitForTimeout(1200);

  // step 2 - category
  const cat = await page.locator('[data-testid^="button-category-"]').first().getAttribute('data-testid').catch(()=>null);
  if(cat) {
    await page.click(`[data-testid="${cat}"]`);
  }
  await page.waitForTimeout(300);

  // click create (button-next-step should be create on step 2)
  await page.click('[data-testid="button-next-step"]');

  // wait for either success (complete) or error message
  try {
    await page.waitForSelector('[data-testid="signup-error-message"]', { timeout: 8000 });
    const err = await page.textContent('[data-testid="signup-error-message"]');
    console.log('SIGNUP_ERROR:', err?.trim());
  } catch {
    // no error message, check for completion
    const complete = await page.locator('text=Universe Created').count();
    console.log('COMPLETE_COUNT', complete);
  }

  await browser.close();
  process.exit(0);
})();