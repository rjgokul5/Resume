import { expect, test } from '@playwright/test';

test('production page loads, has a 3D canvas, and serves its PDF under the repository path', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/Resume/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Building worlds.');
  await expect(page.locator('canvas')).toBeVisible();
  expect(await page.locator('canvas').evaluate(c => (c as HTMLCanvasElement).width)).toBeGreaterThan(0);
  const href = await page.getByRole('link', { name: 'Download CV', exact: true }).getAttribute('href');
  const pdf = await request.get(new URL(href!, page.url()).href);
  expect(pdf.ok()).toBeTruthy();
  expect((await pdf.body()).subarray(0, 4).toString()).toBe('%PDF');
  await expect(page.getByRole('link', { name: 'Watch portfolio' })).toHaveAttribute('href', /youtube.com\/playlist/);
  expect(errors).toEqual([]);
});

test('project details support Escape, return focus, and additional projects', async ({ page }) => {
  await page.goto('/Resume/');
  const trigger = page.getByRole('button', { name: 'View Virtual Forklift project details' });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading')).toHaveText('Virtual Forklift');
  await expect(dialog).toContainText('steering-wheel');
  await expect(dialog.getByRole('link')).toHaveAttribute('href', /youtube.com\/playlist/);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'More projects' }).click();
  await page.getByRole('button', { name: /VR Clinical Training Unity/ }).click();
  await expect(dialog.getByRole('heading')).toHaveText('VR Clinical Training');
  await dialog.getByRole('button', { name: 'Close project' }).click();
  await expect(dialog).not.toBeVisible();
});

test('mobile navigation works and layouts do not overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/Resume/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#projects$/);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  }
});

test('motion can be paused and follows the system preference', async ({ page }) => {
  await page.goto('/Resume/');
  await page.getByRole('button', { name: 'Pause motion' }).click();
  await expect(page.getByRole('button', { name: 'Resume motion' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Resume motion' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('button', { name: 'Reduced motion' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Reduced motion' })).toHaveAttribute('aria-pressed', 'true');
});

test('WebGL failure preserves readable content and project interactions', async ({ browser }) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type.startsWith('webgl')) return null;
      return original.call(this, type as never, ...args as []) as never;
    } as typeof original;
  });
  const page = await context.newPage();
  await page.goto('/Resume/');
  await expect(page.locator('.core-fallback')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'View Harbour Digital Twin project details' }).click();
  await expect(page.getByRole('dialog').getByRole('heading')).toHaveText('Harbour Digital Twin');
  await context.close();
});
