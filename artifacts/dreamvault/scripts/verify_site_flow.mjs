import { chromium } from 'playwright';

const BASE_URL = 'https://dreamvault.vercel.app';
const results = [];

function record(step, ok, details = '') {
  results.push({ step, ok, details });
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${step}${details ? ` | ${details}` : ''}`);
}

async function safeStep(step, fn) {
  try {
    await fn();
    record(step, true);
  } catch (error) {
    record(step, false, error?.message || String(error));
  }
}

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await safeStep('Open homepage', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      const title = await page.title();
      if (!title.toLowerCase().includes('dreamvault')) {
        throw new Error(`Unexpected title: ${title}`);
      }
    });

    await safeStep('Login navigation works', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
      await page.click('[data-testid="button-nav-login"]');
      await page.waitForTimeout(600);
      if (!page.url().includes('/login')) {
        throw new Error(`URL after login click: ${page.url()}`);
      }
    });

    await safeStep('Login page controls work', async () => {
      await page.click('[data-testid="button-toggle-password"]');
      await page.click('[data-testid="button-connect-wallet-login"]');
      await page.waitForTimeout(900);
    });
    await safeStep('Back to home route', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
    });

    await safeStep('Hero CTA buttons are clickable', async () => {
      await page.click('[data-testid="button-generate-dream"]');
      await page.waitForTimeout(500);
      await page.click('[data-testid="button-explore-gallery"]');
      await page.waitForTimeout(500);
    });

    await safeStep('Dream generation flow reaches result actions', async () => {
      await page.fill('[data-testid="input-dream-text"]', 'I dreamed of a crystalline city floating over a violet ocean.');
      await page.click('[data-testid="button-category-Fantasy"]');
      await page.click('[data-testid="button-generate-submit"]');

      // Wait for loading + reveal sequence to finish
      await page.waitForSelector('[data-testid="button-mint-nft"]', { timeout: 50000 });
      await page.waitForSelector('[data-testid="button-regenerate"]', { timeout: 10000 });
    });

    await safeStep('Dream result action buttons are interactive', async () => {
      await page.click('[data-testid="button-share-dream"]');
      await page.waitForTimeout(300);
      await page.click('[data-testid="button-regenerate"]');
      await page.waitForTimeout(1200);
      await page.waitForSelector('[data-testid="input-dream-text"]', { timeout: 10000 });
    });

    await safeStep('Gallery interaction buttons work', async () => {
      await page.click('[data-testid="button-explore-gallery"]');
      await page.waitForTimeout(800);
      await page.click('[data-testid="button-like-0"]');
      await page.click('[data-testid="button-view-universe-0"]');
      await page.waitForTimeout(500);
    });

    await safeStep('Navbar wallet connect button works', async () => {
      await page.click('[data-testid="button-connect-wallet"]');
      await page.waitForTimeout(600);
    });

    await page.screenshot({ path: '/workspaces/Colosseum-Frontier-hackathon/artifacts/dreamvault/scripts/flow-check.png', fullPage: true });
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => !r.ok);
  console.log('\n=== FLOW SUMMARY ===');
  console.log(JSON.stringify({ total: results.length, passed: results.length - failed.length, failed: failed.length, failedSteps: failed }, null, 2));

  if (failed.length > 0) process.exit(2);
})();
