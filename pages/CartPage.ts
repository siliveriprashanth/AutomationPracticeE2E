import { expect, Locator, Page } from '@playwright/test';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export class CartPage {
  readonly page: Page;
  readonly header: Header;
  readonly footer: Footer;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.footer = new Footer(page);
  }

  async goto() {
    await this.page.goto('/view_cart');
  }

  async expectDisplayed() {
    await expect(this.page).toHaveURL(/\/view_cart/);
  }

  private productRow(productName: string): Locator {
    return this.page.locator('#cart_info_table tbody tr').filter({ hasText: productName }).first();
  }

  async expectProductInCart(productName: string) {
    await expect(this.productRow(productName)).toBeVisible();
  }

  async expectProductsInCart(productNames: string[]) {
    for (const productName of productNames) {
      await this.expectProductInCart(productName);
    }
  }

  async expectLineItem(productName: string, price: string, quantity: string, total: string) {
    const row = this.productRow(productName);
    await expect(row.locator('.cart_price')).toContainText(price);
    await expect(row.locator('.cart_quantity')).toContainText(quantity);
    await expect(row.locator('.cart_total')).toContainText(total);
  }

  async expectProductQuantity(productName: string, quantity: string) {
    await expect(this.productRow(productName).locator('.cart_quantity')).toContainText(quantity);
  }

  async proceedToCheckout() {
    await this.page.locator('.check_out').first().click();
  }

  async clickRegisterLoginFromCheckoutModal() {
    await this.page.goto('/login');
  }

  async removeProduct(productName: string) {
    await this.productRow(productName).locator('.cart_quantity_delete').click();
  }

  async expectProductRemoved(productName: string) {
    await expect(this.productRow(productName)).toHaveCount(0);
  }
}
