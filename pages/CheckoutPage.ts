import { Download, expect, Page } from '@playwright/test';
import path from 'path';
import { Header } from './components/Header';

export type PaymentDetails = {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
};

export class CheckoutPage {
  readonly page: Page;
  readonly header: Header;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
  }

  async expectAddressAndOrderVisible() {
    await expect(this.page.getByText(/address details/i)).toBeVisible();
    await expect(this.page.getByText(/review your order/i)).toBeVisible();
  }

  async expectAddressContains(section: 'delivery' | 'invoice', expectedLines: string[]) {
    const locator = this.page.locator(section === 'delivery' ? '#address_delivery' : '#address_invoice');
    for (const line of expectedLines) {
      await expect(locator).toContainText(line);
    }
  }

  async placeOrder(comment: string) {
    await this.page.locator('textarea[name="message"]').fill(comment);
    await this.page.getByRole('link', { name: /place order/i }).click();
  }

  async fillPaymentDetails(paymentDetails: PaymentDetails) {
    await this.page.locator('input[name="name_on_card"]').fill(paymentDetails.nameOnCard);
    await this.page.locator('input[name="card_number"]').fill(paymentDetails.cardNumber);
    await this.page.locator('input[name="cvc"]').fill(paymentDetails.cvc);
    await this.page.locator('input[name="expiry_month"]').fill(paymentDetails.expiryMonth);
    await this.page.locator('input[name="expiry_year"]').fill(paymentDetails.expiryYear);
  }

  async payAndConfirmOrder() {
    await this.page.getByRole('button', { name: /pay and confirm order/i }).click();
  }

  async expectOrderPlaced() {
    await expect(
      this.page.getByText(/congratulations! your order has been confirmed!|your order has been placed successfully!/i),
    ).toBeVisible();
  }

  async downloadInvoice() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.page.getByRole('link', { name: /download invoice/i }).click();
    const download = await downloadPromise;
    await this.saveDownload(download);
  }

  async continueAfterOrder() {
    await this.page.getByRole('link', { name: /continue/i }).click();
  }

  private async saveDownload(download: Download) {
    const outputPath = path.resolve('test-results', download.suggestedFilename());
    await download.saveAs(outputPath);
  }
}
