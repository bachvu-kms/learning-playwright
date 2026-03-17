import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

interface UserCredentials {
  username: string;
  password: string;
}

export class SignInPage extends BasePage {
  readonly userNameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInBtn: Locator;

  readonly dontHaveAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.userNameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInBtn = page.locator('[data-test="signin-submit"]');
    this.dontHaveAccountButton = page.locator('[data-test="signup"]');
  }

  async goto() {
    await this.page.goto('/signin');
  }
  async signIn(user: UserCredentials) {
    await this.userNameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.signInBtn.click();
  }

  async clickDontHaveAccount() {
    await this.dontHaveAccountButton.click();
  }
}
