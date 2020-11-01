import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { BASE_URL } from '../constants/base-url';

import { DatabaseApi } from './api/database.api';

export class ApiService {
  axios: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      post: {
        'Content-Type': 'application/json',
      },
    },
  });

  databaseApi = new DatabaseApi(this);

  sendRequest = <T>(request: AxiosRequestConfig) => this.axios.request<T>(request);
}
