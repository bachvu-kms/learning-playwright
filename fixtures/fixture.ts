import { test as base, expect, APIRequestContext } from '@playwright/test';
import { SignInPage } from '../pages/SignInPage';
import { SignupPage } from '../pages/SignUpPage';
import { HomePage } from '../pages/HomePage';
import { BaseDialog } from '../pages/dialogs/BaseDialogPage';
import { BankAccountPage } from '../pages/bank-accounts/BankAccountPage';
import { CreateBankAccountPage } from '../pages/bank-accounts/CreateBankAccountPage';
import { UserSettingsPage } from '../pages/my-accounts/UserSettingsPage';
import { GetStartDialogPage } from '../pages/dialogs/GetStartDialogPage';
// API Classes
import { UsersApi } from '../pages/api/UsersApi';
import { AuthApi } from '../pages/api/AuthApi';
import { TestDataApi } from '../pages/api/TestDataApi';
import { TransactionApi } from '../pages/api/TransactionsApi';
import { BankAccountsApi } from '../pages/api/BankAccountsApi';
import fs from 'fs';
import path from 'path';

// Combined UI and API Fixtures
type Fixtures = {
  // UI Page Objects
  signInPage: SignInPage;
  signUpPage: SignupPage;
  homePage: HomePage;
  baseDialog: BaseDialog;
  bankAccountPage: BankAccountPage;
  createBankAccountPage: CreateBankAccountPage;
  userSettingsPage: UserSettingsPage;
  getStartDialogPage: GetStartDialogPage;
  // API Fixtures
  apiRequest: APIRequestContext;
  usersApi: UsersApi;
  authApi: AuthApi;
  testDataApi: TestDataApi;
  transactionApi: TransactionApi;
  bankAccountsApi: BankAccountsApi;
};

type WorkerFixtures = {
  workerStorageState: string;
};

export const test = base.extend<Fixtures, WorkerFixtures>({
  // ─── WORKER-SCOPED: Per-Worker Authentication ──────────────────────────────
  workerStorageState: [
    async ({ browser }, use, workerInfo) => {
      const { parallelIndex } = workerInfo;
      const authDir = path.resolve('./tests/.auth');
      const stateFile = path.join(authDir, `worker-${parallelIndex}.json`);

      fs.mkdirSync(authDir, { recursive: true });

      if (fs.existsSync(stateFile)) {
        await use(stateFile);
        return;
      }

      const accounts: Array<{ username: string; password: string }> = process.env.WORKER_ACCOUNTS
        ? JSON.parse(process.env.WORKER_ACCOUNTS)
        : [];

      const { username, password } = accounts[parallelIndex] ?? {
        username: process.env.SEED_USERNAME!,
        password: process.env.SEED_PASSWORD!,
      };

      const baseURL = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
      const page = await browser.newPage({ storageState: undefined });

      await page.goto(`${baseURL}/signin`);

      const signInPage = new SignInPage(page);
      const homePage = new HomePage(page);

      await signInPage.signIn({ username, password });
      await expect(homePage.logoApp).toBeVisible();

      await page.context().storageState({ path: stateFile });
      await page.close();

      await use(stateFile);
    },
    { scope: 'worker' },
  ],

  // ─── Override built-in storageState option ─────────────────────────────────
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // UI Fixtures
  page: async ({ page }, use) => {
    const originalGoto = page.goto.bind(page);

    page.goto = async (url, options) => {
      return await originalGoto(url, {
        waitUntil: 'networkidle',
        ...options,
      });
    };

    await use(page);
  },

  signInPage: async ({ page }, use) => {
    const signInPage = new SignInPage(page);
    await use(signInPage);
  },
  signUpPage: async ({ page }, use) => {
    console.log('Suite level setup: Creating SignUpPage instance');
    const signUpPage = new SignupPage(page);
    await use(signUpPage);
    console.log('Suite level teardown: SignUpPage instance used');
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  baseDialog: async ({ page }, use) => {
    const baseDialog = new BaseDialog(page);
    await use(baseDialog);
  },
  bankAccountPage: async ({ page }, use) => {
    const bankAccountPage = new BankAccountPage(page);
    await use(bankAccountPage);
  },
  createBankAccountPage: async ({ page }, use) => {
    const createBankAccountPage = new CreateBankAccountPage(page);
    await use(createBankAccountPage);
  },
  userSettingsPage: async ({ page }, use) => {
    const userSettingsPage = new UserSettingsPage(page);
    await use(userSettingsPage);
  },
  getStartDialogPage: async ({ page }, use) => {
    const getStartDialogPage = new GetStartDialogPage(page);
    await use(getStartDialogPage);
  },

  // API Fixtures
  apiRequest: async ({ playwright }, use) => {
    let baseURL = process.env.API_BASE_URL || 'http://localhost:3001';
    // Remove trailing slash to avoid double slashes
    baseURL = baseURL.replace(/\/$/, '');
    const apiRequest = await playwright.request.newContext({ baseURL });
    await use(apiRequest);
    await apiRequest.dispose();
  },

  usersApi: async ({ apiRequest }, use) => {
    await use(new UsersApi(apiRequest));
  },

  authApi: async ({ apiRequest }, use) => {
    await use(new AuthApi(apiRequest));
  },

  testDataApi: async ({ apiRequest }, use) => {
    await use(new TestDataApi(apiRequest));
  },

  transactionApi: async ({ apiRequest }, use) => {
    await use(new TransactionApi(apiRequest));
  },

  bankAccountsApi: async ({ apiRequest }, use) => {
    await use(new BankAccountsApi(apiRequest));
  },
});

// Alias for API-focused tests - same fixtures, different naming convention
export const apiTest = test;

export { expect };
