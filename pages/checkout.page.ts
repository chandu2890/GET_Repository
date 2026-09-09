import { expect, type Page } from '@playwright/test';
import { AppPage } from './app.page';

export class CheckoutPage extends AppPage {
  readonly firstNameInput = this.page.getByRole('textbox', { name: 'First Name' });
  readonly lastNameInput = this.page.getByRole('textbox', { name: 'Last Name' });
  readonly postalCodeInput = this.page.getByRole('textbox', { name: 'Zip/Postal Code' });
  readonly continueButton = this.page.getByRole('button', { name: 'Continue' });
  readonly finishButton = this.page.getByRole('button', { name: 'Finish' });

  async expectInformationStep(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
    await expect(this.page.getByText('Checkout: Your Information', { exact: true })).toBeVisible();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: message })).toBeVisible();
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async expectOverview(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    await expect(this.page.getByText('Checkout: Overview', { exact: true })).toBeVisible();
  }

  async expectOrderSummary(
    payment: string,
    shipping: string,
    itemTotal: string,
    tax: string,
    total: string,
  ): Promise<void> {
    await expect(this.page.getByText(payment, { exact: true })).toBeVisible();
    await expect(this.page.getByText(shipping, { exact: true })).toBeVisible();
    await expect(this.page.getByText(`Item total: ${itemTotal}`, { exact: true })).toBeVisible();
    await expect(this.page.getByText(`Tax: ${tax}`, { exact: true })).toBeVisible();
    await expect(this.page.getByText(`Total: ${total}`, { exact: true })).toBeVisible();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async expectComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  }
}