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
  });

  createViews = () => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${DATABASE_URL_ROOT}/views`,
  });

  createRoles = () => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${DATABASE_URL_ROOT}/roles`,
  });

  setupTriggers = () => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${DATABASE_URL_ROOT}/triggers`,
  });

  seed = () => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${DATABASE_URL_ROOT}/seed`,
  });
}
