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
  Typography,
  Paper,
} from '@material-ui/core';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from 'react-query';

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
  const { register, handleSubmit, errors, reset, control, formState } = useForm<TransactionForm>({ defaultValues, mode: 'onChange' });
  const { data: transactionsData, refetch: refetchTransactions } = useQuery('transactions', apiService.transactionApi.getAllTransactions);
  const { data: accountsData } = useQuery('accounts', apiService.accountApi.getAllAccounts);
  const { data: transactionTypesData } = useQuery('transactionTypes', apiService.transactionTypeApi.getAllTransactionTypes);
  const globalClasses = useGlobalStyles();

  const transactions = transactionsData?.data;
  const accounts = accountsData?.data;
  const transactionTypes = transactionTypesData?.data;
  const columns: ColDef[] = createColumns(transactions ? transactions[0] : {});
  const rows = transactions?.map((transaction, index) => ({ id: index, ...transaction }));

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
    <div className={globalClasses.editorForm}>
      <Typography variant="body1">
        Transactions can not be edited nor deleted due to balance history integrity reasons
      </Typography>
    </div>
  );
  const renderForm = (): JSX.Element => (
    <form
      className={globalClasses.editorForm}
      onSubmit={handleSubmit(handleSubmitClick)}
    >
      <FormControl
        variant="outlined"
        size="small"
      >
        <InputLabel id="account-label">
          Account*
        </InputLabel>
        <Controller
          rules={{ required: true }}
          as={
            <Select
              labelId="account-label"
              inputProps={{
                name: 'account_id',
              }}
              label="Account"
              error={Boolean(errors.account_id)}
            >
              <MenuItem value="">
                None
              </MenuItem>
              {accounts?.map((account) => (
                <MenuItem
                  key={`${account.subscriber_id}_${account.account_id}`}
                  value={account.account_id}
                >
                  {`${account.subscriber_id}_${account.account_id}`}
                </MenuItem>
              ))}
            </Select>
          }
          name="account_id"
          control={control}
          defaultValue=""
        />
        <FormHelperText error={true}>{errors.account_id ? 'Field is required' : ' '}</FormHelperText>
      </FormControl>

      <FormControl
        variant="outlined"
        size="small"
      >
        <InputLabel id="transactionType-label">
          Transaction type*
        </InputLabel>
        <Controller
          rules={{ required: true }}
          as={
            <Select
              labelId="transactionType-label"
              inputProps={{
                name: 'transaction_type_id',
              }}
              label="Account"
              error={Boolean(errors.transaction_type_id)}
            >
              <MenuItem value="">
                None
              </MenuItem>
              {transactionTypes?.map((transactionType) => (
                <MenuItem
                  key={transactionType.title}
                  value={transactionType.transaction_type_id}
                >
                  {transactionType.title}
                </MenuItem>
              ))}
            </Select>
          }
          name="transaction_type_id"
          control={control}
          defaultValue=""
        />
        <FormHelperText error={true}>{errors.transaction_type_id ? 'Field is required' : ' '}</FormHelperText>
      </FormControl>

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
        disabled={!(formState.isDirty && formState.isValid)}
      >
        {selectedRow ? 'Edit' : 'Create'}
      </Button>
    </form>
  );

  return (
    <>
      <Paper className={globalClasses.dataGrid}>
        {rows && (
          <DataGrid
            columns={columns}
            rows={rows}
            onRowClick={({ data }) => setSelectedRow(data as ITransaction & { id: number })}
          />
        )}
      </Paper>
      <Paper className={globalClasses.editor}>
        <div className={globalClasses.editorHeader}>
          {selectedRow ? 'Edit daytime price' : 'Create new transaction'}
          {selectedRow && (
            <IconButton
              size="small"
              onClick={() => setSelectedRow(null)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </div>
        {selectedRow ? renderWarning() : renderForm()}
      </Paper>
    </>
  );
};

export default Transactions;
