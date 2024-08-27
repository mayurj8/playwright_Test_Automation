const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function createOrCompareScreenshot(page, screenshotName) {
    const screenshot = await page.screenshot();
    const browserName = page.context().browser().browserType().name();
    const osName = process.platform;
    const fullScreenshotName = `${screenshotName}-${browserName}-${osName}.png`;
    const baselinePath = path.resolve(__dirname, 'Assignment6.spec.js-snapshots', fullScreenshotName);
  
    if (!fs.existsSync(baselinePath)) {
      fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
      fs.writeFileSync(baselinePath, screenshot);
      console.log(`Baseline image created at ${baselinePath}`);
    } else {
      expect(screenshot).toMatchSnapshot(fullScreenshotName, {
        threshold: 0.2,
      });
    }
  }

  test.describe('Visual regression tests for Wikipedia', () => {
    test('Search for "Playwright testing"', async ({ page }) => {
      await page.goto('https://www.wikipedia.org', { waitUntil: 'networkidle' });
      await page.fill('input[name="search"]', 'Playwright testing');
      await page.press('input[name="search"]', 'Enter');
      await page.waitForSelector('#firstHeading');
      await createOrCompareScreenshot(page, 'wikipedia-search-results-playwright-testing');
    });

    test('Search for "Artificial Intelligence"', async ({ page }) => {
        await page.goto('https://www.wikipedia.org', { waitUntil: 'networkidle' });
        await page.fill('input[name="search"]', 'Artificial Intelligence');
        await page.press('input[name="search"]', 'Enter');
        await page.waitForSelector('#firstHeading');
        await createOrCompareScreenshot(page, 'wikipedia-search-results-artificial-intelligence');
      });
    
      test('Navigate to "Today\'s featured article"', async ({ page }) => {
        await page.goto('https://en.wikipedia.org/wiki/Main_Page', { waitUntil: 'networkidle' });
        await page.click('a[title="Wikipedia"]');
        await page.waitForSelector('#firstHeading');
        await createOrCompareScreenshot(page, 'wikipedia-todays-featured-article');
      });
    });