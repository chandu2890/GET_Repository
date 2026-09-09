import { expect, type Page } from '@playwright/test';
import { AppPage } from './app.page';

export class CartPage extends AppPage {
  readonly checkoutButton = this.page.getByRole('button', { name: 'Checkout' });
  readonly continueShoppingButton = this.page.getByRole('button', { name: /Continue Shopping/ });

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/cart\.html/);
    await expect(this.page.getByText('Your Cart', { exact: true })).toBeVisible();
  }

  async expectProduct(productName: string): Promise<void> {
    await expect(this.page.getByRole('link', { name: productName })).toBeVisible();
  }

  async removeProduct(productSlug: string): Promise<void> {
    await this.page.locator(`[data-test="remove-${productSlug}"]`).click();
  }

  async expectEmpty(): Promise<void> {
    await expect(this.page.locator('[data-test="inventory-item"]')).toHaveCount(0);
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}