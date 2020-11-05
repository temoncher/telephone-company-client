import * as React from 'react';

import {
  IconButton,
  TextField,
  Box,
} from '@material-ui/core';
import { ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import createTransactionTypeSql from '@sql/TransactionTypes/CreateTransactionType.sql';
import deleteTransactionTypeSql from '@sql/TransactionTypes/DeleteTransactionType.sql';
import updateTransactionTypeSql from '@sql/TransactionTypes/UpdateTransactionType.sql';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CodeButtons from '@/components/CodeButtons';
import Layout from '@/components/Layout';
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
  const { register, handleSubmit, errors, reset, watch, formState } = useForm<TransactionTypeForm>({ defaultValues, mode: 'onChange' });
  const { data: transactionTypesData, refetch: refetchTransactionTypes } = useQuery('transactionTypes', apiService.transactionTypeApi.getAllTransactionTypes);
  const globalClasses = useGlobalStyles();

  const transactionTypes = transactionTypesData?.data;
  const columns: ColDef[] = createColumns(transactionTypes ? transactionTypes[0] : {});
  const rows = transactionTypes?.map((transactionType, index) => ({ id: index, ...transactionType }));
  const values = watch();

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
    <Layout
      cols={columns}
      rows={rows}
      onRowClick={({ data }) => setSelectedRow(data as ITransactionType & { id: number })}
    >
      <Box className={globalClasses.editorHeader}>
        {selectedRow ? 'Edit transaction type' : 'Create new transaction type'}
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
          type={transactionTypes && transactionTypes[0] || {}}
          values={{ ...values, transaction_type_id: selectedRow?.transaction_type_id }}
          createSql={createTransactionTypeSql}
          updateSql={updateTransactionTypeSql}
          deleteSql={deleteTransactionTypeSql}
          selected={selectedRow}
          disabled={!(formState.isDirty && formState.isValid)}
          onDeleteClick={deleteRow}
        />
      </form>
    </Layout>
  );
};

export default TransactionTypes;
