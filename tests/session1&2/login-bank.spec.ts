import { test, expect } from '../../fixtures/fixture';
import { DataFactory } from '../../utils/data-factory';

test.describe('Login Bank Account', () => {
  const bankAccount = DataFactory.createBankAccount();

  test.beforeEach(async ({ signInPage }) => {
    await signInPage.goto();
  });

  test('TC: Login Bank Account', async ({ homePage, bankAccountPage, createBankAccountPage }) => {
    await expect(homePage.logoApp).toBeVisible();
    await homePage.clickBankAccountsNav();
    await expect(bankAccountPage.createAccountBtn).toBeVisible();
    await bankAccountPage.clickCreateAccount();
    await expect(createBankAccountPage.bankNameInput).toBeVisible();
    await createBankAccountPage.createBankAccount(
      bankAccount.name,
      bankAccount.routing,
      bankAccount.account
    );
    await expect(bankAccountPage.itemBankAccount(bankAccount.name)).toBeVisible();
    await bankAccountPage.deleteBankAccount(bankAccount.name);
    await expect(bankAccountPage.itemBankAccount(bankAccount.name + ' (Deleted)')).toBeVisible();
  });
});
