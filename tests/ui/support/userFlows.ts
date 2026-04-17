import { Page } from '@playwright/test';
import { Header } from '../../../pages/components/Header';
import { HomePage } from '../../../pages/HomePage';
import { LoginPage } from '../../../pages/LoginPage';
import { SignupPage } from '../../../pages/SignupPage';
import { TestUser } from './testData';

export async function registerUser(page: Page, user: TestUser, navigateToLogin = true) {
  if (navigateToLogin) {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.header.navigateToSignupLogin();
  }

  const loginPage = new LoginPage(page);
  const signupPage = new SignupPage(page);

  await loginPage.expectSignupFormVisible();
  await loginPage.signUp(user.name, user.email);
  await signupPage.fillAccountInformation(user);
  await signupPage.createAccount();
  await signupPage.expectAccountCreated();
  await signupPage.continue();
  await loginPage.header.expectLoggedInAs(user.name);
}

export async function loginUser(page: Page, user: TestUser) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.expectLoginFormVisible();
  await loginPage.login(user.email, user.password);
  await loginPage.header.expectLoggedInAs(user.name);
}

export async function logoutUser(page: Page) {
  const header = new Header(page);
  const loginPage = new LoginPage(page);

  await header.logout();
  await loginPage.expectLoginFormVisible();
}

export async function deleteCurrentUser(page: Page) {
  const header = new Header(page);
  const signupPage = new SignupPage(page);

  await header.deleteAccount();
  await signupPage.expectAccountDeleted();
  await signupPage.continue();
}
