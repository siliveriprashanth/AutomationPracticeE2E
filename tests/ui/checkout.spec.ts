import { Page, test } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { HomePage } from '../../pages/HomePage';
import { ProductsPage } from '../../pages/ProductsPage';
import { createTestUser, defaultCheckoutComment, defaultPaymentDetails } from './support/testData';
import { deleteCurrentUser, loginUser, logoutUser, registerUser } from './support/userFlows';

async function addDefaultProductToCart(page: Page) {
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);

  await homePage.open();
  await homePage.header.navigateToProducts();
  await productsPage.expectLoaded();
  await productsPage.addProductToCart('Blue Top');
  await productsPage.viewCartFromModal();
}

async function completeOrder(page: Page) {
  const checkoutPage = new CheckoutPage(page);

  await checkoutPage.expectAddressAndOrderVisible();
  await checkoutPage.placeOrder(defaultCheckoutComment);
  await checkoutPage.fillPaymentDetails(defaultPaymentDetails);
  await checkoutPage.payAndConfirmOrder();
  await checkoutPage.expectOrderPlaced();
}

test.describe('Automation Exercise checkout cases', () => {
  test('TC14 - Place Order Register while Checkout', async ({ page }) => {
    const user = createTestUser('tc14');
    const cartPage = new CartPage(page);

    await addDefaultProductToCart(page);
    await cartPage.expectDisplayed();
    await cartPage.proceedToCheckout();
    await cartPage.clickRegisterLoginFromCheckoutModal();
    await registerUser(page, user, false);
    await cartPage.header.navigateToCart();
    await cartPage.proceedToCheckout();
    await completeOrder(page);
    await deleteCurrentUser(page);
  });

  test('TC15 - Place Order Register before Checkout', async ({ page }) => {
    const user = createTestUser('tc15');
    const cartPage = new CartPage(page);
    const productsPage = new ProductsPage(page);

    await registerUser(page, user);
    await cartPage.header.navigateToProducts();
    await productsPage.addProductToCart('Blue Top');
    await productsPage.viewCartFromModal();
    await cartPage.proceedToCheckout();
    await completeOrder(page);
    await deleteCurrentUser(page);
  });

  test('TC16 - Place Order Login before Checkout', async ({ page }) => {
    const user = createTestUser('tc16');
    const cartPage = new CartPage(page);
    const productsPage = new ProductsPage(page);

    await registerUser(page, user);
    await logoutUser(page);
    await loginUser(page, user);
    await cartPage.header.navigateToProducts();
    await productsPage.addProductToCart('Blue Top');
    await productsPage.viewCartFromModal();
    await cartPage.proceedToCheckout();
    await completeOrder(page);
    await deleteCurrentUser(page);
  });

  test('TC23 - Verify address details in checkout page', async ({ page }) => {
    const user = createTestUser('tc23');
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const productsPage = new ProductsPage(page);

    await registerUser(page, user);
    await cartPage.header.navigateToProducts();
    await productsPage.addProductToCart('Blue Top');
    await productsPage.viewCartFromModal();
    await cartPage.proceedToCheckout();
    const addressName = `Mr. ${user.firstName} ${user.lastName}`;
    await checkoutPage.expectAddressContains('delivery', [
      addressName,
      user.company,
      user.address,
      user.address2,
      user.city,
      user.state,
      user.zipCode,
      user.country,
      user.mobileNumber,
    ]);
    await checkoutPage.expectAddressContains('invoice', [
      addressName,
      user.company,
      user.address,
      user.address2,
      user.city,
      user.state,
      user.zipCode,
      user.country,
      user.mobileNumber,
    ]);
    await deleteCurrentUser(page);
  });

  test('TC24 - Download Invoice after purchase order', async ({ page }) => {
    const user = createTestUser('tc24');
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await addDefaultProductToCart(page);
    await cartPage.proceedToCheckout();
    await cartPage.clickRegisterLoginFromCheckoutModal();
    await registerUser(page, user, false);
    await cartPage.header.navigateToCart();
    await cartPage.proceedToCheckout();
    await completeOrder(page);
    await checkoutPage.downloadInvoice();
    await checkoutPage.continueAfterOrder();
    await deleteCurrentUser(page);
  });
});
