import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApi {
  constructor(protected request: APIRequestContext) {}

  protected async parseJson(res: APIResponse) {
    const contentType = res.headers()['content-type'] || '';
    if (!contentType.includes('application/json')) return null;
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
}
