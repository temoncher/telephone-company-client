import { IApiService } from '../api.service.interface';

export abstract class ApiBase {
  constructor(protected apiService: IApiService) {}
}
