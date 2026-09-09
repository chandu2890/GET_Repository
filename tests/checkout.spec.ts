import { test } from './fixtures';

test.describe('Checkout and order completion', () => {
  test('user can complete an order', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addProduct('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.expectInformationStep();
    await checkoutPage.fillInformation('Ada', 'Lovelace', '12345');
    await checkoutPage.continueToOverview();
    await checkoutPage.expectOverview();
    await checkoutPage.finishOrder();
    await checkoutPage.expectComplete();
  });

  test('checkout requires first name', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addProduct('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.continueToOverview();

    await checkoutPage.expectInformationStep();
    await checkoutPage.expectError('Error: First Name is required');
  });
});