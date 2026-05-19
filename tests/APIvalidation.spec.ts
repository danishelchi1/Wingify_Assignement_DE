import { expect, test } from '@playwright/test';
import { DreamDiaryPage } from '../pages/DreamDiaryPage';
import { classifyDream } from '../utils/aiValidator';
import { attachScreenshot } from '../utils/testArtifacts';

test('Validate dream classification using OpenAI', async ({ page }, testInfo) => {
  const dreamDiaryPage = new DreamDiaryPage(page);
  let dreams: Awaited<ReturnType<DreamDiaryPage['getDreamNameAndType']>> = [];
  const dreamClassificationCache = new Map<string, string>();

  await test.step('Read dream names and types from diary page', async () => {
    await dreamDiaryPage.goto();
    await dreamDiaryPage.verifyPageLoaded();
    dreams = await dreamDiaryPage.getDreamNameAndType();

    expect(dreams).toHaveLength(10);
    await attachScreenshot(testInfo, 'api-validation-diary-data-loaded', page);
  });

  await test.step('Classify unique dream names using OpenAI', async () => {
    const uniqueDreamNames = [...new Set(dreams.map((dream) => dream.dreamName))];

    const classifications = await Promise.all(
      uniqueDreamNames.map(async (dreamName) => ({
        dreamName,
        aiType: await classifyDream(dreamName),
      })),
    );

    for (const { dreamName, aiType } of classifications) {
      dreamClassificationCache.set(dreamName, aiType);
      console.log(`Dream name: ${dreamName}`);
      console.log(`AI type: ${aiType}`);
    }
    await attachScreenshot(testInfo, 'api-validation-unique-dreams-classified', page);
  });

  await test.step('Compare AI classifications with diary table values', async () => {
    for (const dream of dreams) {
      const aiType = dreamClassificationCache.get(dream.dreamName);

      expect(aiType).toBeDefined();
      console.log(`Dream name: ${dream.dreamName}`);
      console.log(`UI type: ${dream.dreamType}`);
      console.log(`AI type: ${aiType}`);

      expect(aiType).toBe(dream.dreamType);
    }
    await attachScreenshot(testInfo, 'api-validation-ai-matches-ui', page);
  });
});
