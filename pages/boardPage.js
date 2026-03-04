const { expect } = require('@playwright/test');

class BoardPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToProject(projectName) {
    await this.page.getByRole('button', { name: projectName }).click();
    await expect(this.page.locator('h2').first()).toBeVisible({ timeout: 10000 });
  }

  getColumn(columnName) {
    return this.page.locator(`div:has(h2:text-is("${columnName}"))`).first();
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
