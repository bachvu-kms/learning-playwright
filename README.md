# Learning Playwright - Test Automation Guide

Welcome to the Playwright learning project! This guide will help you understand best practices and how to get started with automated testing using Playwright.

## Table of Contents

- [What is Playwright?](#what-is-playwright)
- [Project Setup](#project-setup)
- [Best Practices](#best-practices)
- [Running Tests](#running-tests)
- [Development Workflow](#development-workflow)
- [Code Quality](#code-quality)

## What is Playwright?

Playwright is a modern testing framework that allows you to write automated tests for web applications. It supports multiple browsers (Chrome, Firefox, Safari) and can test scenarios like:
- User login/logout
- Form submissions
- Navigation flows
- Data validation
- API interactions

## Project Setup

### Prerequisites

Before starting, make sure you have:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A code editor like **VS Code** - [Download here](https://code.visualstudio.com/)

### Installation Steps

1. **Clone or extract the project**
   ```bash
   cd learning-playwright
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm run lint
   ```

## Best Practices

### 1. **Page Object Model (POM)**

Organize your code by creating a page object for each page or feature:

```
pages/
  ├── HomePage.ts
  ├── SignInPage.ts
  ├── SignUpPage.ts
  └── bank-accounts/
      ├── BankAccountPage.ts
      └── CreateBankAccountPage.ts
```

Each page file contains selectors and methods for that page:

```typescript
// pages/SignInPage.ts
export class SignInPage {
  readonly page: Page;
  readonly usernameInput = this.page.locator('[data-test="username"]');
  readonly passwordInput = this.page.locator('[data-test="password"]');
  readonly signInButton = this.page.locator('button:has-text("Sign In")');

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async signIn(credentials: { username: string; password: string }) {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.signInButton.click();
  }
}
```

### 2. **Use Fixtures for Test Setup**

Create reusable fixtures for common test setup:

```typescript
// fixtures/baseTest.ts
import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SignInPage } from '../pages/SignInPage';

type TestFixtures = {
  homePage: HomePage;
  signInPage: SignInPage;
};

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  signInPage: async ({ page }, use) => {
    const signInPage = new SignInPage(page);
    await use(signInPage);
  },
});

export { expect };
```

### 3. **Use Data Factory for Test Data**

Create a factory to generate test data consistently:

```typescript
// utils/data-factory.ts
import { faker } from '@faker-js/faker';

export class DataFactory {
  static createBankAccount() {
    return {
      accountName: faker.company.name(),
      accountNumber: faker.finance.accountNumber(),
      balance: faker.finance.amount(),
    };
  }

  static createUser() {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
    };
  }
}
```

### 4. **Write Clear Test Names**

Use descriptive test names that explain what you're testing:

```typescript
// ❌ Bad
test('login', async ({ signInPage }) => {
  // ...
});

// ✅ Good
test('TC: User should successfully login with valid credentials', async ({ signInPage, homePage }) => {
  await signInPage.goto();
  await signInPage.signIn({ username: 'john@example.com', password: 'password123' });
  await expect(homePage.logoApp).toBeVisible();
});
```

### 5. **Use Data Attributes for Selectors**

Use `data-test` attributes instead of CSS classes or element types:

```html
<!-- HTML -->
<button data-test="sign-in-button">Sign In</button>
<input data-test="username" type="text" />
```

```typescript
// Selector
readonly signInButton = this.page.locator('[data-test="sign-in-button"]');
readonly usernameInput = this.page.locator('[data-test="username"]');
```

### 6. **Don't Use Hard-coded Waits**

```typescript
// ❌ Bad - hard-coded wait
await page.waitForTimeout(5000);

// ✅ Good - wait for element
await expect(homePage.successMessage).toBeVisible();
await homePage.successMessage.waitFor({ state: 'visible' });
```

### 7. **Use Environment Variables**

Store sensitive data in `.env` file:

```bash
# .env
SEED_USERNAME=testuser@example.com
SEED_PASSWORD=secretpassword123
BASE_URL=http://localhost:3000
```

Access in tests:

```typescript
const username = process.env.SEED_USERNAME!;
const password = process.env.SEED_PASSWORD!;
```

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Tests in Headed Mode (see browser)
```bash
npx playwright test --headed
```

### Run Specific Test File
```bash
npx playwright test tests/loginBank.spec.ts
```

### Run Tests with Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### View Test Report
```bash
npx playwright show-report
```

## Development Workflow

### Before Committing Code

Before you commit your changes, follow these steps to ensure code quality:

#### 1. **Format Your Code**
This automatically fixes code style issues:
```bash
npm run format
```

#### 2. **Fix Linting Errors**
This checks for code quality issues and fixes what it can:
```bash
npm run lint:fix
```

#### 3. **Check TypeScript Types**
This ensures there are no type errors:
```bash
npm run type-check
```

#### 4. **Run All Validation (Recommended)**
Run all checks at once:
```bash
npm run validate
```

This command runs: `format` → `lint:fix` → `type-check`

### Complete Git Workflow

```bash
# 1. Make your changes
# 2. Run validation
npm run validate

# 3. Run your tests
npx playwright test

# 4. Stage changes
git add .

# 5. Commit
git commit -m "Add new test for user signup"
```

## Code Quality

### Available Commands

| Command | Purpose |
|---------|---------|
| `npm run lint` | Check code for errors |
| `npm run lint:fix` | Auto-fix linting errors |
| `npm run format` | Format code automatically |
| `npm run type-check` | Check TypeScript types |
| `npm run validate` | Run format + lint + type-check |

### Pre-commit Hooks

This project uses **Husky** and **lint-staged** to automatically:
- Format code with Prettier
- Check for linting errors with ESLint
- Check TypeScript types

When you try to commit, it will automatically run these checks. If there are errors, the commit will fail and you need to fix them first.

### Environment Configuration

The project includes:
- **ESLint** (`eslint.config.js`) - Code quality checks
- **Prettier** (`.prettierrc`) - Code formatting
- **TypeScript** (`tsconfig.json`) - Type checking
- **Husky** (`.husky/pre-commit`) - Git hooks

## Troubleshooting

### Tests Not Running
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npx playwright install
```

### Browser Not Found
```bash
# Install Playwright browsers
npx playwright install
```

### Linting Errors Before Commit
```bash
# Run validation to fix issues
npm run validate

# If still not working, manually fix errors
git add .
git commit -m "Your message" --no-verify  # Skip hooks (not recommended)
```

## Learning Resources

- [Playwright Official Docs](https://playwright.dev/)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Locators Guide](https://playwright.dev/docs/locators)
- [Wait Strategies](https://playwright.dev/docs/actionability)

## Project Structure

```
learning-playwright/
├── tests/                    # Test files
│   ├── loginBank.spec.ts
│   ├── signup.spec.ts
│   └── updateAccount.spec.ts
├── pages/                    # Page objects
│   ├── HomePage.ts
│   ├── SignInPage.ts
│   └── bank-accounts/
│       └── CreateBankAccountPage.ts
├── fixtures/                 # Test fixtures
│   └── baseTest.ts
├── utils/                    # Utilities
│   └── data-factory.ts
├── eslint.config.js         # ESLint configuration
├── prettier.config.json     # Prettier configuration
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## Tips for Beginners

1. **Start Small** - Write one simple test first, then gradually add more complexity
2. **Use Selectors Wisely** - Prefer data attributes (`[data-test="..."]`) over fragile CSS selectors
3. **Check Logs** - Use `console.log()` for debugging during test development
4. **Read Error Messages** - Playwright provides clear error messages when things fail
5. **Run Tests Often** - Run tests frequently to catch issues early
6. **Keep Tests Independent** - Each test should be able to run alone without depending on others
7. **Use Assertions** - Always verify expected results with `expect()`

## Questions?

For more information:
- Check Playwright documentation: https://playwright.dev/
- Review the test files in the `tests/` folder
- Look at page objects in the `pages/` folder for real examples

Happy Testing! 🚀
