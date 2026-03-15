import { Page, Locator } from '@playwright/test';

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export class SignupPage {
  readonly page: Page;
  readonly firstNameInput: Locator;

  readonly lastNameInput: Locator;

  readonly userNameInput: Locator;

  readonly passwordInput: Locator;

  readonly confirmPasswordInput: Locator;

  readonly signUpBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.userNameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page
      .locator('[data-test="signup-password"]')
      .getByRole('textbox', { name: 'Password' });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
    this.signUpBtn = page.locator('[data-test="signup-submit"]');
  }

  async signUp(user: UserData) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.userNameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.confirmPassword);
    await this.signUpBtn.click();
  }
}
