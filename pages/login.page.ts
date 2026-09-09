import { expect, type Page } from '@playwright/test';
import { AppPage } from './app.page';

export class LoginPage extends AppPage {
  private readonly usernameInput = this.page.getByRole('textbox', { name: 'Username' });
  private readonly passwordInput = this.page.getByRole('textbox', { name: 'Password' });
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' });

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.expectTitle();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: message })).toBeVisible();
  }

  async expectDocumentedCredentials(usernames: string[], password: string): Promise<void> {
    const credentials = this.page.locator('#login_credentials');
    const passwordHint = this.page.locator('.login_password');

    for (const username of usernames) {
      await expect(credentials).toContainText(username);
    }
    await expect(passwordHint).toContainText(password);
  }
}