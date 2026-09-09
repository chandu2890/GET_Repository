import { expect, test } from './fixtures';

const documentedUsernames = [
  'standard_user',
  'locked_out_user',
  'problem_user',
  'performance_glitch_user',
  'error_user',
  'visual_user',
];

test.describe('Observed application contract', () => {
  test('login page exposes the documented users and password', async ({ loginPage }) => {
    await loginPage.goto();

    await loginPage.expectDocumentedCredentials(documentedUsernames, 'secret_sauce');
  });

  test('catalog exposes the observed products and prices', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectLoaded();

    await expect(await inventoryPage.productNames()).toEqual([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ]);
    await expect(await inventoryPage.productPrices()).toEqual([
      '$29.99',
      '$9.99',
      '$15.99',
      '$49.99',
      '$7.99',
      '$15.99',
    ]);
  });

  test('catalog supports all observed sort options', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.sortBy('az');
    await expect(await inventoryPage.productNames()).toEqual([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ]);

    await inventoryPage.sortBy('za');
    await expect(await inventoryPage.productNames()).toEqual([
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Onesie',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Bike Light',
      'Sauce Labs Backpack',
    ]);

    await inventoryPage.sortBy('lohi');
    await expect(await inventoryPage.productPrices()).toEqual([
      '$7.99',
      '$9.99',
      '$15.99',
      '$15.99',
      '$29.99',
      '$49.99',
    ]);

    await inventoryPage.sortBy('hilo');
    await expect(await inventoryPage.productPrices()).toEqual([
      '$49.99',
      '$29.99',
      '$15.99',
      '$15.99',
      '$9.99',
      '$7.99',
    ]);
  });

  test('checkout shows the observed payment, shipping, and totals', async ({
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
    await checkoutPage.fillInformation('Ada', 'Lovelace', '12345');
    await checkoutPage.continueToOverview();

    await checkoutPage.expectOverview();
    await checkoutPage.expectOrderSummary(
      'SauceCard #31337',
      'Free Pony Express Delivery!',
      '$29.99',
      '$2.40',
      '$32.39',
    );
  });
});