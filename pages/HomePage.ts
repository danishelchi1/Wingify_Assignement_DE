import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly loader: Locator;
  readonly mainContent: Locator;
  readonly myDreamsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loader = page.locator('#loadingAnimation');
    this.mainContent = page.locator('#mainContent');
    this.myDreamsButton = page.getByRole('button', { name: /my dreams/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('./');
  }

  async waitForLoader(): Promise<void> {
    await this.loader.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async isMainContentVisible(): Promise<boolean> {
    return this.mainContent.isVisible();
  }

  async openMyDreams(): Promise<Page[]> {
    const popupsPromise = new Promise<Page[]>((resolve) => {
      const popups: Page[] = [];
      const onPopup = (popup: Page) => {
        popups.push(popup);

        if (popups.length === 2) {
          this.page.off('popup', onPopup);
          resolve(popups);
        }
      };

      this.page.on('popup', onPopup);
    });

    await this.myDreamsButton.click();

    const popups = await popupsPromise;
    await Promise.all(popups.map((popup) => popup.waitForLoadState('load')));

    return popups;
  }
}
