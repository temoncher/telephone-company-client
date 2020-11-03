import { ISubscriber } from '@/interfaces/subscriber.interface';

import { ApiBase } from './api-base';

const SUBSCRIBERS_API_ROOT = 'subscribers';

export class SubscriberApi extends ApiBase {
  getAllSubscribers = () => this.apiService.sendRequest<ISubscriber[]>({
    method: 'GET',
    url: `${SUBSCRIBERS_API_ROOT}`,
  });

  createSubscriber = (subscriber: Omit<ISubscriber, 'subscriber_id'>) => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${SUBSCRIBERS_API_ROOT}`,
    data: subscriber,
  });

  updateSubscriber = (
    subscriberId: number,
    subscriber: Omit<ISubscriber, 'subscriber_id'>,
  ) => this.apiService.sendRequest<number>({
    method: 'PUT',
    url: `${SUBSCRIBERS_API_ROOT}/${subscriberId}`,
    data: subscriber,
  });

  deleteSubscriber = (subscriberId: number) => this.apiService.sendRequest<number>({
    method: 'DELETE',
    url: `${SUBSCRIBERS_API_ROOT}/${subscriberId}`,
  });
}
