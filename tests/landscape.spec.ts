import { expect, test } from '@playwright/test';

test('hero content and 3D controls fit shorter desktop landscape windows', async ({ page }) => {
  await page.goto('/Resume/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('button', { name: 'Pause motion' })).toBeEnabled();
  for (const [width, height] of [[1024, 600], [1280, 720], [1366, 640], [1536, 730]]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => scrollTo(0, 0));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    for (const selector of ['h1', '.hero-actions', '.hero-facts', '.scene-bottom', '.scroll-cue']) {
      const box = (await page.locator(selector).boundingBox())!;
      expect(box.y + box.height, `${selector} below the fold at ${width}×${height}`).toBeLessThanOrEqual(height);
    }
  }
});

test('QHD and scaled desktop layouts use the width and keep navigation aligned', async ({ page }) => {
  await page.goto('/Resume/');
  for (const [width, height] of [[1920, 900], [2048, 1050], [2560, 1320]]) {
    await page.setViewportSize({ width, height });
    const hero = (await page.locator('.hero').boundingBox())!;
    const header = (await page.locator('.header-inner').boundingBox())!;
    const scene = (await page.locator('.hero-visual').boundingBox())!;
    const copy = (await page.locator('.hero-copy').boundingBox())!;
    expect(hero.width).toBeGreaterThan(width * .65);
    expect(Math.abs(header.x - hero.x)).toBeLessThan(1);
    expect(copy.x + copy.width).toBeLessThan(scene.x);
    expect(scene.y + scene.height).toBeLessThan(height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('landscape project dialogs show media beside details and keep closing available while scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 640 });
  await page.goto('/Resume/');
  await page.getByRole('button', { name: 'View Virtual Forklift project details' }).click();
  const dialog = page.getByRole('dialog');
  const media = (await dialog.locator('.project-art').boundingBox())!;
  const details = (await dialog.locator('.dialog-content').boundingBox())!;
  const videoLink = (await dialog.getByRole('link').boundingBox())!;
  expect(media.x + media.width).toBeLessThanOrEqual(details.x + 1);
  expect(videoLink.y + videoLink.height).toBeLessThan(640);
  await page.setViewportSize({ width: 1366, height: 450 });
  await dialog.evaluate(d => d.scrollTop = d.scrollHeight);
  const closeButton = dialog.getByRole('button', { name: 'Close project' });
  const closeBox = (await closeButton.boundingBox())!;
  expect(closeBox.y).toBeGreaterThanOrEqual(0);
  expect(closeBox.y + closeBox.height).toBeLessThanOrEqual(450);
  await closeButton.click();
  await expect(dialog).not.toBeVisible();
});
