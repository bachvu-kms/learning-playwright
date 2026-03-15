import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly logoApp: Locator;

    readonly bankAccountsNavBtn: Locator;

    readonly myAccountNavBtn: Locator;

    readonly userFullName: (fullName: string) => Locator;

    constructor(page: Page) {
        this.page = page;
        this.logoApp = page.locator('[data-test="app-name-logo"]').getByRole('link');
        this.bankAccountsNavBtn = page.locator('[data-test="sidenav-bankaccounts"]');
        this.myAccountNavBtn = page.locator('[data-test="sidenav-user-settings"]');
        this.userFullName = (fullName: string) => page.locator('[data-test="sidenav-user-full-name"]').getByText(fullName);
    }

    async clickBankAccountsNav() {
        await this.bankAccountsNavBtn.click();
    }

    async clickMyAccountNav() {
        await this.myAccountNavBtn.click();
    }

}
