import { expect, Locator, Page } from '@playwright/test';
import { Header } from './components/Header';

export class ProductsPage {
  readonly page: Page;
  readonly header: Header;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.productCards = page.locator('.features_items .product-image-wrapper');
  }

  async goto() {
    await this.page.goto('/products');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/products/);
    await expect(this.page.getByText(/all products/i)).toBeVisible();
  }

  async expectProductsListVisible() {
    await expect(this.productCards.first()).toBeVisible();
  }

  async searchFor(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async expectSearchedProductsVisible() {
    await expect(this.page.getByText(/searched products/i)).toBeVisible();
  }

  async expectSearchResultsContain(productName: string) {
    await this.expectSearchedProductsVisible();
    await expect(this.page.locator('.productinfo').filter({ hasText: productName }).first()).toBeVisible();
  }

  async openFirstProductDetails() {
    const href = await this.page
      .locator('.choose a')
      .filter({ hasText: /view product/i })
      .first()
      .getAttribute('href');

    if (!href) {
      throw new Error('Unable to find first product details link on the products page.');
    }

    await this.page.goto(href);
  }

  async addProductToCart(productName: string) {
    const productCard = this.productCards.filter({ hasText: productName }).first();
    await productCard.scrollIntoViewIfNeeded();
    await productCard.hover();
    await productCard.locator('a.add-to-cart').first().click();
  }

  async addNthProductToCart(index: number) {
    const productCard = this.productCards.nth(index);
    await productCard.scrollIntoViewIfNeeded();
    await productCard.hover();
    await productCard.locator('a.add-to-cart').first().click();
  }

  async continueShoppingFromModal() {
    await this.page.getByRole('button', { name: /continue shopping/i }).click();
  }

  async viewCartFromModal() {
    await expect(this.page.getByText(/your product has been added to cart/i)).toBeVisible();
    await this.page.goto('/view_cart');
  }

  async getFirstNProductNames(count: number) {
    const names = await this.page.locator('.features_items .productinfo p').allTextContents();
    return [...new Set(names.map((name) => name.trim()).filter(Boolean))].slice(0, count);
  }

  async addFirstNSearchedProductsToCart(count: number) {
    for (let index = 0; index < count; index += 1) {
      await this.addNthProductToCart(index);
      if (index < count - 1) {
        await this.continueShoppingFromModal();
      }
    }
  }

  async expectBrandsVisible() {
    await expect(this.page.getByText(/^brands$/i)).toBeVisible();
  }

  async openBrand(brandName: string) {
    const href = await this.page
      .locator('.brands_products')
      .getByRole('link', { name: new RegExp(brandName, 'i') })
      .first()
      .getAttribute('href');

    if (!href) {
      throw new Error(`Unable to find brand link for ${brandName}.`);
    }

    await this.page.goto(href);
  }

  async expectBrandPageVisible(brandName: string) {
    await expect(this.page).toHaveURL(/\/brand_products\//);
    await expect(this.page.locator('.title.text-center')).toContainText(brandName);
  }

  async expectCategoriesVisible() {
    await expect(this.page.getByText(/^category$/i)).toBeVisible();
  }

  async openWomenCategory(categoryName: string) {
    await this.page.locator('a[href="#Women"]').click();
    await this.page.locator('#Women').getByRole('link', { name: new RegExp(categoryName, 'i') }).click();
  }

  async openMenCategory(categoryName: string) {
    await this.page.locator('a[href="#Men"]').click();
    await this.page.locator('#Men').getByRole('link', { name: new RegExp(categoryName, 'i') }).click();
  }

  async expectCategoryPageVisible(expectedText: string) {
    await expect(this.page).toHaveURL(/\/category_products\//);
    await expect(this.page.locator('.title.text-center')).toContainText(expectedText);
  }
}
