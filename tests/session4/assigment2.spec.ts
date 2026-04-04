import { test, expect } from '../../fixtures/fixture';
import { DataFactory } from '../../utils/data-factory';

test.describe('Assignment 2 @regression', () => {
  // Override auth so we can manually login and assert in each iteration
  test.use({ storageState: { cookies: [], origins: [] } });

  // Generate users synchronously for parameterization
  const users = Array.from({ length: 2 }).map(() => {
    const user = DataFactory.createNewUser();
    return {
      ...user,
      checkTransactions: Math.random() > 0.5, // Random value or set to true based on your logic
    };
  });

  users.forEach((userData, index) => {
    test(`Login and verify username for user ${index + 1}`, async ({
      baseDialog,
      getStartDialogPage,
      signInPage,
      homePage,
      usersApi,
      bankAccountPage,
      createBankAccountPage,
    }) => {
      const { username, password, checkTransactions } = userData;
      const bankAccountData = DataFactory.createBankAccount();

      // Setup: Create the specific user for this test
      await usersApi.createUser(userData);

      await signInPage.goto();

      await signInPage.signIn({
        username: username,
        password: password,
      });

      await expect(baseDialog.bodyDialog).toBeVisible();
      await getStartDialogPage.clickNext();

      await createBankAccountPage.createBankAccount(
        bankAccountData.name,
        bankAccountData.routing,
        bankAccountData.account
      );

      // Assert the correct username appears in the sidebar
      await expect(homePage.components().username).toHaveText(`@${username}`);

      if (checkTransactions) {
        test.slow();
      }

      if (checkTransactions) {
        await homePage.components().bankAccounts.click();
        await expect(bankAccountPage.createAccountBtn).toBeVisible();
      }
    });
  });
});
