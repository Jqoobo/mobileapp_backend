import { Controller, Get, Query } from '@nestjs/common';
import { ItemQuery } from './dto/search.itemQuery.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  searchItem(@Query() query: ItemQuery): string {
    return this.searchService.searchItem(query);
  }
}
