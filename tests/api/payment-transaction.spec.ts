import { apiTest as test, expect } from '../../fixtures/apiFixture';

test.describe('Payment Transaction API', () => {
  let authenticatedUserId: string;
  let bankAccountId: string;
  let receiverId: string;

  // Step 1: Seed DB: POST /testData/seed
  test.beforeAll(async ({ testDataApi }) => {
    console.log('Step 1: Seed DB: POST /testData/seed (API url: http://localhost:3001/)');
    const seedResult = await testDataApi.seedDatabase();
    console.log('✓ Seed DB result:', seedResult);
  });

  test('TC-PAY-01: Create payment transaction successfully', async ({
    authApi,
    testDataApi,
    transactionApi,
  }) => {
    // Step 2: Login as a valid user via POST /login
    console.log('\nStep 2: Login as a valid user via POST /login');
    const seedUsername = process.env.SEED_USERNAME || 'Heath93';
    const seedPassword = process.env.SEED_PASSWORD || 's3cret';

    const loginResponse = await authApi.login(seedUsername, seedPassword);
    expect(loginResponse).toBeDefined();
    console.log('✓ Login successful for user:', seedUsername);
    console.log('✓ Login response:', JSON.stringify(loginResponse, null, 2));

    if (loginResponse?.user?.id) {
      authenticatedUserId = loginResponse.user.id;
      console.log('✓ Authenticated user ID:', authenticatedUserId);
    }

    // Step 3: Obtain a valid bank account id from GET /testData/bankaccounts
    console.log('\nStep 3: Obtain a valid bank account id from GET /testData/bankaccounts');
    const bankAccountsResponse = await testDataApi.getBankAccounts();
    console.log('✓ Bank accounts response:', JSON.stringify(bankAccountsResponse, null, 2));

    // Test data endpoint returns { results: [...] }
    const accounts = bankAccountsResponse?.results || bankAccountsResponse;
    expect(accounts).toBeDefined();
    expect(Array.isArray(accounts) && accounts.length).toBeGreaterThan(0);

    const bankAccount = accounts[0];
    bankAccountId = bankAccount.id;
    console.log('✓ Bank account ID:', bankAccountId);

    // Step 4: Obtain a receiverId from GET /testData/users (different from authenticated user)
    console.log(
      '\nStep 4: Obtain a receiverId from GET /testData/users (different from authenticated user)'
    );
    const testUsersResponse = await testDataApi.getTestUsers();
    console.log('✓ Test users response:', JSON.stringify(testUsersResponse, null, 2));

    // Test data endpoint returns { results: [...] }
    const users = testUsersResponse?.results || testUsersResponse;
    expect(users).toBeDefined();
    expect(Array.isArray(users) && users.length).toBeGreaterThan(1);

    const receiverUser = users.find((user: any) => user.id !== authenticatedUserId);
    expect(receiverUser).toBeDefined();
    receiverId = receiverUser.id;
    console.log('✓ Receiver user ID:', receiverId);
    expect(receiverId).not.toBe(authenticatedUserId);

    // Step 5: Call POST /transactions with transactionType=payment, valid source, receiverId, positive amount, and description
    console.log(
      '\nStep 5: Call POST /transactions with transactionType=payment, valid source, receiverId, positive amount, and description'
    );
    const transactionData = {
      transactionType: 'payment',
      source: bankAccountId,
      receiverId: receiverId,
      amount: 150.75,
      description: 'Payment transaction test - verify complete transaction flow',
    };

    console.log('✓ Transaction payload:', JSON.stringify(transactionData, null, 2));
    const createTransactionResponse = await transactionApi.createTransaction(transactionData);
    console.log('✓ Transaction creation response status:', createTransactionResponse.status);

    // Step 6: Inspect response.transaction
    console.log('\nStep 6: Inspect response.transaction');
    expect(createTransactionResponse.status).toBe(200);
    console.log('✓ HTTP 200 OK');

    const transaction = createTransactionResponse.data?.transaction;
    expect(transaction).toBeDefined();
    console.log('✓ Transaction object:', JSON.stringify(transaction, null, 2));

    // Verify transaction.id is a string
    expect(typeof transaction.id).toBe('string');
    expect(transaction.id.length).toBeGreaterThan(0);
    console.log('✓ transaction.id is a string:', transaction.id);

    // Verify status = complete
    expect(transaction.status).toBe('complete');
    console.log('✓ transaction.status === "complete":', transaction.status);

    // Verify requestStatus is undefined
    expect(transaction.requestStatus).toBeUndefined();
    console.log('✓ transaction.requestStatus is undefined');

    // Additional validations
    expect(transaction.receiverId).toBe(receiverId);
    expect(transaction.amount).toBe(15000); // Amount stored (150 * 100, rounded)
    expect(transaction.senderId).toBe(authenticatedUserId); // Verify sender is the authenticated user

    console.log('✓ transaction.receiverId matches:', receiverId);
    console.log('✓ transaction.amount is correct:', transaction.amount);
    console.log('✓ transaction.senderId matches authenticated user:', transaction.senderId);
    console.log('\n✅ All 6 steps completed and all validations passed!');
  });
});
