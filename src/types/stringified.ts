// eslint-disable-next-line @typescript-eslint/ban-types
export type Stringified<T extends object> = {
  [K in keyof T]: string;
}
