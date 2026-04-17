import { expect, Locator, Page } from '@playwright/test';

export class Header {
  readonly page: Page;
  readonly loggedInAsLabel: Locator;
  readonly deleteAccountLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loggedInAsLabel = page.locator('a:has(i.fa-user)');
    this.deleteAccountLink = page.getByRole('link', { name: /delete account/i });
    this.logoutLink = page.getByRole('link', { name: /logout/i });
  }

  async navigateToHome() {
    await this.page.goto('/');
  }

  async navigateToProducts() {
    await this.page.goto('/products');
  }

  async navigateToCart() {
    await this.page.goto('/view_cart');
  }

  async navigateToSignupLogin() {
    await this.page.goto('/login');
  }

  async navigateToTestCases() {
    await this.page.goto('/test_cases');
  }

  async navigateToContactUs() {
    await this.page.goto('/contact_us');
  }

  async expectLoggedInAs(name: string) {
    await expect(this.loggedInAsLabel).toContainText(name);
  }

  async logout() {
    await this.logoutLink.click();
  }

  async deleteAccount() {
    await this.deleteAccountLink.click();
  }
}
