import { ApiBase } from './api-base';

const DATABASE_URL_ROOT = 'databases';

export class DatabaseApi extends ApiBase {
  getDatabases = () => this.apiService.sendRequest<{ name: string }[]>({
    method: 'GET',
    url: `${DATABASE_URL_ROOT}`,
  });

  createDatabase = () => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${DATABASE_URL_ROOT}/tables`,
    headers: {
      Authorization: 'Bearer Super',
    },
  });

  createRoles = () => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${DATABASE_URL_ROOT}/roles`,
    headers: {
      Authorization: 'Bearer Super',
    },
  });

  setupTriggers = () => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${DATABASE_URL_ROOT}/triggers`,
    headers: {
      Authorization: 'Bearer Super',
    },
  });

  seed = () => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${DATABASE_URL_ROOT}/seed`,
    headers: {
      Authorization: 'Bearer Super',
    },
  });
}
