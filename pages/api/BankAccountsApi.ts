import { APIRequestContext } from '@playwright/test';
import { BaseApi } from './BaseApi';

export class BankAccountsApi extends BaseApi {
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // ms

  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Retry wrapper for flaky connections
   */
  private async retryRequest<T>(fn: () => Promise<T>, operation: string): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        const isLastAttempt = attempt === this.maxRetries;

        if (
          lastError.message.includes('ECONNRESET') ||
          lastError.message.includes('ENOTFOUND') ||
          lastError.message.includes('read ECONNRESET')
        ) {
          if (!isLastAttempt) {
            const delay = this.retryDelay * attempt;
            console.warn(
              `${operation} - Connection error on attempt ${attempt}, retrying in ${delay}ms...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
        }

        if (isLastAttempt) {
          throw lastError;
        }
      }
    }

    throw lastError || new Error('Unknown retry error');
  }

  /**
   * Get all bank accounts for authenticated user
   * GET /bankAccounts
   * Note: Uses session cookie from login (connect.sid)
   */
  async getBankAccounts() {
    return this.retryRequest(async () => {
      const res = await this.request.get('/bankAccounts');

      if (!res.ok()) {
        const body = await res.text().catch(() => '');
        console.error('Get bank accounts failed:', res.status(), body);
        throw new Error(`Failed to get bank accounts: ${res.status()} - ${body}`);
      }

      return await this.parseJson(res as any);
    }, 'GET /bankAccounts');
  }

  /**
   * Get single bank account by ID
   * GET /bankAccounts/:bankAccountId
   * Note: Uses session cookie from login (connect.sid)
   */
  async getBankAccountById(bankAccountId: string) {
    return this.retryRequest(async () => {
      const res = await this.request.get(`/bankAccounts/${bankAccountId}`);

      if (!res.ok()) {
        const body = await res.text().catch(() => '');
        throw new Error(`Failed to get bank account: ${res.status()} - ${body}`);
      }

      return await this.parseJson(res as any);
    }, `GET /bankAccounts/${bankAccountId}`);
  }

  /**
   * Create a new bank account
   * POST /bankAccounts
   * Note: Uses session cookie from login (connect.sid)
   */
  async createBankAccount(accountData: Record<string, any>) {
    return this.retryRequest(async () => {
      const res = await this.request.post('/bankAccounts', {
        data: accountData,
      });

      if (!res.ok()) {
        const body = await res.text().catch(() => '');
        console.error('Create bank account failed:', body);
        throw new Error(
          `Failed to create bank account: ${res.status()} ${res.statusText()} - ${body}`
        );
      }

      const data = await this.parseJson(res as any);
      return data;
    }, 'POST /bankAccounts');
  }

  /**
   * Delete (soft delete) bank account by ID
   * DELETE /bankAccounts/:bankAccountId
   * Note: Uses session cookie from login (connect.sid)
   */
  async deleteBankAccount(bankAccountId: string) {
    return this.retryRequest(async () => {
      const res = await this.request.delete(`/bankAccounts/${bankAccountId}`);

      if (!res.ok()) {
        const body = await res.text().catch(() => '');
        console.error('Delete bank account failed:', body);
        throw new Error(
          `Failed to delete bank account: ${res.status()} ${res.statusText()} - ${body}`
        );
      }

      const data = await this.parseJson(res as any);
      return data;
    }, `DELETE /bankAccounts/${bankAccountId}`);
  }
}
