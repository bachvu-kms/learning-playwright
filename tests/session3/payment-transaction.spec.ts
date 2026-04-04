import { test, expect } from '../../fixtures/fixture';

test.describe('Payment Transaction API', () => {
  let bankAccountId: string;
  let receiverId: string;
  let authenticatedUserId: string;

  /**
   * STEP 1: Seed database with test data
   */
  test.beforeAll(async ({ testDataApi }) => {
    await testDataApi.seedDatabase();
  });

  test('TC-PAY-01: Create payment transaction successfully', async ({
    authApi,
    testDataApi,
    transactionApi,
  }) => {
    /**
     * STEP 2: Login as a valid user via POST /login
     * This sets the session cookie (connect.sid) for subsequent API calls
     */
    const seedUsername = process.env.SEED_USERNAME ;
    const seedPassword = process.env.SEED_PASSWORD ;

    const loginResponse = await authApi.login(seedUsername ?? '', seedPassword ?? '');
    expect(loginResponse).toBeDefined();

    // Extract authenticated user ID from login response
    authenticatedUserId = loginResponse?.user?.id;
    expect(authenticatedUserId).toBeDefined();

    /**
     * STEP 3: Obtain a valid bank account id from GET /testData/bankaccounts
     */
    const bankAccountsResponse = await testDataApi.getBankAccounts();

    // Test data endpoint returns { results: [...] }
    const accounts = bankAccountsResponse?.results || bankAccountsResponse;
    expect(accounts).toBeDefined();
    expect(Array.isArray(accounts) && accounts.length).toBeGreaterThan(0);

    const bankAccount = accounts[0];
    bankAccountId = bankAccount.id;

    /**
     * STEP 4: Obtain a receiverId from GET /testData/users (different from authenticated user)
     */
    const testUsersResponse = await testDataApi.getTestUsers();

    // Test data endpoint returns { results: [...] }
    const users = testUsersResponse?.results || testUsersResponse;
    expect(users).toBeDefined();
    expect(Array.isArray(users) && users.length).toBeGreaterThan(1);

    const receiverUser = users.find((user: any) => user.id !== authenticatedUserId);
    expect(receiverUser).toBeDefined();
    receiverId = receiverUser.id;
    expect(receiverId).not.toBe(authenticatedUserId);

    /**
     * STEP 5: Call POST /transactions with payment transaction details
     * Uses session cookie (connect.sid) automatically set during login
     */
    const transactionData = {
      transactionType: 'payment',
      source: bankAccountId,
      receiverId: receiverId,
      amount: 150.75,
      description: 'Payment transaction test - verify complete transaction flow',
    };

    const createTransactionResponse = await transactionApi.createTransaction(transactionData);

    /**
     * STEP 6: Inspect response.transaction and verify expected properties
     */
    expect(createTransactionResponse).toBeDefined();

    const transaction = (createTransactionResponse as any).data.transaction;
    expect(transaction).toBeDefined();

    // Verify transaction.id is a string
    expect(typeof transaction.id).toBe('string');
    expect(transaction.id.length).toBeGreaterThan(0);

    // Verify status = complete
    expect(transaction.status).toBe('complete');

    // Verify requestStatus is undefined
    expect(transaction.requestStatus).toBeUndefined();

    // Additional validations
    expect(transaction.receiverId).toBe(receiverId);
    expect(transaction.amount).toBe(15000);
    expect(transaction.senderId).toBe(authenticatedUserId);
  });
});
