import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const url = 'https://dreamvault.vercel.app';
  const result = { url };
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    // Wait a short while for client-side render
    await page.waitForTimeout(1200);

    const hasActivityFeed = await page.$eval('h4', el => el.textContent).catch(() => null);
    result.activityFeedText = hasActivityFeed || null;

    const hasConnectWallet = await page.$('[data-testid="button-connect-wallet"]')
      .then(el => !!el)
      .catch(() => false);
    result.connectWallet = hasConnectWallet;

    // Check for navbar presence
    const navExists = await page.$('nav')
      .then(el => !!el)
      .catch(() => false);
    result.nav = navExists;

    // Grab full page title
    result.title = await page.title();

    // Screenshot for quick visual confirmation
    await page.screenshot({ path: 'artifacts/dreamvault/scripts/snapshot.png', fullPage: false }).catch(() => {});

    console.log(JSON.stringify({ ok: true, result }, null, 2));
  } catch (err) {
    console.error(JSON.stringify({ ok: false, error: err.message }));
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
