import { Controller, Get, Query } from '@nestjs/common';
import { ItemQuery } from './dto/search.itemQuery.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchItem(@Query() query: ItemQuery): Promise<string> {
    console.log(query);
    return this.searchService.searchItem(query);
  }
}
