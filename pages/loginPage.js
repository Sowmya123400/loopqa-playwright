const { expect } = require('@playwright/test');
const { CREDENTIALS } = require('../utils/constants');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signInButton  = page.locator('button[type="submit"]');
    this.postLoginElement = page.locator('header h1').first();
  }

  async goto() {
    await this.page.goto('/');
  }

  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async waitForDashboard() {
    await expect(this.postLoginElement).toBeVisible({ timeout: 15000 });
  }

  async loginWithDefaultCredentials() {
    await this.goto();
    await this.enterUsername(CREDENTIALS.username);
    await this.enterPassword(CREDENTIALS.password);
    await this.clickSignIn();
    await this.waitForDashboard();
  }
}

module.exports = { LoginPage };