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

import DataGridFab from '@/components/DataGridFab';
import SqlCodeBlock from '@/components/SqlCodeBlock';
import { daytimePricesTableSql } from '@/constants/sql/views-sql.ts';
import { IDaytimePrice } from '@/interfaces/daytime-price.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { createColumns } from '@/utlis/create-columns';
import { stringifyObjectProperites } from '@/utlis/stringify';

import ApiServiceContext from '../../contexts/api-service.context';

type DaytimePriceForm = Stringified<IDaytimePrice>;

const defaultValues: DaytimePriceForm = {
  daytime_id: '',
  price_id: '',
  price_per_minute: '',
};

const DaytimePrices: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<IDaytimePrice & { id: number } | null>(null);
  const [isCodeShown, setIsCodeShown] = React.useState(false);
  const { register, handleSubmit, errors, reset, control } = useForm<DaytimePriceForm>({ defaultValues });
  const { data: daytimePricesData, refetch: refetchDaytimePrices } = useQuery('daytimePrices', apiService.daytimePriceApi.getDaytimePricesTable);
  const { data: daytimesData } = useQuery('daytimes', apiService.daytimeApi.getAllDaytimes);
  const { data: pricesData } = useQuery('prices', apiService.priceApi.getAllPrices);
  const globalClasses = useGlobalStyles();

  const daytimePrices = daytimePricesData?.data;
  const daytimes = daytimesData?.data;
  const prices = pricesData?.data;
  const columns: ColDef[] = createColumns(daytimePrices ? daytimePrices[0] : {});
  const rows = daytimePrices?.map((daytimePrice, index) => ({ id: index, ...daytimePrice }));
  const isFormValid = Object.keys(errors).length === 0;

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

  const renderCode = () => (
    <>
      <div className={globalClasses.editorHeader}>
        <div>Daytime prices view code</div>
        <IconButton
          size="small"
          onClick={() => setIsCodeShown(false)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <SqlCodeBlock text={daytimePricesTableSql} />
    </>
  );

  const renderEditor = () => (
    <>
      <div className={globalClasses.editorHeader}>
        {selectedRow ? 'Edit daytime price' : 'Create new daytime price'}
        {selectedRow && (
          <IconButton
            size="small"
            onClick={() => setSelectedRow(null)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </div>
      <form
        className={globalClasses.editorForm}
        onSubmit={handleSubmit(handleSubmitClick)}
      >
        <FormControl
          variant="outlined"
          size="small"
        >
          <InputLabel id="daytime-label">
        Daytime*
          </InputLabel>
          <Controller
            rules={{ required: true }}
            as={
              <Select
                labelId="daytime-label"
                inputProps={{
                  name: 'daytime_id',
                }}
                label="Locality"
                error={Boolean(errors.daytime_id)}
              >
                <MenuItem value="">
              None
                </MenuItem>
                {daytimes?.map((daytime) => (
                  <MenuItem
                    key={daytime.title}
                    value={daytime.daytime_id}
                  >
                    {daytime.title}
                  </MenuItem>
                ))}
              </Select>
            }
            name="daytime_id"
            control={control}
            defaultValue=""
          />
          <FormHelperText error={true}>{errors.daytime_id ? 'Field is required' : ' '}</FormHelperText>
        </FormControl>

        <FormControl
          variant="outlined"
          size="small"
        >
          <InputLabel id="price-label">
        Price*
          </InputLabel>
          <Controller
            rules={{ required: true }}
            as={
              <Select
                labelId="price-label"
                label="Locality"
                error={Boolean(errors.price_id)}
              >
                <MenuItem value="">
              None
                </MenuItem>
                {prices?.map((price) => (
                  <MenuItem
                    key={price.title}
                    value={price.price_id}
                  >
                    {price.title}
                  </MenuItem>
                ))}
              </Select>
            }
            name="price_id"
            control={control}
            defaultValue=""
          />
          <FormHelperText error={true}>{errors.price_id ? 'Field is required' : ' '}</FormHelperText>
        </FormControl>

        <TextField
          inputRef={register({ required: true })}
          size="small"
          name="price_per_minute"
          label="Price per minute*"
          variant="outlined"
          error={Boolean(errors.price_per_minute)}
          helperText={errors.price_per_minute ? 'Field is required' : ' '}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isFormValid}
        >
          {selectedRow ? 'Edit' : 'Create'}
        </Button>

        {selectedRow && (
          <Button
            variant="contained"
            color="secondary"
            onClick={deleteRow}
          >
        Delete
          </Button>
        )}
      </form>
    </>
  );

  return (
    <>
      <div
        className={globalClasses.dataGrid}
      >
        {rows && (
          <DataGrid
            columns={columns}
            rows={rows}
            onRowClick={({ data }) => setSelectedRow(data as IDaytimePrice & { id: number })}
          />
        )}

        <DataGridFab onClick={() => setIsCodeShown(!isCodeShown)} />
      </div>
      <div className={globalClasses.editor}>
        { isCodeShown ? renderCode() : renderEditor() }
      </div>
    </>
  );
};

export default DaytimePrices;
