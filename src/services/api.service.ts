import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { Role } from '@/enums/role.enum';

import { BASE_URL } from '../constants/base-url';

import { AccountApi } from './api/account.api';
import { DatabaseApi } from './api/database.api';
import { DaytimePriceApi } from './api/daytime-prices.api';
import { DaytimeApi } from './api/daytime.api';
import { LocalityApi } from './api/locality.api';
import { OrganisationApi } from './api/organisation.api';
import { PriceApi } from './api/price.api';
import { SubscriberApi } from './api/subscriber.api';
import { TransactionTypeApi } from './api/transaction-type.api';
import { TransactionApi } from './api/transaction.api';

export class ApiService {
  role: Role = Role.SUPER;
  axios: AxiosInstance = axios.create({
    baseURL: BASE_URL,
  });

  databaseApi = new DatabaseApi(this);
  priceApi = new PriceApi(this);
  localityApi = new LocalityApi(this);
  organisationApi = new OrganisationApi(this);
  subscriberApi = new SubscriberApi(this);
  daytimeApi = new DaytimeApi(this);
  daytimePriceApi = new DaytimePriceApi(this);
  transactionTypeApi = new TransactionTypeApi(this);
  transactionApi = new TransactionApi(this);
  accountApi = new AccountApi(this);

  sendRequest = <T>(request: AxiosRequestConfig) => this.axios.request<T>({
    ...request,
    headers: {
      post: {
        'Content-Type': 'application/json',
      },
      Authorization: `Bearer ${this.role}`,
    },
  });

  setRole = (newRole: Role) => this.role = newRole;
}
