import { test as setup, expect } from '../fixtures/fixture';

const authFile = './tests/storageState.json';

setup('authenticate', async ({ signInPage, page }) => {
  const username = process.env.SEED_USERNAME!;
  const password = process.env.SEED_PASSWORD!;

  await signInPage.goto();
  await signInPage.signIn({ username, password });

  // Wait until we are successfully logged in and redirected to home page
  await expect(page.locator('[data-test="app-name-logo"]')).toBeVisible();

  // Save the logged-in state to the file
  await page.context().storageState({ path: authFile });
});
