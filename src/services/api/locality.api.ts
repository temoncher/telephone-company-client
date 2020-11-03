import { ILocality } from '@/interfaces/locality.interface';

import { ApiBase } from './api-base';

const LOCALITIES_API_ROOT = 'localities';

export class LocalityApi extends ApiBase {
  getAllLocalities = () => this.apiService.sendRequest<ILocality[]>({
    method: 'GET',
    url: `${LOCALITIES_API_ROOT}`,
  })
}
