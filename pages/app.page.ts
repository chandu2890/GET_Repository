import { expect, type Page } from '@playwright/test';

export class AppPage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle('Swag Labs');
  }

  async openMenu(): Promise<void> {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.page.locator('[data-test="logout-sidebar-link"]').click();
  }
}