import { IDaytimePrice } from '../daytime-price.interface';

export interface IDaytimePriceView extends IDaytimePrice {
  daytime_title: string;
  price_title: string;
}
