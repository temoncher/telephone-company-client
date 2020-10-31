import { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface IApiService {
  sendRequest: <T>(request: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
}
