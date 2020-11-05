import * as React from 'react';

import {
  IconButton,
  TextField,
  MenuItem,
  Typography,
  Box,
} from '@material-ui/core';
import { ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import createTransactionSql from '@sql/Transactions/CreateTransaction.sql';
import transactionsTableSql from '@sql/Views/TransactionsGlobalView.sql';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CodeButtons from '@/components/CodeButtons';
import Layout from '@/components/Layout';
import SelectControl from '@/components/SelectControl';
import { ITransaction } from '@/interfaces/transaction.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { createColumns } from '@/utlis/create-columns';
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
  const { register, handleSubmit, errors, reset, watch, control, formState } = useForm<TransactionForm>({ defaultValues, mode: 'onChange' });
  const { data: transactionsData, refetch: refetchTransactions } = useQuery('transactions', apiService.transactionApi.getTransactionsTable);
  const { data: accountsTableData } = useQuery('accounts', apiService.accountApi.getAccountsTable);
  const { data: transactionTypesData } = useQuery('transactionTypes', apiService.transactionTypeApi.getAllTransactionTypes);
  const globalClasses = useGlobalStyles();

  const transactions = transactionsData?.data;
  const accountsTable = accountsTableData?.data;
  const transactionTypes = transactionTypesData?.data;
  const columns: ColDef[] = createColumns(transactions ? transactions[0] : {});
  const rows = transactions?.map((transaction, index) => ({ id: index, ...transaction }));
  const values = watch();

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
    <Box className={globalClasses.editorForm}>
      <Typography variant="body1">
        Transactions can not be edited nor deleted due to balance history integrity reasons
      </Typography>
    </Box>
  );
  const renderForm = (): JSX.Element => (
    <form
      className={globalClasses.editorForm}
      onSubmit={handleSubmit(handleSubmitClick)}
    >
      <SelectControl
        label="Transaction type*"
        name="transaction_type_id"
        control={control}
        error={Boolean(errors.transaction_type_id)}
        helperText={errors.transaction_type_id ? 'Field is required' : ' '}
      >
        {transactionTypes?.map((transactionType) => (
          <MenuItem
            key={transactionType.title}
            value={transactionType.transaction_type_id}
          >
            {transactionType.title}
          </MenuItem>
        ))}
      </SelectControl>

      <SelectControl
        label="Account*"
        name="account_id"
        control={control}
        error={Boolean(errors.account_id)}
        helperText={errors.account_id ? 'Field is required' : ' '}
      >
        {accountsTable?.map((account) => (
          <MenuItem
            key={`account_${account.account_id}`}
            value={account.account_id}
          >
            {`${account.subscriber_full_name}(${account.balance})`}
          </MenuItem>
        ))}
      </SelectControl>

      <TextField
        inputRef={register({ required: true })}
        size="small"
        name="amount"
        label="Amount*"
        variant="outlined"
        type="number"
        InputLabelProps={{ shrink: Boolean(values.amount) }}
        error={Boolean(errors.amount)}
        helperText={errors.amount ? 'Field is required' : ' '}
      />

      <CodeButtons
        type={transactions && transactions[0] || {}}
        values={{ ...values, transaction_id: selectedRow?.transaction_id }}
        createSql={createTransactionSql}
        selected={selectedRow}
        disabled={!(formState.isDirty && formState.isValid)}
      />
    </form>
  );

  return (
    <Layout
      cols={columns}
      rows={rows}
      viewSql={transactionsTableSql}
      onRowClick={({ data }) => setSelectedRow(data as ITransaction & { id: number })}
    >
      <Box className={globalClasses.editorHeader}>
        {selectedRow ? 'Edit daytime price' : 'Create new transaction'}
        {selectedRow && (
          <IconButton
            size="small"
            onClick={() => setSelectedRow(null)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      {selectedRow ? renderWarning() : renderForm()}
    </Layout>
  );
};

export default Transactions;
