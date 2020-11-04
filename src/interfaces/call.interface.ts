export interface ICall {
  call_id: number;
  subscriber_id: number;
  daytime_id: number | null;
  locality_id: number | null;
  duration: number;
  timestamp: string;
  deleted_at: string | null;
}
