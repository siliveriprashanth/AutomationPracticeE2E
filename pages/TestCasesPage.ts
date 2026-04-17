import { expect, Page } from '@playwright/test';
import { Header } from './components/Header';

export class TestCasesPage {
  readonly page: Page;
  readonly header: Header;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
  }

  async goto() {
    await this.page.goto('/test_cases');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/test_cases/);
    await expect(this.page.getByText(/^test cases$/i)).toBeVisible();
  }
}
