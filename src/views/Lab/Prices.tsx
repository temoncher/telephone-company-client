import * as React from 'react';

import {
  Button,
  IconButton,
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from 'react-query';

import { ILocality } from '@/interfaces/locality.interface';
import { IPrice } from '@/interfaces/price.interface';
import { useGlobalStyles } from '@/styles/global-styles';

import ApiServiceContext from '../../contexts/api-service.context';

const defaultValues: Omit<Partial<IPrice>, 'price_id'> = {
  locality_id: undefined,
  title: '',
};

const Prices: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<IPrice | null>(null);
  const { register, handleSubmit, control, errors, reset } = useForm<Omit<IPrice, 'price_id'>>({ defaultValues });
  const { data: pricesData, refetch: refetchPrices } = useQuery('prices', apiService.priceApi.getAllPrices);
  const { data: localitiesData } = useQuery('localities', apiService.localityApi.getAllLocalities);
  const globalClasses = useGlobalStyles();

  const prices = pricesData?.data;
  const localities = localitiesData?.data;
  const columns: ColDef[] = Object.entries(prices ? prices[0] : {}).map(([key, value]) => ({
    field: key,
    width: typeof value === 'string' ? 200 : 100,
    type: typeof value === 'string' ? 'string' : 'number',
  }));
  const rows = prices?.map((price, index) => ({ id: index, ...price }));
  const isFormValid = Object.keys(errors).length === 0;

  React.useEffect(() => {
    reset({
      locality_id: selectedRow?.locality_id,
      title: selectedRow?.title,
    });
  }, [selectedRow]);

  React.useEffect(() => {
    reset();
  }, []);

  const handleSubmitClick = async (data: IPrice) => {
    if (selectedRow) {
      await apiService.priceApi.updatePrice(selectedRow.price_id, data);
    } else {
      await apiService.priceApi.createPrice(data);
    }

    await refetchPrices();
  };

  const deleteRow = async () => {
    if (!selectedRow) return;

    await apiService.priceApi.deletePrice(selectedRow?.price_id);

    await refetchPrices();
  };

  return (
    <>
      <div
        className={globalClasses.dataGrid}
      >
        {
          rows &&
        <DataGrid
          columns={columns}
          rows={rows}
          onRowClick={({ data }) => setSelectedRow(data as IPrice & { id: number })}
        />
        }

      </div>
      <div className={globalClasses.editor}>
        <div className={globalClasses.editorHeader}>
          {selectedRow ? 'Edit row' : 'Create new row'}
          {selectedRow && <IconButton
            size="small"
            onClick={() => setSelectedRow(null)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>}
        </div>
        <form
          className={globalClasses.editorForm}
          onSubmit={handleSubmit(handleSubmitClick)}
        >
          <TextField
            inputRef={register({ required: true })}
            size="small"
            name="title"
            label="Title"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.title)}
            helperText={errors.title ? 'Field is required' : ' '}
          />
          <FormControl
            variant="outlined"
            size="small"
          >
            <InputLabel
              id="locality-label"
              shrink={true}
            >
              Locality
            </InputLabel>
            <Controller
              rules={{ required: true }}
              as={
                <Select
                  labelId="locality-label"
                  inputProps={{
                    name: 'locality_id',
                  }}
                  id="demo-simple-select-outlined"
                  label="Locality"
                  error={Boolean(errors.locality_id)}
                >
                  {localities?.map((locality) => (
                    <MenuItem
                      key={locality.name}
                      value={locality.locality_id}
                    >
                      {locality.name}
                    </MenuItem>
                  ))}
                </Select>
              }
              name="locality_id"
              control={control}
              defaultValue=""
            />
            <FormHelperText error={true}>{errors.locality_id ? 'Field is required' : ' '}</FormHelperText>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid}
          >
            {selectedRow ? 'Edit' : 'Create'}
          </Button>

          {selectedRow && <Button
            variant="contained"
            color="secondary"
            onClick={deleteRow}
          >
            Delete
          </Button>}
        </form>
      </div>
    </>
  );
};

export default Prices;
