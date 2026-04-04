import { apiTest as test, expect } from '../../fixtures/fixture';
import { faker } from '@faker-js/faker';
import { DataFactory } from '../../utils/data-factory';

// Using `apiTest` fixtures — `usersApi` and `authApi` are provided per-test

test.describe('Users API', () => {
  test.beforeEach(async ({ usersApi }) => {
    // Clear the database before each test
    await usersApi.deleteAllUsers();
  });

  test('TC-01: POST /users creates user with starting balance', async ({ usersApi }) => {
    const userData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.username(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      avatar: faker.image.avatar(),
      balance: faker.finance.amount(),
    };

    const response = await usersApi.createUser(userData);

    expect(response?.user?.firstName).toBe(userData.firstName);
    expect(String(response?.user?.balance)).toBe(userData.balance);
  });

  test('TC-02: POST /login authenticates existing user', async ({ usersApi, authApi }) => {
    const userData = DataFactory.createNewUser();
  
    await usersApi.createUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      password: userData.password,
      confirmPassword: userData.password,
    });

    const loginResponse = await authApi.login(userData.username, userData.password);

    expect(loginResponse?.user?.username).toBe(userData.username);
  });

});
