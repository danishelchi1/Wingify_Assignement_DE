import { expect, type Locator, type Page } from '@playwright/test';

export type DreamRowData = {
  dreamName: string;
  daysAgo: string;
  dreamType: string;
};

export type DreamNameAndType = {
  dreamName: string;
  dreamType: string;
};

const DREAM_TABLE_HEADERS = ['Dream Name', 'Days Ago', 'Dream Type'] as const;
const DREAM_NAME_COLUMN_INDEX = 0;
const DAYS_AGO_COLUMN_INDEX = 1;
const DREAM_TYPE_COLUMN_INDEX = 2;

export class DreamDiaryPage {
  readonly page: Page;
  readonly dreamLogTable: Locator;
  readonly headerCells: Locator;
  readonly dreamRows: Locator;
  readonly dreamTypeCells: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dreamLogTable = page.locator('#dreamsDiary');
    this.headerCells = this.dreamLogTable.locator('thead th');
    this.dreamRows = this.dreamLogTable.locator('tbody tr');
    this.dreamTypeCells = this.dreamRows.locator(`td:nth-child(${DREAM_TYPE_COLUMN_INDEX + 1})`);
  }

  async goto(): Promise<void> {
    await this.page.goto('./dreams-diary.html');
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /dreams diary/i })).toBeVisible();
    await expect(this.dreamLogTable).toBeVisible();
  }

  async getDreamRowsCount(): Promise<number> {
    return this.dreamRows.count();
  }

  async validateTableHeaders(): Promise<void> {
    await expect(this.headerCells).toHaveText([...DREAM_TABLE_HEADERS]);
  }

  async getDreamTypes(): Promise<string[]> {
    const dreamTypes = await this.dreamTypeCells.allTextContents();
    return dreamTypes.map((type) => type.trim());
  }

  async getRecurringDreams(): Promise<string[]> {
    const rows = await this.getAllRowData();
    const dreamNameCounts = new Map<string, number>();

    for (const row of rows) {
      dreamNameCounts.set(row.dreamName, (dreamNameCounts.get(row.dreamName) ?? 0) + 1);
    }

    return [...dreamNameCounts.entries()]
      .filter(([, count]) => count > 1)
      .map(([dreamName]) => dreamName);
  }

  async getAllRowData(): Promise<DreamRowData[]> {
    const rowCount = await this.getDreamRowsCount();
    const rows: DreamRowData[] = [];

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const cellValues = await this.getTrimmedCellValues(rowIndex);

      rows.push({
        dreamName: cellValues[DREAM_NAME_COLUMN_INDEX],
        daysAgo: cellValues[DAYS_AGO_COLUMN_INDEX],
        dreamType: cellValues[DREAM_TYPE_COLUMN_INDEX],
      });
    }

    return rows;
  }

  async getDreamNameAndType(): Promise<DreamNameAndType[]> {
    const rows = await this.getAllRowData();

    return rows.map(({ dreamName, dreamType }) => ({
      dreamName,
      dreamType,
    }));
  }

  async validateRowsHaveAllColumns(): Promise<void> {
    const rowCount = await this.dreamRows.count();

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const cellValues = await this.getTrimmedCellValues(rowIndex);

      for (const cellValue of cellValues) {
        expect(cellValue).not.toBe('');
      }
    }
  }

  private async getTrimmedCellValues(rowIndex: number): Promise<string[]> {
    const cells = this.dreamRows.nth(rowIndex).locator('td');

    await expect(cells).toHaveCount(DREAM_TABLE_HEADERS.length);

    const cellValues = await cells.allTextContents();
    return cellValues.map((value) => value.trim());
  }
}
