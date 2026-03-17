import { Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  components() {
    return {
      userSettings: this.page.locator('[data-test="sidenav-user-settings"]'),
      home: this.page.locator('[data-test="sidenav-home"]'),
      signInSubmit: this.page.locator('[data-test="signin-submit"]'),
      bankAccounts: this.page.locator('[data-test="sidenav-bankaccounts"]'),

      // Add more shared components as needed
    };
  }

  async clickBankAccountsNav() {
    await this.components().bankAccounts.click();
  }

  async clickMyAccountNav() {
    await this.components().userSettings.click();
  }
}
