import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ItemQuery } from './dto/search.itemQuery.dto';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) {}

  async searchItem(query: ItemQuery): Promise<string> {
    return 'sdsdsd';
  }

  async getWeatherForecasts() {
    const url = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
    const { data } = await firstValueFrom(this.httpService.get(url));
    console.log(data.applist.apps);
    return data;
  }
}
