import { IAccount } from '@/interfaces/account.interface';
import { IAccountView } from '@/interfaces/views/account-view.interface';

import { ApiBase } from './api-base';

const ACCOUNTS_API_ROOT = 'accounts';

export class AccountApi extends ApiBase {
  getAllAccounts = () => this.apiService.sendRequest<IAccount[]>({
    method: 'GET',
    url: `${ACCOUNTS_API_ROOT}`,
  });

  getAccountsTable = () => this.apiService.sendRequest<IAccountView[]>({
    method: 'GET',
    url: `${ACCOUNTS_API_ROOT}/table`,
  });
}
