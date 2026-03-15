import { test, expect } from '../fixtures/baseTest';
import { DataFactory } from '../utils/data-factory';

test.describe('Sign Up', () => {

    const user = DataFactory.createNewUser();

    test.beforeEach(async ({ signInPage, page }) => {
        await signInPage.goto();
    });

    test('TC: Login Bank Account', async ({ signInPage,baseDialog, page }) => {
        await signInPage.signIn(user);
        await expect(baseDialog.bodyDialog).not.toBeVisible();
        
    });
});