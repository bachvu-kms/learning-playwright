import { Locator, Page } from '@playwright/test';

export class BaseDialog {
  readonly page: Page;

  readonly bodyDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bodyDialog = page.locator('[data-test="user-onboarding-dialog-content"]');
  }
}
