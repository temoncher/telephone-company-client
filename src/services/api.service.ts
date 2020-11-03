import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { Role } from '@/enums/role.enum';

import { BASE_URL } from '../constants/base-url';

import { DatabaseApi } from './api/database.api';
import { LocalityApi } from './api/locality.api';
import { OrganisationApi } from './api/organisation.api';
import { PriceApi } from './api/price.api';
import { SubscriberApi } from './api/subscriber.api';

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
