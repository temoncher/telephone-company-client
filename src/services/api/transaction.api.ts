import { ITransaction } from '@/interfaces/transaction.interface';
import { ITransactionView } from '@/interfaces/views/transaction-view.interface';

import { ApiBase } from './api-base';

const TRANSACTIONS_API_ROOT = 'transactions';

export class TransactionApi extends ApiBase {
  getAllTransactions = () => this.apiService.sendRequest<ITransaction[]>({
    method: 'GET',
    url: `${TRANSACTIONS_API_ROOT}`,
  });

  getTransactionsTable = () => this.apiService.sendRequest<ITransactionView[]>({
    method: 'GET',
    url: `${TRANSACTIONS_API_ROOT}/table`,
  });

  createTransaction = (
    transaction: Omit<ITransaction, 'transaction_id' | 'timestamp'>,
  ) => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${TRANSACTIONS_API_ROOT}`,
    data: transaction,
  });
}
