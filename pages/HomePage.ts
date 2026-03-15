import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly logoApp: Locator;

    readonly bankAccountsNavBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logoApp = page.locator('[data-test="app-name-logo"]').getByRole('link');
        this.bankAccountsNavBtn = page.locator('[data-test="sidenav-bankaccounts"]');
    }

}
