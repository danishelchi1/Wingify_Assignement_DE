import { expect, test } from '@playwright/test';
import { DreamDiaryPage } from '../pages/DreamDiaryPage';
import { DreamSummaryPage } from '../pages/DreamSummaryPage';
import { attachScreenshot } from '../utils/testArtifacts';

test('Validate Dream Summary statistics', async ({ page }, testInfo) => {
  const dreamDiaryPage = new DreamDiaryPage(page);
  const dreamSummaryPage = new DreamSummaryPage(page);
  const expectedRecurringDreams = ['Flying over mountains', 'Lost in maze'];
  let recurringDreams: string[] = [];
  let summaryRecurringDreamCount = 0;

  await test.step('Get recurring dreams from diary page', async () => {
    await dreamDiaryPage.goto();
    await dreamDiaryPage.verifyPageLoaded();
    recurringDreams = await dreamDiaryPage.getRecurringDreams();

    console.log(`Recurring dreams from diary: ${recurringDreams.join(', ')}`);
    await attachScreenshot(testInfo, 'dream-total-recurring-dreams-from-diary', page);
  });

  await test.step('Validate summary counts', async () => {
    await dreamSummaryPage.goto();
    await dreamSummaryPage.verifyPageLoaded();

    const goodDreamCount = await dreamSummaryPage.getGoodDreamCount();
    const badDreamCount = await dreamSummaryPage.getBadDreamCount();
    const totalDreamCount = await dreamSummaryPage.getTotalDreamCount();
    summaryRecurringDreamCount = await dreamSummaryPage.getRecurringDreamCount();

    console.log(
      `Summary counts retrieved: Good=${goodDreamCount}, Bad=${badDreamCount}, Total=${totalDreamCount}, Recurring=${summaryRecurringDreamCount}`,
    );

    expect(goodDreamCount).toBe(6);
    expect(badDreamCount).toBe(4);
    expect(totalDreamCount).toBe(10);
    expect(summaryRecurringDreamCount).toBe(2);
    await attachScreenshot(testInfo, 'dream-total-summary-counts-verified', page);
  });

  await test.step('Validate recurring dream names', async () => {
    expect(recurringDreams).toEqual(expectedRecurringDreams);
    console.log(`Recurring dream names verified: ${recurringDreams.join(', ')}`);
    await attachScreenshot(testInfo, 'dream-total-recurring-names-verified', page);
  });

  await test.step('Compare recurring count from diary and summary', async () => {
    console.log(
      `Recurring count comparison: diary=${recurringDreams.length}, summary=${summaryRecurringDreamCount}`,
    );
    expect(recurringDreams).toHaveLength(summaryRecurringDreamCount);
    await attachScreenshot(testInfo, 'dream-total-recurring-count-compared', page);
  });
});
