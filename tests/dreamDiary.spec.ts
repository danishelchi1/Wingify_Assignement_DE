import { expect, test } from '@playwright/test';
import { DreamDiaryPage } from '../pages/DreamDiaryPage';
import { attachScreenshot } from '../utils/testArtifacts';

test('Validate Dream Diary table data', async ({ page }, testInfo) => {
  const dreamDiaryPage = new DreamDiaryPage(page);

  await dreamDiaryPage.goto();
  await dreamDiaryPage.verifyPageLoaded();
  await dreamDiaryPage.validateTableHeaders();

  await test.step('Verify row count', async () => {
    await expect.poll(() => dreamDiaryPage.getDreamRowsCount()).toBe(10);

    const rowCount = await dreamDiaryPage.getDreamRowsCount();
    console.log(`Dream Diary row count verified: ${rowCount}`);
    await attachScreenshot(testInfo, 'dream-diary-row-count-verified', page);
  });

  await test.step('Verify dream types', async () => {
    const dreamTypes = await dreamDiaryPage.getDreamTypes();
    expect(dreamTypes).toHaveLength(10);

    for (const dreamType of dreamTypes) {
      expect(dreamType).toMatch(/^(Good|Bad)$/);
    }

    console.log(`Dream types verified: ${[...new Set(dreamTypes)].join(', ')}`);
    await attachScreenshot(testInfo, 'dream-diary-types-verified', page);
  });

  await test.step('Verify all columns populated', async () => {
    const rowData = await dreamDiaryPage.getAllRowData();
    expect(rowData).toHaveLength(10);

    await dreamDiaryPage.validateRowsHaveAllColumns();
    console.log(`Column population verified for ${rowData.length} dream rows`);
    await attachScreenshot(testInfo, 'dream-diary-all-columns-populated', page);
  });
});
