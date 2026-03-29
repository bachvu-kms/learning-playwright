import { APIRequestContext } from '@playwright/test';

export class ApiUtils {
  constructor(
    private request: APIRequestContext,
    private baseUrl: string
  ) {}

  async createUser(userData: Record<string, any>) {
    const res = await this.request.post(`${this.baseUrl}/users`, { data: userData });
    return await res.json();
  }

  async getUser(userId: string) {
    const res = await this.request.get(`${this.baseUrl}/users/${userId}`);
    return await res.json();
  }

  async login(username: string, password: string) {
    const res = await this.request.post(`${this.baseUrl}/login`, {
      data: { username, password },
    });
    if (!res.ok()) {
      const bodyText = await res.text();
      console.error(`POST /login failed: ${res.status()} ${res.statusText()} - ${bodyText}`);
      throw new Error(`Login failed with status ${res.status()}`);
    }

    const contentType = res.headers()['content-type'] || '';

    if (!contentType.includes('application/json')) {
      // Callers in this project don't currently use the response body;
      // just return null to avoid JSON parse errors when the body isn't JSON.
      return null;
    }

    try {
      return await res.json();
    } catch (err) {
      console.error('Failed to parse /login response as JSON', err);
      return null;
    }
  }

  async seedTestData() {
    await this.request.post(`${this.baseUrl}/testData/seed`);
  }

  async getTestUsers() {
    const res = await this.request.get(`${this.baseUrl}/testData/users`);
    return await res.json();
  }

  async deleteAllUsers() {
    // Try to delete test users via the test-data endpoint. If the API doesn't
    // support this, the call will be ignored by tests that don't rely on it.
    try {
      const res = await this.request.delete(`${this.baseUrl}/testData/users`);
      if (!res.ok()) {
        console.warn(`deleteAllUsers returned ${res.status()} ${res.statusText()}`);
      }
    } catch (err) {
      console.warn('deleteAllUsers failed:', err);
    }
  }

  async deleteBankAccountByName(bankName: string): Promise<boolean> {
    const listRes = await this.request.get(`${this.baseUrl}/bankAccounts`);

    if (!listRes.ok()) {
      console.error(`GET /bankAccounts failed: ${listRes.status()} ${listRes.statusText()}`);
      return false;
    }

    const data = await listRes.json();
    const accounts = Array.isArray(data) ? data : (data.results ?? []);

    const account = accounts.find((a: any) => a.bankName === bankName);
    if (!account) {
      console.error(`Bank account "${bankName}" not found in API response`);
      return false;
    }

    const deleteRes = await this.request.delete(`${this.baseUrl}/bankAccounts/${account.id}`);

    if (!deleteRes.ok()) {
      console.error(
        `DELETE /bankAccounts/${account.id} failed: ${deleteRes.status()} ${deleteRes.statusText()}`
      );
      return false;
    }

    return true;
  }
}
