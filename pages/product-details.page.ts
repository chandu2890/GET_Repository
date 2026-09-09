import { expect, type Page } from '@playwright/test';
import { AppPage } from './app.page';

export class ProductDetailsPage extends AppPage {
  readonly addToCartButton = this.page.getByRole('button', { name: 'Add to cart' });
  readonly backToProductsButton = this.page.getByRole('button', { name: /Back to products/ });

  async expectProduct(productName: string, price: string): Promise<void> {
    await expect(this.page.getByText(productName, { exact: true })).toBeVisible();
    await expect(this.page.getByText(price, { exact: true })).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }
}