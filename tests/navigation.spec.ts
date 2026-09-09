import { test } from './fixtures';

test.describe('Navigation and session controls', () => {
  test('continue shopping returns to the inventory', async ({
    loginPage,
    inventoryPage,
    cartPage,
  }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.continueShopping();

    await inventoryPage.expectLoaded();
  });
});