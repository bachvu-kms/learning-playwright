import { APIRequestContext } from '@playwright/test';
import { BaseApi } from './BaseApi';

export class TestDataApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async seedDatabase() {
    const res = await this.request.post('/testData/seed');
    return res.ok();
  }

  async getTestUsers() {
    const res = await this.request.get('/testData/users');
    const data = await this.parseJson(res as any);
    return data?.results || data;
  }

  async getBankAccounts() {
    const res = await this.request.get('/testData/bankaccounts');
    const data = await this.parseJson(res as any);
    return data?.results || data;
  }
}
