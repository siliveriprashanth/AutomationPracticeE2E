import { expect, Page } from '@playwright/test';

export class Footer {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async scrollToFooter() {
    await this.page.locator('#footer').scrollIntoViewIfNeeded();
  }

  async expectSubscriptionVisible() {
    await expect(this.page.getByText(/^subscription$/i)).toBeVisible();
  }

  async subscribe(email: string) {
    await this.page.locator('#susbscribe_email').fill(email);
    await this.page.locator('#subscribe').click();
  }

  async expectSubscriptionSuccess() {
    await expect(this.page.locator('.alert-success.alert')).toContainText(
      'You have been successfully subscribed!',
    );
  }
}
