import { Controller, Get, Query } from '@nestjs/common';
import { ItemQuery } from './dto/search.itemQuery.dto';
import { ProductService } from './product.service';
import { productsRes } from './res/products.respond';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async searchItem(@Query() query: ItemQuery): Promise<productsRes> {
    console.log('daj dane');
    return await this.productService.productInformation(query);
  }
}
