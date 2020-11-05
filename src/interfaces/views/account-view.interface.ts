import { IAccount } from '../account.interface';

export interface IAccountView extends IAccount {
  subscriber_full_name: string;
}
