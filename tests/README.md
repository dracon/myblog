# Playwright Tests

This directory contains end-to-end tests for the Docusaurus site using Playwright.

## Running Tests

- **Headless (CI mode)**: `npm run test` – Runs all tests in all browsers without opening windows
- **Interactive UI**: `npm run test:ui` – Opens a visual test runner (best for development)
- **Headed mode**: `npm run test:headed` – Runs tests in visible browser windows
- **Debug mode**: `npm run test:debug` – Opens the debugger; step through tests line-by-line
- **Single test**: `npx playwright test tests/homepage.spec.ts` – Run specific file
- **Single test by name**: `npx playwright test -g "should load homepage"` – Run test matching pattern

## Configuration

- **Config file**: `playwright.config.ts` in root
- **Base URL**: `http://localhost:3000` (dev server)
- **Browsers**: Chromium, Firefox, WebKit (change in config to add mobile)
- **Auto-start**: Dev server starts automatically via `webServer` config

## Writing Tests

Tests use Playwright's test API with familiar patterns:

```typescript
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/expected title/);
});
```

### Common Patterns

**Navigation:**
```typescript
await page.goto('/docs/intro');
await page.click('a:text("Link Text")');
await expect(page).toHaveURL(/\/docs\//);
```

**Finding Elements:**
```typescript
const button = page.locator('button');
const heading = page.locator('h1');
const link = page.locator('a:has-text("text")');
const byRole = page.locator('button[role="button"]');
```

**Assertions:**
```typescript
await expect(element).toBeVisible();
await expect(element).toContainText('text');
await expect(element).toHaveCount(3);
await expect(page).toHaveTitle(/regex/);
```

**Responsive Testing:**
```typescript
await page.setViewportSize({ width: 375, height: 667 }); // Mobile
await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
```

**Group Tests:**
```typescript
test.describe('Feature Group', () => {
  test('test 1', async ({ page }) => { ... });
  test('test 2', async ({ page }) => { ... });
});
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Test API Reference](https://playwright.dev/docs/api/class-test)
- [Locators Guide](https://playwright.dev/docs/locators)
- [Best Practices](https://playwright.dev/docs/best-practices)
