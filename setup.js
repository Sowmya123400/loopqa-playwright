const fs = require('fs');
const path = require('path');
const root = __dirname;

function write(filePath, content) {
  const full = path.join(root, filePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart(), 'utf8');
  console.log('Written:', filePath);
}

write('utils/constants.js', `
const BASE_URL = 'https://animated-gingersnap-8cf7f2.netlify.app';
const CREDENTIALS = { username: 'admin', password: 'password123' };
module.exports = { BASE_URL, CREDENTIALS };
`);

write('pages/loginPage.js', `
const { expect } = require('@playwright/test');
const { CREDENTIALS } = require('../utils/constants');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput    = page.locator('#username');
    this.passwordInput    = page.locator('#password');
    this.signInButton     = page.locator('button[type="submit"]');
    this.postLoginElement = page.locator('header h1');
  }
  async goto() { await this.page.goto('/'); }
  async enterUsername(u) { await this.usernameInput.fill(u); }
  async enterPassword(p) { await this.passwordInput.fill(p); }
  async clickSignIn() { await this.signInButton.click(); }
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
`);

write('pages/boardPage.js', `
const { expect } = require('@playwright/test');

class BoardPage {
  constructor(page) { this.page = page; }

  async navigateToProject(projectName) {
    await this.page.getByRole('button', { name: projectName }).click();
    await expect(this.page.locator('h2').first()).toBeVisible({ timeout: 10000 });
  }

  getColumn(columnName) {
    return this.page.locator('div').filter({
      has: this.page.locator('h2').filter({ hasText: columnName })
    }).first();
  }

  async assertTaskInColumn(taskName, columnName) {
    const column = this.getColumn(columnName);
    await expect(column).toBeVisible({ timeout: 8000 });
    await expect(column.getByText(taskName, { exact: true })).toBeVisible({ timeout: 8000 });
  }

  async assertTagsInColumn(columnName, expectedTags) {
    const column = this.getColumn(columnName);
    for (const tag of expectedTags) {
      await expect(column.getByText(tag, { exact: true }).first()).toBeVisible({ timeout: 5000 });
    }
  }

  async verifyTaskInColumnWithTags(taskName, columnName, expectedTags) {
    await this.assertTaskInColumn(taskName, columnName);
    await this.assertTagsInColumn(columnName, expectedTags);
  }
}
module.exports = { BoardPage };
`);

write('tests/data/testCases.json', `
[
  { "id": "TC-01", "project": "Web Application",    "task": "Implement user authentication", "column": "To Do",       "tags": ["Feature", "High Priority"] },
  { "id": "TC-02", "project": "Web Application",    "task": "Fix navigation bug",            "column": "To Do",       "tags": ["Bug"] },
  { "id": "TC-03", "project": "Web Application",    "task": "Design system updates",         "column": "In Progress", "tags": ["Design"] },
  { "id": "TC-04", "project": "Mobile Application", "task": "Push notification system",      "column": "To Do",       "tags": ["Feature"] },
  { "id": "TC-05", "project": "Mobile Application", "task": "Offline mode",                  "column": "In Progress", "tags": ["Feature", "High Priority"] },
  { "id": "TC-06", "project": "Mobile Application", "task": "App icon design",               "column": "Done",        "tags": ["Design"] }
]
`);

write('tests/board.spec.js', `
const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { BoardPage } = require('../pages/boardPage');
const testCases = require('./data/testCases.json');

for (const tc of testCases) {
  test(\`[\${tc.id}] \${tc.project} | "\${tc.task}" should be in "\${tc.column}"\`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const boardPage = new BoardPage(page);
    await loginPage.loginWithDefaultCredentials();
    await boardPage.navigateToProject(tc.project);
    await boardPage.verifyTaskInColumnWithTags(tc.task, tc.column, tc.tags);
  });
}
`);

write('playwright.config.js', `
const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'https://animated-gingersnap-8cf7f2.netlify.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
`);

console.log('\n All files created! Now run: npx playwright test\n');