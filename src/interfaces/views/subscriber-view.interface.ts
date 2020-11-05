import { ISubscriber } from '../subscriber.interface';

export interface ISubscriberView extends ISubscriber {
  organisation_name: string;
}
