const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { BoardPage } = require('../pages/boardPage');
const testCases = require('./data/testCases.json');

// Validate testCases.json is not empty before running
if (!testCases || testCases.length === 0) {
  throw new Error('testCases.json is empty or invalid. Add at least one test case.');
}

for (const tc of testCases) {
  test(`[${tc.id}] ${tc.project} | "${tc.task}" should be in "${tc.column}"`, async ({ page }) => {
    
    // Validate required fields exist in JSON before running test
    if (!tc.project || !tc.task || !tc.column || !tc.tags) {
      throw new Error(`Test case "${tc.id}" is missing required fields. Check testCases.json.`);
    }

    const loginPage = new LoginPage(page);
    const boardPage = new BoardPage(page);

    // Step 1 — Login
    await loginPage.loginWithDefaultCredentials();

    // Step 2 — Navigate to project
    await boardPage.navigateToProject(tc.project);

    // Step 3 — Verify task and tags
    await boardPage.verifyTaskInColumnWithTags(tc.task, tc.column, tc.tags);
  });
}
