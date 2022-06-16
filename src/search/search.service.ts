import { Injectable } from '@nestjs/common';
import { ItemQuery } from './dto/search.itemQuery.dto';

@Injectable()
export class SearchService {
  searchItem(query: ItemQuery): string {
    return 'sdsdsd';
  }
}
