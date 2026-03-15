import { test, expect } from '../fixtures/baseTest';
import { DataFactory } from '../utils/data-factory';

test.describe('Update Information of Account', () => {
  const user = DataFactory.createNewUser();

  const username = process.env.SEED_USERNAME!;
  const password = process.env.SEED_PASSWORD!;

  test.beforeEach(async ({ signInPage }) => {
    await signInPage.goto();
  });

  test('TC: Update Information of Account', async ({ signInPage, homePage, userSettingsPage }) => {
    await signInPage.signIn({ username, password });
    await expect(homePage.logoApp).toBeVisible();
    await homePage.clickMyAccountNav();
    await expect(userSettingsPage.firstNameInput).toBeVisible();
    await userSettingsPage.updateUserSettings(user.firstName, user.lastName);
    await expect(
      homePage.userFullName(user.firstName + ' ' + user.lastName.charAt(0))
    ).toBeVisible();
  });
});
