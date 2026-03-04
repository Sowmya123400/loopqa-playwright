const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { BoardPage } = require('../pages/boardPage');
const testCases = require('./data/testCases.json');

for (const tc of testCases) {
  test(`[${tc.id}] ${tc.project} | "${tc.task}" should be in "${tc.column}"`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const boardPage = new BoardPage(page);

    await loginPage.loginWithDefaultCredentials();
    await boardPage.navigateToProject(tc.project);
    await boardPage.verifyTaskInColumnWithTags(tc.task, tc.column, tc.tags);
  });
}
