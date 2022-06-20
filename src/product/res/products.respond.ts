import { productsItem } from './products.item';

export interface productsRes {
  site: {
    g2a?: productsItem;
    eneba?: productsItem;
    kinguin?: productsItem;
    steam?: productsItem;
  };
}
