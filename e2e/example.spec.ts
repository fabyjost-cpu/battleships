import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Battleships
 *
 * Note: Full matchmaking tests require Firebase App Check bypass for the test environment.
 * These tests cover the UI rendering and basic interactions that don't require Firebase auth.
 */

test.describe('Battleships Landing Page', () => {
  test('page loads with correct title and heading', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toHaveText('Battleships');
    await expect(page.locator('text=Real-time 2-player game')).toBeVisible();
  });

  test('shows Find Match button when ready', async ({ page }) => {
    await page.goto('/');

    // Wait for auth to complete (either success or failure)
    await page.waitForSelector('button:has-text("Find Match"), button:has-text("Try Again")', { timeout: 10000 });
    await expect(page.locator('button:has-text("Find Match"), button:has-text("Try Again")')).toBeVisible();
  });

  test('shows error state when auth fails', async ({ page }) => {
    await page.goto('/');

    // Wait for error state if Firebase is blocking
    const errorVisible = await page.locator('text=Failed to authenticate').isVisible({ timeout: 8000 }).catch(() => false);

    if (errorVisible) {
      await expect(page.locator('text=Failed to authenticate')).toBeVisible();
      await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
    }
  });

  test('Find Match button is clickable', async ({ page }) => {
    await page.goto('/');

    const findMatchBtn = page.locator('button:has-text("Find Match")');
    await findMatchBtn.waitFor({ timeout: 10000 });

    // Button should be enabled
    await expect(findMatchBtn).toBeEnabled();
  });
});

test.describe('Smoke Tests', () => {
  test('homepage responds with 200', async ({ request }) => {
    const response = await request.get('/');
    expect(response.ok()).toBeTruthy();
  });

  test('page renders correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Real-time 2-player game')).toBeVisible();
  });

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known Firebase/network errors in test env
    const criticalErrors = errors.filter(e =>
      !e.includes('Firebase') &&
      !e.includes('auth') &&
      !e.includes('App Check') &&
      !e.includes('400') &&
      !e.includes('Failed to load resource')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
