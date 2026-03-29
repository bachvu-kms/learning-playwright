import { APIRequestContext } from '@playwright/test';
import { BaseApi } from './BaseApi';

export class AuthApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async login(username: string, password: string) {
    const res = await this.request.post('/login', { data: { username, password } });
    if (!res.ok()) {
      const body = await res.text().catch(() => '');
      throw new Error(`Login failed: ${res.status()} ${res.statusText()} - ${body}`);
    }
    return await this.parseJson(res as any);
  }
}
