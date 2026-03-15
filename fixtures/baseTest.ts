import { test as base, expect } from '@playwright/test';
import { SignInPage } from '../pages/SignInPage';
import { SignupPage } from '../pages/SignUpPage';
import { HomePage } from '../pages/HomePage';
import { BaseDialog } from '../pages/dialogs/BaseDialogPage';


type Pages = {
    signInPage: SignInPage;
    signUpPage: SignupPage;
    homePage: HomePage;
    baseDialog: BaseDialog
};

export const test = base.extend<Pages>({

    page: async ({ page }, use) => {
        const originalGoto = page.goto.bind(page);

        page.goto = async (url, options) => {
            return await originalGoto(url, {
                waitUntil: 'networkidle', 
                ...options,
            });
        };

        await use(page);
    },

    signInPage: async ({ page }, use) => {
        const signInPage = new SignInPage(page);
        await use(signInPage);
    },
    signUpPage: async ({ page }, use) => {
        const signUpPage = new SignupPage(page);
        await use(signUpPage);
    },
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    baseDialog: async ({ page }, use) => {
        const baseDialog = new BaseDialog(page);
        await use(baseDialog);
    }
    
});

export { expect };