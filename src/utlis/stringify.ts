import { Stringified } from '@/types/stringified';

// eslint-disable-next-line @typescript-eslint/ban-types
export const stringifyObjectProperites = <T extends object>(obj: T): Stringified<T> => {
  const initObj: Stringified<T> = {} as Stringified<T>;
  const stringifedObj: Stringified<T> = Object.entries(obj).reduce((aggregator, [key, value]) => {
    aggregator[key as keyof Stringified<T>] = String(value);

    return aggregator;
  }, initObj);

  return stringifedObj;
};
