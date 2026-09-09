import { test } from './fixtures';

test.describe('Shopping cart', () => {
  test('user can add and remove a product', async ({ loginPage, inventoryPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addProduct('sauce-labs-backpack');
    await inventoryPage.expectCartCount(1);
    await inventoryPage.openCart();

    await cartPage.expectLoaded();
    await cartPage.expectProduct('Sauce Labs Backpack');
    await cartPage.removeProduct('sauce-labs-backpack');
    await cartPage.expectEmpty();
  });
});