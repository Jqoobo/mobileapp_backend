import { Controller, Get, Query } from '@nestjs/common';
import { ItemQuery } from './dto/search.itemQuery.dto';
import { ProductService } from './product.service';
import { SearchItemRes } from './res/search.item';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  searchItem(@Query() query: ItemQuery): SearchItemRes {
    return this.productService.searchItem(query);
  }
}
