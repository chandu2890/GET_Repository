import { test } from './fixtures';

test.describe('Authentication and session', () => {
  test('standard user can sign in', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.expectLoaded();
  });

  test('locked out user cannot sign in', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await loginPage.expectError('Epic sadface: Sorry, this user has been locked out.');
  });

  test('authenticated user can log out', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.logout();

    await loginPage.expectError('Username');
  });
});