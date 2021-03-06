import * as React from 'react';

import {
  IconButton,
  TextField,
  MenuItem,
  Box,
} from '@material-ui/core';
import { ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import createDaytimePriceSql from '@sql/DaytimePrices/CreateDaytimePrice.sql';
import deleteDaytimePriceSql from '@sql/DaytimePrices/DeleteDaytimePrice.sql';
import updateDaytimePriceSql from '@sql/DaytimePrices/UpdateDaytimePrice.sql';
import daytimePricesTableSql from '@sql/Views/DaytimePricesGlobalView.sql';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CodeButtons from '@/components/CodeButtons';
import Layout from '@/components/Layout';
import SelectControl from '@/components/SelectControl';
import ApiServiceContext from '@/contexts/api-service.context';
import { IDaytimePrice } from '@/interfaces/daytime-price.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { createColumns } from '@/utlis/create-columns';
import { stringifyObjectProperites } from '@/utlis/stringify';

type DaytimePriceForm = Stringified<IDaytimePrice>;

const defaultValues: DaytimePriceForm = {
  daytime_id: '',
  price_id: '',
  price_per_minute: '',
};

const DaytimePrices: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<IDaytimePrice & { id: number } | null>(null);
  const { register, handleSubmit, errors, reset, watch, control, formState } = useForm<DaytimePriceForm>({ defaultValues, mode: 'onChange' });
  const { data: daytimePricesData, refetch: refetchDaytimePrices } = useQuery('daytimePrices', apiService.daytimePriceApi.getDaytimePricesTable);
  const { data: daytimesData } = useQuery('daytimes', apiService.daytimeApi.getAllDaytimes);
  const { data: pricesData } = useQuery('prices', apiService.priceApi.getAllPrices);
  const globalClasses = useGlobalStyles();

  const daytimePrices = daytimePricesData?.data;
  const daytimes = daytimesData?.data;
  const prices = pricesData?.data;
  const columns: ColDef[] = createColumns(daytimePrices ? daytimePrices[0] : {});
  const rows = daytimePrices?.map((daytimePrice, index) => ({ id: index, ...daytimePrice }));
  const values = watch();

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, ...fieldsToReset } = selectedRow;

    reset({ ...stringifyObjectProperites(fieldsToReset) });
  }, [selectedRow]);

  const handleSubmitClick = async (formData: DaytimePriceForm) => {
    const validDaytimePrice: IDaytimePrice = {
      price_id: Number(selectedRow ? selectedRow.price_id : formData.price_id),
      daytime_id: Number(selectedRow ? selectedRow.daytime_id : formData.daytime_id),
      price_per_minute: Number(formData.price_per_minute),
    };

    if (selectedRow) {
      await apiService.daytimePriceApi.updateDaytimePrice(validDaytimePrice);

      setSelectedRow(null);
    } else {
      await apiService.daytimePriceApi.createDaytimePrice(validDaytimePrice);
    }

    await refetchDaytimePrices();
  };

  const deleteRow = async () => {
    if (!selectedRow) return;

    const { id, price_per_minute, ...daytimePrice } = selectedRow;

    await apiService.daytimePriceApi.deleteDaytimePrice(daytimePrice);

    setSelectedRow(null);

    await refetchDaytimePrices();
  };

  return (
    <Layout
      cols={columns}
      rows={rows}
      viewSql={daytimePricesTableSql}
      onRowClick={({ data }) => setSelectedRow(data as IDaytimePrice & { id: number })}
    >
      <Box className={globalClasses.editorHeader}>
        {selectedRow ? 'Edit daytime price' : 'Create new daytime price'}
        {selectedRow && (
          <IconButton
            size="small"
            onClick={() => setSelectedRow(null)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <form
        className={globalClasses.editorForm}
        onSubmit={handleSubmit(handleSubmitClick)}
      >

        <SelectControl
          label="Price*"
          name="price_id"
          control={control}
          error={Boolean(errors.price_id)}
          helperText={errors.price_id ? 'Field is required' : ' '}
        >
          {prices?.map((price) => (
            <MenuItem
              key={price.title}
              value={price.price_id}
            >
              {price.title}
            </MenuItem>
          ))}
        </SelectControl>

        <SelectControl
          label="Daytime*"
          name="daytime_id"
          control={control}
          error={Boolean(errors.daytime_id)}
          helperText={errors.daytime_id ? 'Field is required' : ' '}
        >
          {daytimes?.map((daytime) => (
            <MenuItem
              key={daytime.title}
              value={daytime.daytime_id}
            >
              {daytime.title}
            </MenuItem>
          ))}
        </SelectControl>

        <TextField
          inputRef={register({ required: true })}
          size="small"
          name="price_per_minute"
          label="Price per minute*"
          variant="outlined"
          type="number"
          InputLabelProps={{ shrink: Boolean(values.price_per_minute) }}
          error={Boolean(errors.price_per_minute)}
          helperText={errors.price_per_minute ? 'Field is required' : ' '}
        />

        <CodeButtons
          type={daytimePrices && daytimePrices[0] || {}}
          values={values}
          createSql={createDaytimePriceSql}
          updateSql={updateDaytimePriceSql}
          deleteSql={deleteDaytimePriceSql}
          selected={selectedRow}
          disabled={!(formState.isDirty && formState.isValid)}
          onDeleteClick={deleteRow}
        />
      </form>
    </Layout>
  );
};

export default DaytimePrices;
