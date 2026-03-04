const { expect } = require('@playwright/test');
const { CREDENTIALS } = require('../utils/constants');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput    = page.locator('#username');
    this.passwordInput    = page.locator('#password');
    this.signInButton     = page.locator('button[type="submit"]');
    this.postLoginElement = page.locator('header h1').first();
  }

  async goto() {
    try {
      await this.page.goto('/');
    } catch (error) {
      throw new Error(`Failed to load the app URL. Check your internet connection.\nDetails: ${error.message}`);
    }
  }

  async enterUsername(username) {
    try {
      await this.usernameInput.fill(username);
    } catch (error) {
      throw new Error(`Failed to enter username. Input field not found.\nDetails: ${error.message}`);
    }
  }

  async enterPassword(password) {
    try {
      await this.passwordInput.fill(password);
    } catch (error) {
      throw new Error(`Failed to enter password. Input field not found.\nDetails: ${error.message}`);
    }
  }

  async clickSignIn() {
    try {
      await this.signInButton.click();
    } catch (error) {
      throw new Error(`Failed to click Sign In button. Button not found.\nDetails: ${error.message}`);
    }
  }

  async waitForDashboard() {
    try {
      await expect(this.postLoginElement).toBeVisible({ timeout: 15000 });
    } catch (error) {
      throw new Error(`Login failed. Dashboard did not load after sign in. Check credentials in utils/constants.js.\nDetails: ${error.message}`);
    }
  }

  async loginWithDefaultCredentials() {
    try {
      await this.goto();
      await this.enterUsername(CREDENTIALS.username);
      await this.enterPassword(CREDENTIALS.password);
      await this.clickSignIn();
      await this.waitForDashboard();
    } catch (error) {
      throw new Error(`Login flow failed.\nDetails: ${error.message}`);
    }
  }
}

module.exports = { LoginPage };
