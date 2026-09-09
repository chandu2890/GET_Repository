import { expect, type Page } from '@playwright/test';
import { AppPage } from './app.page';

export class InventoryPage extends AppPage {
  readonly cartLink = this.page.locator('[data-test="shopping-cart-link"]');
  readonly sortDropdown = this.page.locator('[data-test="product-sort-container"]');
  readonly productCards = this.page.locator('[data-test="inventory-item"]');

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.page.getByText('Products', { exact: true })).toBeVisible();
  }

  async addProduct(productSlug: string): Promise<void> {
    await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
  }

  async removeProduct(productSlug: string): Promise<void> {
    await this.page.locator(`[data-test="remove-${productSlug}"]`).click();
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(value);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async openProduct(productSlug: string): Promise<void> {
    await this.page.locator(`[data-test="item-${productSlug}-title-link"]`).click();
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.cartLink).toContainText(String(count));
  }

  async productNames(): Promise<string[]> {
    return this.productCards.locator('.inventory_item_name').allTextContents();
  }

  async productPrices(): Promise<string[]> {
    return this.productCards.locator('.inventory_item_price').allTextContents();
  }
}