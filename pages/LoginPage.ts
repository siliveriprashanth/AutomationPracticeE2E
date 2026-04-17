import { expect, Page } from '@playwright/test';
import { Header } from './components/Header';

export class LoginPage {
  readonly page: Page;
  readonly header: Header;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
  }

  async goto() {
    await this.page.goto('/login');
  }

  async expectLoginFormVisible() {
    await expect(this.page.getByText(/login to your account/i)).toBeVisible();
  }

  async expectSignupFormVisible() {
    await expect(this.page.getByText(/new user signup!/i)).toBeVisible();
  }

  async signUp(name: string, email: string) {
    await this.page.locator('[data-qa="signup-name"]').fill(name);
    await this.page.locator('[data-qa="signup-email"]').fill(email);
    await this.page.locator('[data-qa="signup-button"]').click();
  }

  async login(email: string, password: string) {
    await this.page.locator('[data-qa="login-email"]').fill(email);
    await this.page.locator('[data-qa="login-password"]').fill(password);
    await this.page.locator('[data-qa="login-button"]').click();
  }

  async expectLoginError() {
    await expect(this.page.getByText(/your email or password is incorrect!/i)).toBeVisible();
  }

  async expectExistingEmailError() {
    await expect(this.page.getByText(/email address already exist!/i)).toBeVisible();
  }
}
