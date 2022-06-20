import puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';

export async function runInBrowser<T>(
  callback: (browser: Browser) => Promise<T>,
) {
  const browser = await puppeteer.launch({
    headless: true, //false,
    devtools: false,
    ignoreHTTPSErrors: true,
    args: ['--ignore-certificate-errors'],
  });
  try {
    return await callback(browser);
  } finally {
    await browser.close();
  }
}
