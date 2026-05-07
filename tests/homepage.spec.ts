import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    expect(page).toHaveTitle(/My Site/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toContainText('My Site');
  });

  test('should display tagline', async ({ page }) => {
    await page.goto('/');
    const tagline = page.locator('.hero__subtitle');
    await expect(tagline).toContainText('Dinosaurs are cool');
  });

  test('should have tutorial link', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('a:has-text("Docusaurus Tutorial")');
    await expect(link).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    await page.goto('/');
    const features = page.locator('section.features');
    await expect(features).toBeVisible();
    
    const featureItems = page.locator('div.col--4');
    await expect(featureItems).toHaveCount(3);
  });
});

test.describe('Navigation', () => {
  test('should navigate to docs', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Docusaurus Tutorial")');
    await expect(page).toHaveURL(/\/docs\/intro/);
  });

  test('should have navbar', async ({ page }) => {
    await page.goto('/');
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    const features = page.locator('section.features');
    await expect(features).toBeVisible();
  });
});
