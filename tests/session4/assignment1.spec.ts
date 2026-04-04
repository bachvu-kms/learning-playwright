import { test, expect } from '../../fixtures/fixture';

test.describe('Assignment 1: Global Storage State Auth', () => {
  test('Verify the home page loads already authenticated', async ({ page, homePage }) => {
    // Navigate directly to the base URL (home page)
    // Since session4 relies on the setup project's storageState,
    // the browser should already have the auth cookies/tokens injected.
    await page.goto('/');

    // Verify that we are successfully logged in without seeing the login screen.
    // We do this by checking for authenticated-only elements.
    await expect(homePage.logoApp).toBeVisible();

    // Assert the username in the sidebar is also present, validating identity
    await expect(homePage.components().username).toBeVisible();
  });
});
