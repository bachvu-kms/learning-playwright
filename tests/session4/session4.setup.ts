import { test as setup } from '../../fixtures/fixture';

const authFile = './tests/auth/session4.json';

// Explicitly clear all cookies and cache (storage state) before running this setup
setup.use({ storageState: { cookies: [], origins: [] } });

setup(
  'authenticate for session 4',
  async ({ page, signInPage, getStartDialogPage, baseDialog }) => {
    // Navigate to login
    await signInPage.goto();

    // Perform UI login using credentials from .env
    await signInPage.signIn({
      username: process.env.SEED_USERNAME!,
      password: process.env.SEED_PASSWORD!,
    });

    // Walk through the onboarding onboarding dialogue
    if (await baseDialog.bodyDialog.isVisible()) {
      await getStartDialogPage.clickNext();
      await getStartDialogPage.clickNext();
    }

    // Save the authenticated state to the specified file path
    await page.context().storageState({ path: authFile });
  }
);
