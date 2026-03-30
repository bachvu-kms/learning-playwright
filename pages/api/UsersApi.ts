import { APIRequestContext } from '@playwright/test';
import { BaseApi } from './BaseApi';

export class UsersApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async createUser(userData: Record<string, any>) {
    const res = await this.request.post('/users', { data: userData });

    // Log response details for debugging

    if (!res.ok()) {
      const body = await res.text().catch(() => '');
      console.error('User creation failed:', body);
      throw new Error(`Failed to create user: ${res.status()} ${res.statusText()} - ${body}`);
    }

    const data = await this.parseJson(res as any);
    return data;
  }

  async getUser(userId: string) {
    const res = await this.request.get(`/users/${userId}`);
    return await this.parseJson(res as any);
  }

  async deleteAllUsers(): Promise<boolean> {
    try {
      const res = await this.request.delete('/testData/users');
      return res.ok();
    } catch (err) {
      console.warn('deleteAllUsers failed', err);
      return false;
    }
  }
}
