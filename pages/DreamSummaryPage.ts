import { expect, type Locator, type Page } from '@playwright/test';

export class DreamSummaryPage {
  readonly page: Page;
  readonly dreamsTotalTable: Locator;
  readonly summaryRows: Locator;
  readonly goodDreamsRow: Locator;
  readonly badDreamsRow: Locator;
  readonly totalDreamsRow: Locator;
  readonly recurringDreamsRow: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dreamsTotalTable = page.locator('#dreamsTotal');
    this.summaryRows = this.dreamsTotalTable.locator('tbody tr');
    this.goodDreamsRow = this.getSummaryRowByLabel('Good Dreams');
    this.badDreamsRow = this.getSummaryRowByLabel('Bad Dreams');
    this.totalDreamsRow = this.getSummaryRowByLabel('Total Dreams');
    this.recurringDreamsRow = this.getSummaryRowByLabel('Recurring Dreams');
  }

  async goto(): Promise<void> {
    await this.page.goto('./dreams-total.html');
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /dreams summary/i })).toBeVisible();
    await expect(this.dreamsTotalTable).toBeVisible();
  }

  async getGoodDreamCount(): Promise<number> {
    return this.getCountFromRow(this.goodDreamsRow);
  }

  async getBadDreamCount(): Promise<number> {
    return this.getCountFromRow(this.badDreamsRow);
  }

  async getTotalDreamCount(): Promise<number> {
    return this.getCountFromRow(this.totalDreamsRow);
  }

  async getRecurringDreamCount(): Promise<number> {
    return this.getCountFromRow(this.recurringDreamsRow);
  }

  private getSummaryRowByLabel(label: string): Locator {
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return this.summaryRows.filter({
      has: this.page.getByRole('cell', { name: new RegExp(`^${escapedLabel}$`, 'i') }),
    });
  }

  private async getCountFromRow(row: Locator): Promise<number> {
    await expect(row).toHaveCount(1);

    const countText = (await row.locator('td').nth(1).innerText()).trim();
    const count = Number(countText);

    expect(Number.isInteger(count)).toBe(true);
    return count;
  }
}
