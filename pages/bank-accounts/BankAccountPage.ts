import { Page, Locator } from '@playwright/test';

export class BankAccountPage {
    readonly page: Page;
    readonly createAccountBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.createAccountBtn = page.locator('[data-test="bankaccount-new"]')
    }

    async clickCreateAccount() {
        await this.createAccountBtn.click();
    }

}
