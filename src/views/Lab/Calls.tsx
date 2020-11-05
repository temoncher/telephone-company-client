import * as React from 'react';

import {
  Button,
  IconButton,
  TextField,
  MenuItem,
  Typography,
  Box,
} from '@material-ui/core';
import { ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import createCallSql from '@sql/Calls/CreateCall.sql';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CodeButtons from '@/components/CodeButtons';
import Layout from '@/components/Layout';
import SelectControl from '@/components/SelectControl';
import { ICall } from '@/interfaces/call.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { createColumns } from '@/utlis/create-columns';
import { stringifyObjectProperites } from '@/utlis/stringify';

import ApiServiceContext from '../../contexts/api-service.context';

type CallForm = Stringified<Omit<Stringified<ICall>, 'call_id' | 'timestamp' | 'deleted_at'>>;

const defaultValues: CallForm = {
  duration: '',
  subscriber_id: '',
  daytime_id: '',
  locality_id: '',
};

const Calls: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<ICall & { id: number } | null>(null);
  const { register, handleSubmit, errors, reset, watch, control, formState } = useForm<CallForm>({ defaultValues, mode: 'onChange' });
  const { data: callsData, refetch: refetchCalls } = useQuery('calls', apiService.callApi.getAllCalls);
  const { data: localitiesData } = useQuery('localities', apiService.localityApi.getAllLocalities);
  const { data: daytimesData } = useQuery('daytimes', apiService.daytimeApi.getAllDaytimes);
  const { data: subscribersData } = useQuery('subscribers', apiService.subscriberApi.getAllSubscribers);
  const globalClasses = useGlobalStyles();

  const calls = callsData?.data;
  const localities = localitiesData?.data;
  const subscribers = subscribersData?.data;
  const daytimes = daytimesData?.data;
  const columns: ColDef[] = createColumns(calls ? calls[0] : {});
  const rows = calls?.map((call, index) => ({ id: index, ...call }));
  const values = watch();

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, call_id, ...fieldsToReset } = selectedRow;

    reset({ ...stringifyObjectProperites(fieldsToReset) });
  }, [selectedRow]);

  const handleSubmitClick = async (formData: CallForm) => {
    const validCall: Omit<ICall, 'call_id' | 'timestamp' | 'deleted_at'> = {
      ...formData,
      subscriber_id: Number(formData.subscriber_id),
      locality_id: Number(formData.locality_id),
      daytime_id: Number(formData.daytime_id),
      duration: Number(formData.duration),
    };

    if (selectedRow) {
      setSelectedRow(null);

      throw new Error('Calls can not be edited');
    } else {
      await apiService.callApi.createCall(validCall);
    }

    await refetchCalls();
  };

  const deleteRow = async () => {
    if (!selectedRow) return;

    await apiService.callApi.deleteCall(selectedRow.call_id);

    setSelectedRow(null);

    await refetchCalls();
  };

  const restoreRow = async () => {
    if (!selectedRow) return;

    await apiService.callApi.restoreCall(selectedRow.call_id);

    setSelectedRow(null);

    await refetchCalls();
  };

  const renderWarning = (): JSX.Element => {
    if (!selectedRow) return <></>;

    const isDeleted = Boolean(selectedRow?.deleted_at);

    return(
      <Box className={globalClasses.editorForm}>
        <Typography variant="body1">
          Calls can not be edited due to balance history integrity reasons
        </Typography>
        <Typography variant="body1">
          Though, calls can be soft-deleted for it to not apper in calls history
        </Typography>
        {
          isDeleted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={restoreRow}
            >
              Restore
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={deleteRow}
            >
              Soft delete
            </Button>
          )
        }
      </Box>
    );
  };

  const renderForm = (): JSX.Element => (
    <form
      className={globalClasses.editorForm}
      onSubmit={handleSubmit(handleSubmitClick)}
    >
      <SelectControl
        label="Subscriber*"
        name="subscriber_id"
        control={control}
        error={Boolean(errors.subscriber_id)}
        helperText={errors.subscriber_id ? 'Field is required' : ' '}
      >
        {subscribers?.map((subscriber) => (
          <MenuItem
            key={`subscriber_${subscriber.subscriber_id}`}
            value={subscriber.subscriber_id}
          >
            {subscriber.first_name} {subscriber.last_name}
          </MenuItem>
        ))}
      </SelectControl>

      <SelectControl
        label="Locality*"
        name="locality_id"
        control={control}
        error={Boolean(errors.locality_id)}
        helperText={errors.locality_id ? 'Field is required' : ' '}
      >
        {localities?.map((locality) => (
          <MenuItem
            key={`locality_${locality.locality_id}`}
            value={locality.locality_id}
          >
            {locality.name}
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
            key={`daytime_${daytime.daytime_id}`}
            value={daytime.daytime_id}
          >
            {daytime.title}
          </MenuItem>
        ))}
      </SelectControl>

      <TextField
        inputRef={register({ required: true })}
        size="small"
        name="duration"
        label="Duration*"
        variant="outlined"
        type="number"
        InputLabelProps={{ shrink: Boolean(values.duration) }}
        error={Boolean(errors.duration)}
        helperText={errors.duration ? 'Field is required' : ' '}
      />

      <CodeButtons
        type={calls && calls[0] || {}}
        values={{ ...values, call_id: selectedRow?.call_id }}
        createSql={createCallSql}
        selected={selectedRow}
        disabled={!(formState.isDirty && formState.isValid)}
      />
    </form>
  );

  return (
    <Layout
      cols={columns}
      rows={rows}
      onRowClick={({ data }) => setSelectedRow(data as ICall & { id: number })}
    >
      <Box className={globalClasses.editorHeader}>
        <Typography variant="body1">
          {selectedRow ? 'Delete call' : 'Create new call'}
        </Typography>
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

export default Calls;
