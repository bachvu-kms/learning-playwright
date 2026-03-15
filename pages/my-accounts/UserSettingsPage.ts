import { Page, Locator } from '@playwright/test';

export class UserSettingsPage {
  readonly page: Page;

  readonly firstNameInput: Locator;

  readonly lastNameInput: Locator;

  readonly emailInput: Locator;

  readonly phoneInput: Locator;

  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="user-settings-firstName-input"]');
    this.lastNameInput = page.locator('[data-test="user-settings-lastName-input"]');
    this.emailInput = page.locator('[data-test="user-settings-email-input"]');
    this.phoneInput = page.locator('[data-test="user-settings-phoneNumber-input"]');
    this.submitButton = page.locator('[data-test="user-settings-submit"]');
  }

  async updateUserSettings(firstName?: string, lastName?: string, email?: string, phone?: string) {
    if (firstName !== undefined) {
      await this.firstNameInput.clear();

      await this.firstNameInput.fill(firstName);
    }
    if (lastName !== undefined) {
      await this.lastNameInput.clear();
      await this.lastNameInput.fill(lastName);
    }
    if (email !== undefined) {
      await this.emailInput.clear();
      await this.emailInput.fill(email);
    }
    if (phone !== undefined) {
      await this.phoneInput.clear();
      await this.phoneInput.fill(phone);
    }

    await this.submitButton.click();
  }
}
