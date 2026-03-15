import { test, expect } from '../fixtures/baseTest';
import { DataFactory } from '../utils/data-factory';

test.describe('Login Bank Account', () => {

    const bankAccount = DataFactory.createBankAccount();

    const username = process.env.SEED_USERNAME!;
    const password = process.env.SEED_PASSWORD!;

    test.beforeEach(async ({ signInPage, page }) => {
        await signInPage.goto();
    });

    test('TC: Login Bank Account', async ({ signInPage, homePage, bankAccountPage, createBankAccountPage,  page }) => {
        await signInPage.signIn({ username, password });
        await expect(homePage.logoApp).toBeVisible();
        await homePage.clickBankAccountsNav();
        await expect(bankAccountPage.createAccountBtn).toBeVisible();
        await bankAccountPage.clickCreateAccount();
        await expect(createBankAccountPage.bankNameInput).toBeVisible();
        await createBankAccountPage.createBankAccount(bankAccount.name, bankAccount.routing, bankAccount.account);
        await expect(bankAccountPage.itemBankAccount(bankAccount.name)).toBeVisible();
        await bankAccountPage.deleteBankAccount(bankAccount.name);
        await expect(bankAccountPage.itemBankAccount(bankAccount.name+' (Deleted)')).toBeVisible();
    });
});