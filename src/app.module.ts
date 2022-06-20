import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { ProductModule } from './product/product.module';
@Module({
  imports: [SearchModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
