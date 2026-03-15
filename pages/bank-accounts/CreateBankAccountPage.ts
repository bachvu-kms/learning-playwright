import { Page, Locator } from '@playwright/test';

export class CreateBankAccountPage {
  readonly page: Page;
  readonly bankNameInput: Locator;
  readonly routingNumberInput: Locator;
  readonly accountNumberInput: Locator;
  readonly createAccountBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bankNameInput = page.getByRole('textbox', { name: 'Bank Name' });
    this.routingNumberInput = page.getByRole('textbox', { name: 'Routing Number' });
    this.accountNumberInput = page.getByRole('textbox', { name: 'Account Number' });
    this.createAccountBtn = page.locator('[data-test="bankaccount-submit"]');
  }

  async createBankAccount(bankName: string, routingNumber: string, accountNumber: string) {
    await this.bankNameInput.fill(bankName);
    await this.routingNumberInput.fill(routingNumber);
    await this.accountNumberInput.fill(accountNumber);
    await this.createAccountBtn.click();
  }
}
