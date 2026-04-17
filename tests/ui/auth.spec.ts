import { expect, test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { createTestUser } from './support/testData';
import { deleteCurrentUser, loginUser, logoutUser, registerUser } from './support/userFlows';

test.describe('Automation Exercise auth cases', () => {
  test('TC01 - Register User', async ({ page }) => {
    const user = createTestUser('tc01');

    await registerUser(page, user);
    await deleteCurrentUser(page);
    await expect(page).toHaveURL(/automationexercise\.com\/?$/);
  });

  test('TC02 - Login User with correct email and password', async ({ page }) => {
    const user = createTestUser('tc02');

    await registerUser(page, user);
    await logoutUser(page);
    await loginUser(page, user);
    await deleteCurrentUser(page);
  });

  test('TC03 - Login User with incorrect email and password', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.open();
    await homePage.header.navigateToSignupLogin();
    await loginPage.expectLoginFormVisible();
    await loginPage.login('invalid.user@example.com', 'wrong-password');
    await loginPage.expectLoginError();
  });

  test('TC04 - Logout User', async ({ page }) => {
    const user = createTestUser('tc04');

    await registerUser(page, user);
    await logoutUser(page);
    await loginUser(page, user);
    await deleteCurrentUser(page);
  });

  test('TC05 - Register User with existing email', async ({ page }) => {
    const user = createTestUser('tc05');
    const loginPage = new LoginPage(page);

    await registerUser(page, user);
    await logoutUser(page);
    await loginPage.signUp(user.name, user.email);
    await loginPage.expectExistingEmailError();
    await loginUser(page, user);
    await deleteCurrentUser(page);
  });
});
