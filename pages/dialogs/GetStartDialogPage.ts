import { BaseDialog } from './BaseDialogPage';
import { Page, Locator } from '@playwright/test';

export class GetStartDialogPage extends BaseDialog {
  protected nextButton: Locator;

  constructor(page: Page) {
    super(page);

    this.nextButton = page.locator('[data-test="user-onboarding-next"]');
  }

  async clickNext() {
    await this.nextButton.click();
  }
}
