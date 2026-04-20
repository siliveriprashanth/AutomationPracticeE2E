import { expect, Page } from '@playwright/test';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export class HomePage {
  readonly page: Page;
  readonly header: Header;
  readonly footer: Footer;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.footer = new Footer(page);
  }

  async goto() {
    await this.page.goto('/');
  }

  async dismissConsentIfVisible() {
    const consentButton = this.page.getByRole('button', { name: /consent/i });
    if (await consentButton.isVisible().catch(() => false)) {
      await consentButton.click();
    }
  }

  async open() {
    await this.goto();
    await this.dismissConsentIfVisible();
    await this.expectLoaded();
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/automationexercise\.com\/?(?:[#?].*)?$/);
    await expect(
      this.page.getByText(/full-fledged practice website for automation engineers/i).first(),
    ).toBeVisible();
  }

  async expectCategoriesVisible() {
    await expect(this.page.getByText(/^category$/i)).toBeVisible();
  }

  async openFirstHomeProductDetails() {
    const href = await this.page
      .locator('.features_items .choose a')
      .filter({ hasText: /view product/i })
      .first()
      .getAttribute('href');

    if (!href) {
      throw new Error('Unable to find first product details link on the home page.');
    }

    await this.page.goto(href);
  }

  async addFirstRecommendedItemToCart() {
    await this.page.locator('.recommended_items').scrollIntoViewIfNeeded();
    await expect(this.page.getByText(/recommended items/i)).toBeVisible();
    await this.page.locator('.recommended_items .active a.add-to-cart').first().click();
  }

  async scrollDownToFooter() {
    await this.footer.scrollToFooter();
  }

  async scrollToTopWithArrow() {
    await this.page.locator('#scrollUp').click();
  }

  async scrollToTopManually() {
    await this.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  }
}
