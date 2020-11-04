import * as React from 'react';

import {
  Button,
  IconButton,
  TextField,
  Paper,
} from '@material-ui/core';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import { ITransactionType } from '@/interfaces/transaction-type.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { createColumns } from '@/utlis/create-columns';

import ApiServiceContext from '../../contexts/api-service.context';

type TransactionTypeForm = Stringified<Omit<ITransactionType, 'transaction_type_id'>>

const defaultValues: Omit<Partial<ITransactionType>, 'transaction_type_id'> = {
  title: '',
};

const TransactionTypes: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<ITransactionType & { id: number } | null>(null);
  const { register, handleSubmit, errors, reset, formState } = useForm<TransactionTypeForm>({ defaultValues, mode: 'onChange' });
  const { data: transactionTypesData, refetch: refetchTransactionTypes } = useQuery('transactionTypes', apiService.transactionTypeApi.getAllTransactionTypes);
  const globalClasses = useGlobalStyles();

  const transactionTypes = transactionTypesData?.data;
  const columns: ColDef[] = createColumns(transactionTypes ? transactionTypes[0] : {});
  const rows = transactionTypes?.map((transactionType, index) => ({ id: index, ...transactionType }));

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, transaction_type_id, ...fieldsToReset } = selectedRow;

    reset({ ...fieldsToReset });
  }, [selectedRow]);

  const handleSubmitClick = async (formData: TransactionTypeForm) => {
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
      <Paper className={globalClasses.dataGrid}>
        {rows && (
          <DataGrid
            columns={columns}
            rows={rows}
            onRowClick={({ data }) => setSelectedRow(data as ITransactionType & { id: number })}
          />
        )}
      </Paper>
      <Paper className={globalClasses.editor}>
        <div className={globalClasses.editorHeader}>
          {selectedRow ? 'Edit transaction type' : 'Create new transaction type'}
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
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.title)}
            helperText={errors.title ? 'Field is required' : ' '}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!(formState.isDirty && formState.isValid)}
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
      </Paper>
    </>
  );
};

export default TransactionTypes;
