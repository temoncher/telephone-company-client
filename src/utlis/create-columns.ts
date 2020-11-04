import { ColDef } from '@material-ui/data-grid';

enum DefatultWidth {
  NUMBERS = 75,
  STRINGS = 200,
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const createColumns = <T extends object>(tableEntity: T): ColDef[] => Object.entries(tableEntity)
  .filter(([key]) => !key.endsWith('_id'))
  .map(([key, value]) => {
    const keyWithCapitalizedFirstLetter = key.charAt(0).toUpperCase() + key.slice(1);
    const readableKey = keyWithCapitalizedFirstLetter.replace(/_/g, ' ');

    return [readableKey, key, value] as [string, string, typeof value];
  })
  .map(([headerName, field, value]) => {
    const widthByHeaderName = headerName.length * 10;
    const numberTypeWidth = widthByHeaderName > DefatultWidth.NUMBERS ? widthByHeaderName : DefatultWidth.NUMBERS;

    return {
      headerName,
      field,
      sortable: false,
      width: typeof value === 'string' ? DefatultWidth.STRINGS : numberTypeWidth,
      type: typeof value,
    };
  });
