import { test } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';
import { HomePage } from '../../pages/HomePage';
import { ProductDetailsPage } from '../../pages/ProductDetailsPage';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Automation Exercise cart cases', () => {
  test('TC12 - Add Products in Cart @smoke @regression', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await homePage.open();
    await homePage.header.navigateToProducts();
    await productsPage.expectLoaded();
    await productsPage.addNthProductToCart(0);
    await productsPage.continueShoppingFromModal();
    await productsPage.addNthProductToCart(1);
    await productsPage.viewCartFromModal();
    await cartPage.expectProductsInCart(['Blue Top', 'Men Tshirt']);
    await cartPage.expectLineItem('Blue Top', 'Rs. 500', '1', 'Rs. 500');
    await cartPage.expectLineItem('Men Tshirt', 'Rs. 400', '1', 'Rs. 400');
  });

  test('TC13 - Verify Product quantity in Cart @regression', async ({ page }) => {
    const homePage = new HomePage(page);
    const productDetailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);

    await homePage.open();
    await homePage.openFirstHomeProductDetails();
    await productDetailsPage.expectLoaded();
    await productDetailsPage.setQuantity(4);
    await productDetailsPage.addToCart();
    await productDetailsPage.viewCartFromModal();
    await cartPage.expectProductQuantity('Blue Top', '4');
  });

  test('TC17 - Remove Products From Cart @regression', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.expectLoaded();
    await productsPage.addProductToCart('Blue Top');
    await productsPage.viewCartFromModal();
    await cartPage.expectProductInCart('Blue Top');
    await cartPage.removeProduct('Blue Top');
    await cartPage.expectProductRemoved('Blue Top');
  });
});
