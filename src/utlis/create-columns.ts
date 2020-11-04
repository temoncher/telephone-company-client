import { ColDef } from '@material-ui/data-grid';

enum DefatultWidth {
  NUMBERS = 100,
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
    const widthByHeaderName = headerName.length * 12;
    const defaultWidth = typeof value === 'string' ? DefatultWidth.STRINGS : DefatultWidth.NUMBERS;
    const width = widthByHeaderName > defaultWidth ? widthByHeaderName : defaultWidth;

    return {
      headerName,
      field,
      width,
      sortable: false,
      type: typeof value,
    };
  });
