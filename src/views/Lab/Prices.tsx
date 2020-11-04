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
  Paper,
  ButtonGroup,
  Grid,
} from '@material-ui/core';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import CodeIcon from '@material-ui/icons/Code';
import createPriceSql from '@sql/Prices/CreatePrice.sql';
import deletePriceSql from '@sql/Prices/DeletePrice.sql';
import updatePriceSql from '@sql/Prices/UpdatePrice.sql';
import pricesTableSql from '@sql/Views/PricesGlobalView.sql';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from 'react-query';

import DataGridFab from '@/components/DataGridFab';
import SqlCodeBlock from '@/components/SqlCodeBlock';
import ApiServiceContext from '@/contexts/api-service.context';
import { IPrice } from '@/interfaces/price.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { createColumns } from '@/utlis/create-columns';
import { parseSql, SqlParseVariableOption } from '@/utlis/parse-sql';
import { stringifyObjectProperites } from '@/utlis/stringify';

type PriceForm = Stringified<Omit<IPrice, 'price_id'>>

const defaultValues: PriceForm = {
  locality_id: '',
  title: '',
};

const Prices: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<IPrice & { id: number } | null>(null);
  const [isViewCodeShown, setIsViewCodeShown] = React.useState(false);
  const [isFormCodeShown, setIsFormCodeShown] = React.useState(false);
  const [isDeleteCodeShown, setIsDeleteCodeShown] = React.useState(false);
  const { register, handleSubmit, control, watch, errors, reset, formState } = useForm<PriceForm>({ defaultValues, mode: 'onChange', reValidateMode: 'onChange' });
  const { data: pricesData, refetch: refetchPrices } = useQuery('prices', apiService.priceApi.getPricesTable);
  const { data: localitiesData } = useQuery('localities', apiService.localityApi.getAllLocalities);
  const globalClasses = useGlobalStyles();

  const prices = pricesData?.data;
  const localities = localitiesData?.data;
  const columns: ColDef[] = createColumns(prices ? prices[0] : {});
  const rows = prices?.map((price, index) => ({ id: index, ...price }));
  const values = watch();

  const parseOptions: Record<string, SqlParseVariableOption> = {
    localityId: {
      value: values.locality_id,
      int: true,
    },
    title: {
      value: values.title,
    },
    priceId: {
      value: selectedRow?.price_id,
      int: true,
    },
  };

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

  const renderCode = () => (
    <>
      <div className={globalClasses.editorHeader}>
        <div>Prices view code</div>
        <IconButton
          size="small"
          onClick={() => setIsViewCodeShown(false)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <SqlCodeBlock text={pricesTableSql} />
    </>
  );

  const renderEditor = () => (
    <>
      <div className={globalClasses.editorHeader}>
        {selectedRow ? 'Edit price' : 'Create new price'}
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
        <FormControl
          variant="outlined"
          size="small"
        >
          <InputLabel id="locality-label">
            Locality*
          </InputLabel>
          <Controller
            rules={{ required: true }}
            as={
              <Select
                labelId="locality-label"
                inputProps={{
                  name: 'locality_id',
                }}
                label="Locality"
                error={Boolean(errors.locality_id)}
              >
                <MenuItem value="">
                  None
                </MenuItem>
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
        <ButtonGroup>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!(formState.isDirty && formState.isValid)}
          >
            {isFormCodeShown
              ? 'Execute'
              : selectedRow ? 'Edit' : 'Create'
            }
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsFormCodeShown(!isFormCodeShown)}
          >
            <CodeIcon />
          </Button>
        </ButtonGroup>

        {isFormCodeShown && (
          selectedRow
            ? <SqlCodeBlock text={parseSql(updatePriceSql, parseOptions)} />
            : <SqlCodeBlock text={parseSql(createPriceSql, parseOptions)} />
        )}

        {selectedRow && (
          <ButtonGroup>
            <Button
              variant="contained"
              color="secondary"
              onClick={deleteRow}
            >
              {isDeleteCodeShown ? 'Execute' : 'Delete'}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setIsDeleteCodeShown(!isDeleteCodeShown)}
            >
              <CodeIcon />
            </Button>
          </ButtonGroup>
        )}

        {isDeleteCodeShown && selectedRow && (
          <SqlCodeBlock text={parseSql(deletePriceSql, parseOptions)} />
        )}
      </form>
    </>
  );

  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        item
        xs={8}
      >
        <Paper className={globalClasses.dataGrid}>
          {rows && (
            <DataGrid
              columns={columns}
              rows={rows}
              onRowClick={({ data }) => setSelectedRow(data as IPrice & { id: number })}
            />
          )}

          <DataGridFab onClick={() => setIsViewCodeShown(!isViewCodeShown)} />
        </Paper>
      </Grid>
      <Grid
        item
        xs={4}
      >
        <Paper className={globalClasses.editor}>
          { isViewCodeShown ? renderCode() : renderEditor() }
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Prices;
