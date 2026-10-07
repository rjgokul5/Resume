import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('desktop, mobile navigation, and dialog pass automated accessibility checks', async ({ page }) => {
  await page.goto('/Resume/');
  await expect(page.getByRole('button', { name: 'Pause motion' })).toBeEnabled();
  const audit = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect((await audit()).violations).toEqual([]);
  await page.getByRole('button', { name: 'View Virtual Forklift project details' }).click();
  expect((await audit()).violations).toEqual([]);
  expect(await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
    return ids.filter((id, i) => ids.indexOf(id) !== i);
  })).toEqual([]);
  await page.getByRole('button', { name: 'Close project' }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  expect((await audit()).violations).toEqual([]);
});

test('200% text enlargement fits phone, tablet, and desktop layouts', async ({ page }) => {
  await page.goto('/Resume/');
  await page.evaluate(() => document.documentElement.style.fontSize = '200%');
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `Overflow at ${width}px`).toBeLessThanOrEqual(width);
    await page.getByRole('button', { name: 'View Virtual Forklift project details' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(await page.getByRole('dialog').evaluate(d => d.scrollWidth <= d.clientWidth)).toBeTruthy();
    await page.getByRole('button', { name: 'Close project' }).click();
  }
});

test('keyboard navigation focuses destinations and dialogs trap focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/Resume/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.getByRole('button', { name: 'Open navigation' }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#projects')).toBeFocused();
  await page.getByRole('button', { name: 'View Virtual Forklift project details' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close project' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  expect(await page.getByRole('dialog').evaluate(d => d.contains(document.activeElement))).toBeTruthy();
  await page.keyboard.press('Tab');
  expect(await page.getByRole('dialog').evaluate(d => d.contains(document.activeElement))).toBeTruthy();
});

test('returning to the hero clears the previous navigation highlight', async ({ page }) => {
  await page.goto('/Resume/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('navigation').getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute('aria-current', 'location');
  await page.getByRole('link', { name: 'Gokul RJ home' }).click();
  await expect(page.locator('.navigation [aria-current]')).toHaveCount(0);
});

test('3D context loss replaces the scene and removes ineffective controls', async ({ page }) => {
  await page.goto('/Resume/');
  await expect(page.getByRole('button', { name: 'Pause motion' })).toBeEnabled();
  await page.locator('canvas').evaluate(canvas => {
    const gl = (canvas as HTMLCanvasElement).getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  });
  await expect(page.locator('.core-fallback')).toBeVisible();
  await expect(page.getByText('Static preview', { exact: true })).toBeVisible();
  await expect(page.locator('.motion-button')).toHaveCount(0);
  await page.getByRole('button', { name: 'View Virtual Forklift project details' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('horizontal dragging rotates the paused 3D view', async ({ page }) => {
  await page.goto('/Resume/');
  await page.getByRole('button', { name: 'Pause motion' }).click();
  const canvas = page.locator('canvas');
  const box = (await canvas.boundingBox())!;
  const before = await canvas.screenshot();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect(async () => expect((await canvas.screenshot()).equals(before)).toBeFalsy()).toPass();
});

test('touch scrolling can start over the 3D scene', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/Resume/');
  await expect(page.getByRole('button', { name: 'Pause motion' })).toBeEnabled();
  const canvas = page.locator('canvas');
  await canvas.scrollIntoViewIfNeeded();
  expect(await canvas.evaluate(c => getComputedStyle(c).touchAction)).toBe('pan-y');
  const box = (await canvas.boundingBox())!;
  const x = box.x + box.width / 2;
  const y = Math.min(box.y + box.height / 2, 700);
  const initialScroll = await page.evaluate(() => scrollY);
  const session = await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let step = 1; step <= 10; step++) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - step * 18 }] });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialScroll + 30);
  await context.close();
});

test('visitors without JavaScript can read the summary and download the CV', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/Resume/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gokul RJ · Lead XR Engineer');
  await expect(page.getByRole('link', { name: 'LinkedIn', exact: true })).toBeVisible();
  const download = page.getByRole('link', { name: 'Download CV', exact: true });
  await expect(download).toBeVisible();
  const url = new URL((await download.getAttribute('href'))!, page.url()).href;
  const response = await context.request.get(url);
  expect((await response.body()).subarray(0, 4).toString()).toBe('%PDF');
  await context.close();
});
