import { test } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';
import { HomePage } from '../../pages/HomePage';
import { ProductDetailsPage } from '../../pages/ProductDetailsPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { createTestUser } from './support/testData';
import { deleteCurrentUser, loginUser, logoutUser, registerUser } from './support/userFlows';

test.describe('Automation Exercise product cases', () => {
  test('TC08 - Verify All Products and product detail page', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    await homePage.open();
    await homePage.header.navigateToProducts();
    await productsPage.expectLoaded();
    await productsPage.expectProductsListVisible();
    await productsPage.openFirstProductDetails();
    await productDetailsPage.expectLoaded();
    await productDetailsPage.expectProductDetailsVisible();
  });

  test('TC09 - Search Product', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    await homePage.open();
    await homePage.header.navigateToProducts();
    await productsPage.expectLoaded();
    await productsPage.searchFor('Blue Top');
    await productsPage.expectSearchResultsContain('Blue Top');
  });

  test('TC18 - View Category Products', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    await homePage.open();
    await productsPage.expectCategoriesVisible();
    await productsPage.openWomenCategory('Dress');
    await productsPage.expectCategoryPageVisible('Women');
    await productsPage.openMenCategory('Tshirts');
    await productsPage.expectCategoryPageVisible('Men');
  });

  test('TC19 - View and Cart Brand Products', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.goto();
    await productsPage.expectLoaded();
    await productsPage.expectBrandsVisible();
    await productsPage.openBrand('Polo');
    await productsPage.expectBrandPageVisible('Polo');
    await productsPage.openBrand('H&M');
    await productsPage.expectBrandPageVisible('H&M');
  });

  test('TC20 - Search Products and Verify Cart After Login', async ({ page }) => {
    const user = createTestUser('tc20');
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await registerUser(page, user);
    await logoutUser(page);

    await productsPage.goto();
    await productsPage.expectLoaded();
    await productsPage.searchFor('Top');
    await productsPage.expectSearchedProductsVisible();
    const productNames = await productsPage.getFirstNProductNames(2);
    await productsPage.addFirstNSearchedProductsToCart(2);
    await productsPage.viewCartFromModal();
    await cartPage.expectProductsInCart(productNames);

    await cartPage.header.navigateToSignupLogin();
    await loginUser(page, user);
    await cartPage.header.navigateToCart();
    await cartPage.expectProductsInCart(productNames);
    await deleteCurrentUser(page);
  });

  test('TC21 - Add review on product', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    await productsPage.goto();
    await productsPage.expectLoaded();
    await productsPage.openFirstProductDetails();
    await productDetailsPage.expectLoaded();
    await productDetailsPage.submitReview(
      'Automation Reviewer',
      'reviewer@example.com',
      'Great product page for end-to-end automation.',
    );
    await productDetailsPage.expectReviewSuccess();
  });

  test('TC22 - Add to cart from Recommended items', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.open();
    await homePage.addFirstRecommendedItemToCart();
    await cartPage.goto();
    await cartPage.expectDisplayed();
  });
});
