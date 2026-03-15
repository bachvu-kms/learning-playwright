import { test, expect } from '../fixtures/baseTest';
import { DataFactory } from '../utils/data-factory';

test.describe('Sign Up', () => {

    const user = DataFactory.createNewUser();

    test.beforeEach(async ({ signInPage, page }) => {
        await signInPage.goto();

        await expect(signInPage.dontHaveAccountButton).toBeVisible();

        await expect(signInPage.dontHaveAccountButton).toBeEnabled();
        
        // workaround: double click due to the issue with single click not working on the button
        await expect(async () => {
            await signInPage.clickDontHaveAccount();
            await expect(page).toHaveURL(/.*signup/);
        }).toPass();


    });

    test('TC: Sign up with valid data', async ({ signUpPage, signInPage,baseDialog, page }) => {
        await signUpPage.signUp(user);
        await expect(page).toHaveURL('/signin');
        await signInPage.signIn(user);
        await expect(baseDialog.bodyDialog).toBeVisible();
        
    });
});