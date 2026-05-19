import { type Page, type TestInfo } from '@playwright/test';

export async function attachScreenshot(
  testInfo: TestInfo,
  name: string,
  page: Page,
): Promise<void> {
  const screenshotPath = testInfo.outputPath(`${name.replace(/[^a-z0-9-_]/gi, '-')}.png`);

  await page.screenshot({ path: screenshotPath, fullPage: true });

  await testInfo.attach(name, {
    path: screenshotPath,
    contentType: 'image/png',
  });
}
