import { expect, test } from './fixtures';

test.describe('Catalog and product details', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectLoaded();
  });

  test('displays all products and supports sorting by price', async ({ inventoryPage }) => {
    await expect(inventoryPage.productCards).toHaveCount(6);
    await inventoryPage.sortBy('lohi');

    await expect(inventoryPage.productCards.first()).toContainText('Sauce Labs Onesie');
    await expect(inventoryPage.productCards.last()).toContainText('Sauce Labs Fleece Jacket');
  });

  test('opens a product detail page and adds the product to the cart', async ({
    inventoryPage,
    productDetailsPage,
  }) => {
    await inventoryPage.openProduct('4');

    await productDetailsPage.expectProduct('Sauce Labs Backpack', '$29.99');
    console.log('Product details page loaded successfully');
    await productDetailsPage.addToCart();
  });
});