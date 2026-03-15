import { Page, Locator } from '@playwright/test';

export class BankAccountPage {
    readonly page: Page;
    readonly createAccountBtn: Locator;

    readonly bankAccountList: Locator;

    readonly itemBankAccount: (name: string, id?: string) => Locator;

    readonly deleteBankAccountBtn: (name: string) => Locator;

    constructor(page: Page) {
        this.page = page;
        this.createAccountBtn = page.locator('[data-test="bankaccount-new"]')

        this.bankAccountList = page.locator('[data-test="bankaccount-list"]');

        this.itemBankAccount = (name: string) => 
            this.bankAccountList.getByText(name)

        this.deleteBankAccountBtn = (name: string) =>
            this.bankAccountList.getByText(name + ' Delete').getByRole('button');
    }

    async clickCreateAccount() {
        await this.createAccountBtn.click();
    }

    async deleteBankAccount(name: string) {
        await this.deleteBankAccountBtn(name).click();
    }

}
