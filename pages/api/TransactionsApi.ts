import { APIRequestContext } from '@playwright/test';
import { BaseApi } from './BaseApi';

export class TransactionApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async createTransaction(transactionData: {
    transactionType: string;
    source: string;
    receiverId: string;
    amount: number;
    description: string;
  }) {
    const res = await this.request.post('/transactions', {
      data: transactionData,
    });

    if (!res.ok()) {
      const body = await res.text().catch(() => '');
      throw new Error(`Create transaction failed: ${res.status()} ${res.statusText()} - ${body}`);
    }

    return {
      status: res.status(),
      data: await this.parseJson(res as any),
    };
  }
}
