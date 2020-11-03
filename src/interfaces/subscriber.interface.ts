export interface ISubscriber {
  subscriber_id: number;
  organisation_id: number;
  inn: number;
  first_name: string;
  last_name: string;
  patronymic?: string;
  adress?: string;
}
