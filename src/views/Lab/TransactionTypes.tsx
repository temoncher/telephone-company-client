import * as React from 'react';

import {
  Button,
  IconButton,
  TextField,
} from '@material-ui/core';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import { ITransactionType } from '@/interfaces/transaction-type.interface';
import { useGlobalStyles } from '@/styles/global-styles';

import ApiServiceContext from '../../contexts/api-service.context';

const defaultValues: Omit<Partial<ITransactionType>, 'transaction_type_id'> = {
  title: '',
};

const TransactionTypes: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<ITransactionType & { id: number } | null>(null);
  const { register, handleSubmit, errors, reset } = useForm<Omit<ITransactionType, 'transaction_type_id'>>({ defaultValues });
  const { data: transactionTypesData, refetch: refetchTransactionTypes } = useQuery('transactionTypes', apiService.transactionTypeApi.getAllTransactionTypes);
  const globalClasses = useGlobalStyles();

  const transactionTypes = transactionTypesData?.data;
  const columns: ColDef[] = Object.entries(transactionTypes ? transactionTypes[0] : {}).map(([key, value]) => ({
    field: key,
    width: typeof value === 'string' ? 200 : 100,
    type: typeof value === 'string' ? 'string' : 'number',
  }));
  const rows = transactionTypes?.map((transactionType, index) => ({ id: index, ...transactionType }));
  const isFormValid = Object.keys(errors).length === 0;

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, transaction_type_id, ...fieldsToReset } = selectedRow;

    reset({ ...fieldsToReset });
  }, [selectedRow]);

  const handleSubmitClick = async (formData: ITransactionType) => {
    if (selectedRow) {
      await apiService.transactionTypeApi.updateTransactionType(selectedRow.transaction_type_id, formData);

      setSelectedRow(null);
    } else {
      await apiService.transactionTypeApi.createTransactionType(formData);
    }

    await refetchTransactionTypes();
  };

  const deleteRow = async () => {
    if (!selectedRow) return;

    await apiService.transactionTypeApi.deleteTransactionType(selectedRow?.transaction_type_id);

    setSelectedRow(null);

    await refetchTransactionTypes();
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
          onRowClick={({ data }) => setSelectedRow(data as ITransactionType & { id: number })}
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
            label="Title*"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.title)}
            helperText={errors.title ? 'Field is required' : ' '}
          />

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

export default TransactionTypes;
