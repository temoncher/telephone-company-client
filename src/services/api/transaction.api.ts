import { ITransaction } from '@/interfaces/transaction.interface';

import { ApiBase } from './api-base';

const TRANSACTIONS_API_ROOT = 'transactions';

export class TransactionApi extends ApiBase {
  getAllTransactions = () => this.apiService.sendRequest<ITransaction[]>({
    method: 'GET',
    url: `${TRANSACTIONS_API_ROOT}`,
  });

  createTransaction = (
    transaction: Omit<ITransaction, 'transaction_id' | 'timestamp'>,
  ) => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${TRANSACTIONS_API_ROOT}`,
    data: transaction,
  });
}
