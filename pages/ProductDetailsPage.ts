import { expect, Page } from '@playwright/test';
import { Header } from './components/Header';

export class ProductDetailsPage {
  readonly page: Page;
  readonly header: Header;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/product_details\//);
    await expect(this.page.locator('.product-information h2')).toBeVisible();
  }

  async expectProductDetailsVisible() {
    const productInformation = this.page.locator('.product-information');
    await expect(productInformation.locator('h2')).toBeVisible();
    await expect(productInformation.getByText(/category:/i)).toBeVisible();
    await expect(productInformation.getByText(/rs\./i)).toBeVisible();
    await expect(productInformation.getByText(/availability:/i)).toBeVisible();
    await expect(productInformation.getByText(/condition:/i)).toBeVisible();
    await expect(productInformation.getByText(/brand:/i)).toBeVisible();
  }

  async setQuantity(quantity: number) {
    await this.page.locator('#quantity').fill(String(quantity));
  }

  async addToCart() {
    await this.page.locator('.product-information').getByRole('button', { name: /add to cart/i }).click();
  }

  async viewCartFromModal() {
    await this.page.goto('/view_cart');
  }

  async submitReview(name: string, email: string, review: string) {
    await expect(this.page.getByText(/write your review/i)).toBeVisible();
    await this.page.locator('#name').fill(name);
    await this.page.locator('#email').fill(email);
    await this.page.locator('#review').fill(review);
    await this.page.locator('#button-review').click();
  }

  async expectReviewSuccess() {
    await expect(this.page.getByText(/thank you for your review\./i)).toBeVisible();
  }
}
