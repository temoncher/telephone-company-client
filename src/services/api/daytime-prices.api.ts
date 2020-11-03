import { IDaytimePrice } from '@/interfaces/daytime-price.interface';

import { ApiBase } from './api-base';

const DAYTIME_PRICES_API_ROOT = 'daytimeprices';

export class DaytimePriceApi extends ApiBase {
  getAllDaytimePrices = () => this.apiService.sendRequest<IDaytimePrice[]>({
    method: 'GET',
    url: `${DAYTIME_PRICES_API_ROOT}`,
  });

  createDaytimePrice = (daytimePrice: IDaytimePrice) => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${DAYTIME_PRICES_API_ROOT}`,
    data: daytimePrice,
  });

  updateDaytimePrice = (daytimePrice: IDaytimePrice) => this.apiService.sendRequest<number>({
    method: 'PUT',
    url: `${DAYTIME_PRICES_API_ROOT}`,
    data: daytimePrice,
  });

  deleteDaytimePrice = (daytimePrice: Omit<IDaytimePrice, 'price_per_minute'>) => this.apiService.sendRequest<number>({
    method: 'DELETE',
    url: `${DAYTIME_PRICES_API_ROOT}`,
    data: daytimePrice,
  });
}
