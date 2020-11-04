import { ColDef } from '@material-ui/data-grid';

// eslint-disable-next-line @typescript-eslint/ban-types
export const createColumns = <T extends object>(tableEntity: T): ColDef[] => Object.entries(tableEntity)
  .filter(([key]) => !key.endsWith('_id'))
  .map(([key, value]) => {
    const keyWithCapitalizedFirstLetter = key.charAt(0).toUpperCase() + key.slice(1);
    const readableKey = keyWithCapitalizedFirstLetter.replace(/_/g, ' ');

    return [readableKey, key, value] as [string, string, typeof value];
  })
  .map(([headerName, field, value]) => ({
    headerName,
    field,
    sortable: false,
    width: typeof value === 'string' ? 200 : headerName.length * 10,
    type: typeof value === 'string' ? 'string' : 'number',
  }));
