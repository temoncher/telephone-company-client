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

import { ITransaction } from '@/interfaces/transaction.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { stringifyObjectProperites } from '@/utlis/stringify';

import ApiServiceContext from '../../contexts/api-service.context';

type TransactionForm = Stringified<Omit<Stringified<ITransaction>, 'transaction_id' | 'timestamp'>>;

const defaultValues: TransactionForm = {
  amount: '',
  account_id: '',
  transaction_type_id: '',
};

const Transactions: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<ITransaction & { id: number } | null>(null);
  const { register, handleSubmit, errors, reset } = useForm<TransactionForm>({ defaultValues });
  const { data: transactionsData, refetch: refetchTransactions } = useQuery('transactions', apiService.transactionApi.getAllTransactions);
  const globalClasses = useGlobalStyles();

  const transactions = transactionsData?.data;
  const columns: ColDef[] = Object.entries(transactions ? transactions[0] : {}).map(([key, value]) => ({
    field: key,
    width: typeof value === 'string' ? 200 : 100,
    type: typeof value === 'string' ? 'string' : 'number',
  }));
  const rows = transactions?.map((transaction, index) => ({ id: index, ...transaction }));
  const isFormValid = Object.keys(errors).length === 0;

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, transaction_id, ...fieldsToReset } = selectedRow;

    reset({ ...stringifyObjectProperites(fieldsToReset) });
  }, [selectedRow]);

  const handleSubmitClick = async (formData: TransactionForm) => {
    const validTransaction: Omit<ITransaction, 'transaction_id' | 'timestamp'> = {
      ...formData,
      transaction_type_id: Number(formData.transaction_type_id),
      account_id: Number(formData.account_id),
      amount: Number(formData.amount),
    };

    if (selectedRow) {
      setSelectedRow(null);

      throw new Error('Transactions can not be edited');
    } else {
      await apiService.transactionApi.createTransaction(validTransaction);
    }

    await refetchTransactions();
  };

  const renderWarning = (): JSX.Element => (
    <>Transactions can not be edited or deleted due to security reasons</>
  );
  const renderForm = (): JSX.Element => (
    <form
      className={globalClasses.editorForm}
      onSubmit={handleSubmit(handleSubmitClick)}
    >
      <TextField
        inputRef={register({ required: true })}
        size="small"
        name="amount"
        label="Amount*"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        error={Boolean(errors.amount)}
        helperText={errors.amount ? 'Field is required' : ' '}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isFormValid}
      >
        {selectedRow ? 'Edit' : 'Create'}
      </Button>
    </form>
  );

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
          onRowClick={({ data }) => setSelectedRow(data as ITransaction & { id: number })}
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
        {selectedRow ? renderWarning() : renderForm()}
      </div>
    </>
  );
};

export default Transactions;
