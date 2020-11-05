import { ITransaction } from '../transaction.interface';

export interface ITransactionView extends ITransaction {
  subscriber_full_name: string;
  transaction_type_title: string;
}
