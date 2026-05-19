import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { attachScreenshot } from '../utils/testArtifacts';

test.describe('Dream Portal homepage', () => {
  test('loader disappears and My Dreams opens diary and total pages in new tabs', async ({ page }, testInfo) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    await expect(homePage.loader).toBeVisible();
    const loaderStartTime = Date.now();
    await attachScreenshot(testInfo, 'homepage-loader-visible', page);
    await homePage.waitForLoader();
    const loaderDuration = Date.now() - loaderStartTime;

    expect(loaderDuration).toBeGreaterThanOrEqual(2500);
    expect(loaderDuration).toBeLessThanOrEqual(4500);
    await expect(homePage.myDreamsButton).toBeVisible();
    await expect(homePage.mainContent).toBeVisible();
    await expect.poll(() => homePage.isMainContentVisible()).toBe(true);
    await attachScreenshot(testInfo, 'homepage-main-content-visible', page);

    const openedPages = await homePage.openMyDreams();
    const openedUrls = openedPages.map((openedPage) => openedPage.url());

    expect(openedUrls).toEqual(
      expect.arrayContaining([
        expect.stringContaining('/dreams-diary.html'),
        expect.stringContaining('/dreams-total.html'),
      ]),
    );

    await attachScreenshot(testInfo, 'homepage-dream-diary-popup', openedPages[0]);
    await attachScreenshot(testInfo, 'homepage-dream-total-popup', openedPages[1]);
  });
});
