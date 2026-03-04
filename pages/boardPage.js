const { expect } = require('@playwright/test');

class BoardPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToProject(projectName) {
    try {
      await this.page.getByRole('button', { name: projectName }).click();
      await expect(this.page.locator('h2').first()).toBeVisible({ timeout: 10000 });
    } catch (error) {
      throw new Error(`Failed to navigate to project "${projectName}". Check the project name in testCases.json.\nDetails: ${error.message}`);
    }
  }

  getColumn(columnName) {
    try {
      return this.page.locator('div').filter({
        has: this.page.locator('h2').filter({ hasText: columnName })
      }).first();
    } catch (error) {
      throw new Error(`Failed to find column "${columnName}" on the board.\nDetails: ${error.message}`);
    }
  }

  async assertTaskInColumn(taskName, columnName) {
    try {
      const column = this.getColumn(columnName);
      await expect(column).toBeVisible({ timeout: 8000 });
      await expect(column.getByText(taskName, { exact: true })).toBeVisible({ timeout: 8000 });
    } catch (error) {
      throw new Error(`Task "${taskName}" was NOT found in column "${columnName}".\nEither the task name or column name is wrong. Check testCases.json.\nDetails: ${error.message}`);
    }
  }

  async assertTagsInColumn(columnName, expectedTags) {
    const column = this.getColumn(columnName);
    for (const tag of expectedTags) {
      try {
        await expect(column.getByText(tag, { exact: true }).first()).toBeVisible({ timeout: 5000 });
      } catch (error) {
        throw new Error(`Tag "${tag}" was NOT found in column "${columnName}".\nCheck the tags array in testCases.json.\nDetails: ${error.message}`);
      }
    }
  }

  async verifyTaskInColumnWithTags(taskName, columnName, expectedTags) {
    try {
      await this.assertTaskInColumn(taskName, columnName);
      await this.assertTagsInColumn(columnName, expectedTags);
    } catch (error) {
      throw new Error(`Verification failed for task "${taskName}" in column "${columnName}".\nDetails: ${error.message}`);
    }
  }
}

module.exports = { BoardPage };
