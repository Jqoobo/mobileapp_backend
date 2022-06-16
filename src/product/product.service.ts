import { Injectable } from '@nestjs/common';
import { ItemQuery } from './dto/search.itemQuery.dto';
import { SearchItemRes } from './res/search.item';

@Injectable()
export class ProductService {
  searchItem(query: ItemQuery): SearchItemRes {
    const res: SearchItemRes = {
      itemName: query.item.toLowerCase().split('_').join(' '),
      site: {
        g2a: {
          img: 'https://img.g2a.com/323x433/1x1x0/steam-gift-card-300-tl-steam-key-for-tl-currency-only/5c405f64ae653a4ae53570e3',
          pricePLN: '113.37',
        },
        eneba: {
          img: 'https://img.g2a.com/323x433/1x1x0/steam-gift-card-300-tl-steam-key-for-tl-currency-only/5c405f64ae653a4ae53570e3',
          pricePLN: '113.37',
        },
        kinguin: {
          img: 'https://img.g2a.com/323x433/1x1x0/steam-gift-card-300-tl-steam-key-for-tl-currency-only/5c405f64ae653a4ae53570e3',
          pricePLN: '113.37',
        },
        gamivo: {
          img: 'https://img.g2a.com/323x433/1x1x0/steam-gift-card-300-tl-steam-key-for-tl-currency-only/5c405f64ae653a4ae53570e3',
          pricePLN: '113.37',
        },
        steam: {
          img: 'https://img.g2a.com/323x433/1x1x0/steam-gift-card-300-tl-steam-key-for-tl-currency-only/5c405f64ae653a4ae53570e3',
          pricePLN: '113.37',
        },
      },
    };
    return res;
  }
}
