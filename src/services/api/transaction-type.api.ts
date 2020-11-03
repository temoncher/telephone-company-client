import { ITransactionType } from '@/interfaces/transaction-type.interface';

import { ApiBase } from './api-base';

const TRANSACTION_TYPES_API_ROOT = 'transactiontypes';

export class TransactionTypeApi extends ApiBase {
  getAllTransactionTypes = () => this.apiService.sendRequest<ITransactionType[]>({
    method: 'GET',
    url: `${TRANSACTION_TYPES_API_ROOT}`,
  });

  createTransactionType = (transactionType: Omit<ITransactionType, 'transaction_type_id'>) => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${TRANSACTION_TYPES_API_ROOT}`,
    data: transactionType,
  });

  updateTransactionType = (
    transactionTypeId: number,
    transactionType: Omit<ITransactionType, 'transaction_type_id'>,
  ) => this.apiService.sendRequest<number>({
    method: 'PUT',
    url: `${TRANSACTION_TYPES_API_ROOT}/${transactionTypeId}`,
    data: transactionType,
  });

  deleteTransactionType = (transactionTypeId: number) => this.apiService.sendRequest<number>({
    method: 'DELETE',
    url: `${TRANSACTION_TYPES_API_ROOT}/${transactionTypeId}`,
  });
}
