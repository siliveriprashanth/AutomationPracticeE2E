import { expect, Page } from '@playwright/test';
import path from 'path';
import { Header } from './components/Header';

export class ContactUsPage {
  readonly page: Page;
  readonly header: Header;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
  }

  async goto() {
    await this.page.goto('/contact_us');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/contact_us/);
    await expect(this.page.getByText(/get in touch/i)).toBeVisible();
  }

  async submitForm(name: string, email: string, subject: string, message: string) {
    await this.page.locator('[data-qa="name"]').fill(name);
    await this.page.locator('[data-qa="email"]').fill(email);
    await this.page.locator('[data-qa="subject"]').fill(subject);
    await this.page.locator('[data-qa="message"]').fill(message);
    await this.page.locator('input[name="upload_file"]').setInputFiles(
      path.resolve('test-data', 'contact-upload.txt'),
    );

    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await this.page.locator('[data-qa="submit-button"]').click();
  }

  async expectSuccessMessage() {
    await expect(
      this.page.getByText(/success! your details have been submitted successfully\./i).first(),
    ).toBeVisible();
  }

  async goHome() {
    await this.page.locator('.btn.btn-success').click();
  }
}
