import { IPrice } from '@/interfaces/price.interface';

import { ApiBase } from './api-base';

const PRICES_URL_ROOT = 'prices';

export class PriceApi extends ApiBase {
  getAllPrices = () => this.apiService.sendRequest<IPrice[]>({
    method: 'GET',
    url: `${PRICES_URL_ROOT}`,
  });

  createPrice = (price: Omit<IPrice, 'price_id'>) => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${PRICES_URL_ROOT}`,
    data: price,
  });

  updatePrice = (priceId: number, price: Omit<IPrice, 'price_id'>) => this.apiService.sendRequest<number>({
    method: 'PUT',
    url: `${PRICES_URL_ROOT}/${priceId}`,
    data: price,
  });

  deletePrice = (priceId: number) => this.apiService.sendRequest<number>({
    method: 'DELETE',
    url: `${PRICES_URL_ROOT}/${priceId}`,
  });
}
