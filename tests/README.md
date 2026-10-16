# Playwright Tests

This directory contains end-to-end tests for the Docusaurus site using Playwright.

## Running Tests

### Docker (required on CachyOS/Arch and other unsupported distros, and on CI)

Playwright only supports Ubuntu/Debian, macOS and Windows — on this machine (CachyOS) local runs fail, so use the container:

```bash
# whole suite, all three browsers (rebuilds the image if needed)
pnpm test:docker

# single spec / single browser
docker compose -f docker-compose.test.yaml run --rm playwright \
  pnpm exec playwright test tests/homepage.spec.ts --project=chromium
```

- Runs headless against the official Ubuntu-based Playwright image (browsers and system dependencies included) — see `DOCKER.md`.
- `pnpm install --frozen-lockfile` runs automatically via the entrypoint; dependencies are cached in the `myblog_playwright-node-modules` volume.
- `--ui`, `--headed` and `--debug` do **not** work in the container (no display) — debug via the report/traces instead.

### Local (supported OS only)

Only on Ubuntu/Debian, macOS or Windows, after `pnpm exec playwright install`:

- **Headless (CI mode)**: `pnpm test` – Runs all tests in all browsers without opening windows
- **Interactive UI**: `pnpm test:ui` – Opens a visual test runner (best for development)
- **Headed mode**: `pnpm test:headed` – Runs tests in visible browser windows
- **Debug mode**: `pnpm test:debug` – Opens the debugger; step through tests line-by-line
- **Single test**: `pnpm exec playwright test tests/homepage.spec.ts` – Run specific file
- **Single test by name**: `pnpm exec playwright test -g "should load homepage"` – Run test matching pattern

### Reports

- HTML report: `playwright-report/` – view with `pnpm exec playwright show-report`
- Traces (saved on first retry): `test-results/` – view with `pnpm exec playwright show-trace <trace.zip>`

## Configuration

- **Config file**: `playwright.config.ts` in root
- **Base URL**: `http://localhost:3000` (dev server)
- **Browsers**: Chromium, Firefox, WebKit (`projects` in the config; mobile viewports are commented out)
- **Auto-start**: Dev server starts automatically via the `webServer` config (inside the container when using Docker)
- **Reporter**: HTML; traces collected on first retry
- **CI** (`CI` env var): 2 retries, 1 worker, `test.only` forbidden

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
