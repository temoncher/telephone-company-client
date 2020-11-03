import { ICall } from '@/interfaces/call.interface';

import { ApiBase } from './api-base';

const CALLS_API_ROOT = 'calls';

export class CallApi extends ApiBase {
  getAllCalls = () => this.apiService.sendRequest<ICall[]>({
    method: 'GET',
    url: `${CALLS_API_ROOT}`,
  });

  createCall = (call: Omit<ICall, 'call_id' | 'timestamp'>) => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${CALLS_API_ROOT}`,
    data: call,
  });
}
