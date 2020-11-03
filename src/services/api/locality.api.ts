import { ILocality } from '@/interfaces/locality.interface';

import { ApiBase } from './api-base';

const LOCALITIES_API_ROOT = 'localities';

export class LocalityApi extends ApiBase {
  getAllLocalities = () => this.apiService.sendRequest<ILocality[]>({
    method: 'GET',
    url: `${LOCALITIES_API_ROOT}`,
  });

  createLocality = (locality: Omit<ILocality, 'locality_id'>) => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${LOCALITIES_API_ROOT}`,
    data: locality,
  });

  updateLocality = (
    localityId: number,
    locality: Omit<ILocality, 'locality_id'>,
  ) => this.apiService.sendRequest<number>({
    method: 'PUT',
    url: `${LOCALITIES_API_ROOT}/${localityId}`,
    data: locality,
  });

  deleteLocality = (localityId: number) => this.apiService.sendRequest<number>({
    method: 'DELETE',
    url: `${LOCALITIES_API_ROOT}/${localityId}`,
  });
}
