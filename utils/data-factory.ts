import { faker } from '@faker-js/faker';

export class DataFactory {
  static createNewUser() {
    const password = faker.internet.password();
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.username(),
      password: password,
      confirmPassword: password
    };
  }

  static createBankAccount() {
    return {
      name: faker.finance.accountName(),
      routing: faker.finance.routingNumber(),
      account: faker.finance.accountNumber(9)
    };
  }
}