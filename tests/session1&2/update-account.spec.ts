import { test, expect } from '../../fixtures/fixture';
import { DataFactory } from '../../utils/data-factory';

test.describe('Update Information of Account', () => {
  const user = DataFactory.createNewUser();

  test.beforeEach(async ({ homePage }) => {
    await homePage.goto('/');
  });

  test('TC: Update Information of Account', async ({ homePage, userSettingsPage }) => {
    await expect(homePage.logoApp).toBeVisible();
    await homePage.clickMyAccountNav();
    await expect(userSettingsPage.firstNameInput).toBeVisible();
    await userSettingsPage.updateUserSettings(user.firstName, user.lastName);
    await expect(
      homePage.userFullName(user.firstName + ' ' + user.lastName.charAt(0))
    ).toBeVisible();
  });
});
