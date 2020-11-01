import { ApiBase } from './api-base';

const DATABASE_URL_ROOT = 'databases';

export class DatabaseApi extends ApiBase {
  getDatabases = () => this.apiService.sendRequest<{ name: string }[]>({
    method: 'GET',
    url: `${DATABASE_URL_ROOT}`,
  });

  createDatabase = () => this.apiService.sendRequest<{ name: string }[]>({
    method: 'POST',
    url: `${DATABASE_URL_ROOT}`,
  });

  dropDatabase = () => this.apiService.sendRequest<{ name: string }[]>({
    method: 'DELETE',
    url: `${DATABASE_URL_ROOT}`,
  });
}
