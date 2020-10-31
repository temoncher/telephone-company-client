import { ApiBase } from './api-base';

const DATABASE_URL_ROOT = 'databases';

export class DatabaseApi extends ApiBase {
  getDatabases = () => this.apiService.sendRequest<{ name: string }[]>({
    method: 'GET',
    url: `${DATABASE_URL_ROOT}`,
  });
}
