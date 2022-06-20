import { Page } from 'puppeteer';

export async function runInPage<T>(
  pageFactory: () => Promise<Page>,
  callback: (page: Page) => Promise<T>,
) {
  const page = await pageFactory();
  try {
    return await callback(page);
  } finally {
    await page.close();
  }
}
