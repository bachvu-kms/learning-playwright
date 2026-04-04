import { test, expect } from '../../fixtures/fixture';
import { DataFactory } from '../../utils/data-factory';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Bank Account Flow - Mixed API & UI', () => {
  let createdUserUsername: string;
  let createdUserPassword: string;
  let bankAccountData: { name: string; routing: string; account: string };

  test.beforeEach(async ({ usersApi, authApi }) => {
    // Generate user data
    const userData = DataFactory.createNewUser();
    createdUserUsername = userData.username;
    createdUserPassword = userData.password;

    // STEP 1: Create user via API
    await usersApi.createUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      password: userData.password,
      confirmPassword: userData.password,
    });

    // STEP 2: Authenticate user via API (POST /login)
    await authApi.login(createdUserUsername, createdUserPassword);

    // Prepare bank account test data
    bankAccountData = DataFactory.createBankAccount();
  });

  test('TC-01: Create and Delete Bank Account - Mixed API & UI Flow', async ({
    signInPage,
    homePage,
    bankAccountPage,
    createBankAccountPage,
    baseDialog,
    getStartDialogPage,
    bankAccountsApi,
  }) => {
    /**
     * STEP 3: Open login page (UI)
     */
    await signInPage.goto();

    /**
     * STEP 4: Login with created user (UI)
     */
    await signInPage.signIn({
      username: createdUserUsername,
      password: createdUserPassword,
    });

    /**
     * STEP 5: Handle onboarding dialog if shown (UI)
     */
    await expect(baseDialog.bodyDialog).toBeVisible();
    await getStartDialogPage.clickNext();

    /**
     * STEP 6: Create a new bank account (UI)
     */
    await createBankAccountPage.createBankAccount(
      bankAccountData.name,
      bankAccountData.routing,
      bankAccountData.account
    );

    await getStartDialogPage.clickNext();

    /**
     * STEP 7: Verify bank account displays in list (UI)
     */
    await homePage.clickBankAccountsNav();
    await expect(bankAccountPage.itemBankAccount(bankAccountData.name)).toBeVisible();

    // Get bank accounts list using BankAccountsApi
    const bankAccountsData = await bankAccountsApi.getBankAccounts();
    const bankAccounts = bankAccountsData?.results || [];

    // Find the created account
    const createdAccount = bankAccounts.find(
      (acc: any) =>
        acc.bankName === bankAccountData.name ||
        acc.accountName === bankAccountData.name ||
        acc.name === bankAccountData.name
    );

    // Delete the bank account via API using BankAccountsApi
    await bankAccountsApi.deleteBankAccount(createdAccount.id);
  });
});
