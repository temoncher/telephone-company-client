import * as React from 'react';

import {
  IconButton,
  TextField,
  MenuItem,
  Box,
} from '@material-ui/core';
import { ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import createPriceSql from '@sql/Prices/CreatePrice.sql';
import deletePriceSql from '@sql/Prices/DeletePrice.sql';
import updatePriceSql from '@sql/Prices/UpdatePrice.sql';
import pricesTableSql from '@sql/Views/PricesGlobalView.sql';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CodeButtons from '@/components/CodeButtons';
import Layout from '@/components/Layout';
import SelectControl from '@/components/SelectControl';
import ApiServiceContext from '@/contexts/api-service.context';
import { IPrice } from '@/interfaces/price.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { createColumns } from '@/utlis/create-columns';
import { stringifyObjectProperites } from '@/utlis/stringify';

type PriceForm = Stringified<Omit<IPrice, 'price_id'>>

const defaultValues: PriceForm = {
  locality_id: '',
  title: '',
};

const Prices: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<IPrice & { id: number } | null>(null);
  const { register, handleSubmit, control, watch, errors, reset, formState } = useForm<PriceForm>({ defaultValues, mode: 'onChange', reValidateMode: 'onChange' });
  const { data: pricesData, refetch: refetchPrices } = useQuery('prices', apiService.priceApi.getPricesTable);
  const { data: localitiesData } = useQuery('localities', apiService.localityApi.getAllLocalities);
  const globalClasses = useGlobalStyles();

  const prices = pricesData?.data;
  const localities = localitiesData?.data;
  const columns: ColDef[] = createColumns(prices ? prices[0] : {});
  const rows = prices?.map((price, index) => ({ id: index, ...price }));
  const values = watch();

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, price_id, ...fieldsToReset } = selectedRow;

    reset({ ...stringifyObjectProperites(fieldsToReset) });
  }, [selectedRow]);

  const handleSubmitClick = async (formData: PriceForm) => {
    const validPriceForm: Omit<IPrice, 'price_id'> = {
      ...formData,
      locality_id: Number(formData.locality_id),
    };

    if (selectedRow) {
      await apiService.priceApi.updatePrice(selectedRow.price_id, validPriceForm);

      setSelectedRow(null);
    } else {
      await apiService.priceApi.createPrice(validPriceForm);
    }

    await refetchPrices();
  };

  const deleteRow = async () => {
    if (!selectedRow) return;

    await apiService.priceApi.deletePrice(selectedRow?.price_id);

    setSelectedRow(null);

    await refetchPrices();
  };

  return (
    <Layout
      cols={columns}
      rows={rows}
      viewSql={pricesTableSql}
      onRowClick={({ data }) => setSelectedRow(data as IPrice & { id: number })}
    >
      <Box className={globalClasses.editorHeader}>
        {selectedRow ? 'Edit price' : 'Create new price'}
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
          label="Locality*"
          name="locality_id"
          control={control}
          error={Boolean(errors.locality_id)}
          helperText={errors.locality_id ? 'Field is required' : ' '}
        >
          {localities?.map((locality) => (
            <MenuItem
              key={locality.name}
              value={locality.locality_id}
            >
              {locality.name}
            </MenuItem>
          ))}
        </SelectControl>

        <TextField
          inputRef={register({ required: true })}
          size="small"
          name="title"
          label="Title*"
          variant="outlined"
          InputLabelProps={{ shrink: Boolean(values.title) }}
          error={Boolean(errors.title)}
          helperText={errors.title ? 'Field is required' : ' '}
        />

        <CodeButtons
          type={prices && prices[0] || {}}
          values={{ ...values, price_id: selectedRow?.price_id }}
          createSql={createPriceSql}
          updateSql={updatePriceSql}
          deleteSql={deletePriceSql}
          selected={selectedRow}
          disabled={!(formState.isDirty && formState.isValid)}
          onDeleteClick={deleteRow}
        />
      </form>
    </Layout>
  );
};

export default Prices;
