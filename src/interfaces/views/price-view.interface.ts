import { IPrice } from '../price.interface';

export interface IPriceView extends IPrice {
  locality_name: string;
}
