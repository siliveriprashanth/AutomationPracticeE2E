import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';
import { HomePage } from '../../pages/HomePage';

test.describe('Automation Exercise subscription and scroll cases', () => {
  test('TC10 - Verify Subscription in home page @regression', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.open();
    await homePage.footer.scrollToFooter();
    await homePage.footer.expectSubscriptionVisible();
    await homePage.footer.subscribe(`home.subscription.${Date.now()}@example.com`);
    await homePage.footer.expectSubscriptionSuccess();
  });

  test('TC11 - Verify Subscription in Cart page @regression', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.open();
    await homePage.header.navigateToCart();
    await cartPage.expectDisplayed();
    await cartPage.footer.scrollToFooter();
    await cartPage.footer.expectSubscriptionVisible();
    await cartPage.footer.subscribe(`cart.subscription.${Date.now()}@example.com`);
    await cartPage.footer.expectSubscriptionSuccess();
  });

  test('TC25 - Verify Scroll Up using Arrow button and Scroll Down functionality @regression', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.open();
    await homePage.scrollDownToFooter();
    await homePage.footer.expectSubscriptionVisible();
    await homePage.scrollToTopWithArrow();
    await expect(
      page.getByText(/full-fledged practice website for automation engineers/i).first(),
    ).toBeVisible();
  });

  test('TC26 - Verify Scroll Up without Arrow button and Scroll Down functionality @regression', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.open();
    await homePage.scrollDownToFooter();
    await homePage.footer.expectSubscriptionVisible();
    await homePage.scrollToTopManually();
    await expect(
      page.getByText(/full-fledged practice website for automation engineers/i).first(),
    ).toBeVisible();
  });
});
