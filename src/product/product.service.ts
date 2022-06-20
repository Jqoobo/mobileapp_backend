import { Injectable } from '@nestjs/common';
import { ItemQuery } from './dto/search.itemQuery.dto';
import { productsRes } from './res/products.respond';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';
import { runInPage } from 'src/scraper/runInPage';
import { runInBrowser } from 'src/scraper/runBrowser';
import { productsItem } from './res/products.item';

@Injectable()
export class ProductService {
  constructor(private readonly httpService: HttpService) {}

  async productInformation(query: ItemQuery): Promise<productsRes> {
    // Grand%20Theft%20Auto%20V
    const itemFromSteam = await this.findProductFromSteam(
      query.item,
      query.appids,
    );
    const itemFromG2A = await this.findProductFromG2A(query.item);
    const itemFromKinguin = await this.findProductFromKinguin(query.item);
    const itemFromEneba = await this.findProductFromEneba(query.item);
    const res: productsRes = {
      site: {
        steam: itemFromSteam,
        g2a: itemFromG2A,
        kinguin: itemFromKinguin,
        eneba: itemFromEneba,
      },
    };
    return res;
  }

  private async findProductFromSteam(
    appName: string,
    appid: string,
  ): Promise<productsItem> {
    const url = `https://store.steampowered.com/api/appdetails?filters=price_overview&appids=${appid}&cc=pl&l=pl`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    const pricePLN = data[appid]?.data?.price_overview?.final;
    if (pricePLN) {
      const appTitle = appName;
      const appImg = `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`;
      const linkToStore = `https://store.steampowered.com/app/${appid}`;

      return {
        pricePLN,
        appTitle,
        appImg,
        linkToStore,
      } as productsItem;
    }
    return null;
  }

  private async findProductFromG2A(appName: string): Promise<productsItem> {
    const url = `https://www.g2a.com/search/api/v3/suggestions?include\[\]=categories&itemsPerPage=1&phrase=${appName}&currency=PLN`;
    const headersRequest = {
      headers: {
        'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    };
    const { data } = await firstValueFrom(
      this.httpService.get(url, headersRequest),
    );

    const firstItem = data?.data?.items[0];
    if (firstItem) {
      const pricePLN = Number(firstItem.price.replace(/\./g, ''));
      const appTitle = firstItem.name;
      const appImg = firstItem.image?.sources[7]?.url;
      const linkToStore = `https://www.g2a.com${data?.data?.items[0].href}`;
      return {
        pricePLN,
        appTitle,
        appImg,
        linkToStore,
      } as productsItem;
    }
    return null;
  }

  private async findProductFromKinguin(appName: string): Promise<productsItem> {
    const url = `https://www.kinguin.net/services/library/api/v1/products/search?phrase=${appName}&size=1&visible=1&sort=bestseller.total,DESC`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    const firstItem = data?._embedded?.products[0];
    if (firstItem) {
      let pricePLN = firstItem.price.lowestOffer; // price eur
      const appTitle = firstItem.name;
      const appImg = firstItem.imageUrl;
      const linkToStore = `https://www.kinguin.net/category/${firstItem.breadcrumbs[3].id}/${firstItem.breadcrumbs[3].slug}`;
      pricePLN = await this.retry(
        () => this.getCurrencyRateFromKinguin(pricePLN),
        3,
      );

      return {
        pricePLN,
        appTitle,
        appImg,
        linkToStore,
      } as productsItem;
    }
    return null;
  }

  private async findProductFromEneba(appName: string): Promise<productsItem> {
    const url = `https://www.eneba.com/graphql/?operationName=QuickProductSearch&variables=%7B%22currency%22%3A%22PLN%22%2C%22context%22%3A%7B%22country%22%3A%22PL%22%2C%22region%22%3A%22poland%22%2C%22language%22%3A%22pl_PL%22%7D%2C%22tests%22%3A%5B%5D%2C%22text%22%3A%22${appName}%22%2C%22sort%22%3A%22POPULARITY_DESC%22%2C%22suggestCollection%22%3Atrue%2C%22suggestCategory%22%3Atrue%2C%22useRecombee%22%3Afalse%2C%22userIdentifier%22%3A%22138233601010952105427666897266448%22%2C%22usePopularSearches%22%3Atrue%2C%22skipSuggestions%22%3Afalse%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%223c0e9cc94a986358571433ab2c46c56f42bbef22ae905d512ac9ecd326e05513%22%7D%7D`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    const firstItem = data?.data?.search?.results?.edges[0];
    if (firstItem) {
      const pricePLN = firstItem.node.cheapestAuction.price.amount;
      const appTitle = firstItem.node.name;
      const appImg = firstItem.node.cover.src;
      const linkToStore = `https://www.eneba.com/${firstItem.node.slug}`;
      return {
        pricePLN,
        appTitle,
        appImg,
        linkToStore,
      } as productsItem;
    }
    return null;
  }

  private async getCurrencyRateFromKinguin(pricePLN: number): Promise<number> {
    return await runInBrowser(async (browser) => {
      const page = await browser.newPage();
      await page.setUserAgent('UA-TEST');
      const width = 512,
        height = 1024;
      await page.setViewport({ width: width, height: height });
      const cookies = [
        {
          name: 'newCurrency',
          value: 'PLN',
        },
        {
          name: 'currency',
          value: 'PLN',
        },
      ];
      await page.goto('https://www.kinguin.net');
      await page.setCookie(...cookies);
      await page.reload();
      const currRate = JSON.parse(
        decodeURI(
          (await page.cookies()).filter((el) => el.name == 'currencyObject')[0]
            .value,
        ).replace(/%2C/g, ','),
      ).rate;

      return Math.round(pricePLN * currRate);
    });
  }

  async retry(promiseFactory, retryCount) {
    try {
      return await promiseFactory();
    } catch (error) {
      if (retryCount <= 0) {
        throw error;
      }
      return await this.retry(promiseFactory, retryCount - 1);
    }
  }
}
