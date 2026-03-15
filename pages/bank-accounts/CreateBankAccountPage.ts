import { Page, Locator } from '@playwright/test';

export class CreateBankAccountPage {
    readonly page: Page;
    readonly bankNameInput: Locator;
    readonly routingNumberInput: Locator;
    readonly accountNumberInput: Locator;
    readonly createAccountBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.bankNameInput = page.locator('[data-test="bankaccount-new"]')
        this.routingNumberInput = page.locator('[data-test="bankaccount-routingnumber"]')
        this.accountNumberInput = page.locator('[data-test="bankaccount-accountnumber"]')
        this.createAccountBtn = page.locator('[data-test="bankaccount-submit"]')
    }

    async createBankAccount(bankName: string, routingNumber: string, accountNumber: string) {
        await this.bankNameInput.fill(bankName);
        await this.routingNumberInput.fill(routingNumber);
        await this.accountNumberInput.fill(accountNumber);
        await this.createAccountBtn.click();
    }
}
