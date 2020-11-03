import { IDaytime } from '@/interfaces/daytime.interface';

import { ApiBase } from './api-base';

const DAYTIMES_API_ROOT = 'daytimes';

export class DaytimeApi extends ApiBase {
  getAllDaytimes = () => this.apiService.sendRequest<IDaytime[]>({
    method: 'GET',
    url: `${DAYTIMES_API_ROOT}`,
  });

  createDaytime = (daytime: Omit<IDaytime, 'daytime_id'>) => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${DAYTIMES_API_ROOT}`,
    data: daytime,
  });

  updateDaytime = (
    daytimeId: number,
    daytime: Omit<IDaytime, 'daytime_id'>,
  ) => this.apiService.sendRequest<number>({
    method: 'PUT',
    url: `${DAYTIMES_API_ROOT}/${daytimeId}`,
    data: daytime,
  });

  deleteDaytime = (daytimeId: number) => this.apiService.sendRequest<number>({
    method: 'DELETE',
    url: `${DAYTIMES_API_ROOT}/${daytimeId}`,
  });
}
