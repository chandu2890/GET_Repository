import { test } from './fixtures';

test('standard user can add a product to the cart', async ({ loginPage, inventoryPage, cartPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.expectLoaded();
  await inventoryPage.addProduct('sauce-labs-backpack');
  await inventoryPage.openCart();

  await cartPage.expectLoaded();
  await cartPage.expectProduct('Sauce Labs Backpack');
});