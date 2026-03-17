import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly logoApp: Locator;

  readonly userFullName: (fullName: string) => Locator;

  constructor(page: Page) {
    super(page);
    this.logoApp = page.locator('[data-test="app-name-logo"]').getByRole('link');

    this.userFullName = (fullName: string) =>
      page.locator('[data-test="sidenav-user-full-name"]').getByText(fullName);
  }
}
