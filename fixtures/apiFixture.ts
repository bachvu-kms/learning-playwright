import { test as base, expect, APIRequestContext } from '@playwright/test';
import { UsersApi } from '../pages/api/UsersApi';
import { AuthApi } from '../pages/api/AuthApi';
import { TestDataApi } from '../pages/api/TestDataApi';
import { TransactionApi } from '../pages/api/TransactionsApi';

type APIFixtures = {
  apiRequest: APIRequestContext;
  usersApi: UsersApi;
  authApi: AuthApi;
  testDataApi: TestDataApi;
  transactionApi: TransactionApi;
};

export const apiTest = base.extend<APIFixtures>({
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
});

export { expect };
