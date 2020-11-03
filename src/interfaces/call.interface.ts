export interface ICall {
  call_id: number;
  subscriber_id: number;
  daytime_id?: number;
  locality_id?: number;
  duration: number;
  timestamp: number;
}
