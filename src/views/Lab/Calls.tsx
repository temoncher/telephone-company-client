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
} from '@material-ui/core';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from 'react-query';

import { ICall } from '@/interfaces/call.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
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
  const { register, handleSubmit, errors, reset, control } = useForm<CallForm>({ defaultValues });
  const { data: callsData, refetch: refetchCalls } = useQuery('calls', apiService.callApi.getAllCalls);
  const { data: localitiesData } = useQuery('localities', apiService.localityApi.getAllLocalities);
  const { data: daytimesData } = useQuery('daytimes', apiService.daytimeApi.getAllDaytimes);
  const { data: subscribersData } = useQuery('subscribers', apiService.subscriberApi.getAllSubscribers);
  const globalClasses = useGlobalStyles();

  const calls = callsData?.data;
  const localities = localitiesData?.data;
  const subscribers = subscribersData?.data;
  const daytimes = daytimesData?.data;
  const columns: ColDef[] = Object.entries(calls ? calls[0] : {}).map(([key, value]) => ({
    field: key,
    width: typeof value === 'string' ? 200 : 100,
    type: typeof value === 'string' ? 'string' : 'number',
  }));
  const rows = calls?.map((call, index) => ({ id: index, ...call }));
  const isFormValid = Object.keys(errors).length === 0;

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
      <div className={globalClasses.editorForm}>
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
      </div>
    );
  };

  const renderForm = (): JSX.Element => (
    <form
      className={globalClasses.editorForm}
      onSubmit={handleSubmit(handleSubmitClick)}
    >
      <FormControl
        variant="outlined"
        size="small"
      >
        <InputLabel
          id="locality-label"
          shrink={true}
        >
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
              label="Account"
              error={Boolean(errors.locality_id)}
            >
              {localities?.map((locality) => (
                <MenuItem
                  key={`locality_${locality.locality_id}`}
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

      <FormControl
        variant="outlined"
        size="small"
      >
        <InputLabel
          id="subscriber-label"
          shrink={true}
        >
          Subscriber*
        </InputLabel>
        <Controller
          rules={{ required: true }}
          as={
            <Select
              labelId="subscriber-label"
              inputProps={{
                name: 'subscriber_id',
              }}
              label="Account"
              error={Boolean(errors.subscriber_id)}
            >
              {subscribers?.map((subscriber) => (
                <MenuItem
                  key={`subscriber_${subscriber.subscriber_id}`}
                  value={subscriber.subscriber_id}
                >
                  {subscriber.first_name} {subscriber.last_name}
                </MenuItem>
              ))}
            </Select>
          }
          name="subscriber_id"
          control={control}
          defaultValue=""
        />
        <FormHelperText error={true}>{errors.subscriber_id ? 'Field is required' : ' '}</FormHelperText>
      </FormControl>

      <FormControl
        variant="outlined"
        size="small"
      >
        <InputLabel
          id="daytime-label"
          shrink={true}
        >
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
              label="Account"
              error={Boolean(errors.daytime_id)}
            >
              {daytimes?.map((daytime) => (
                <MenuItem
                  key={`daytime_${daytime.daytime_id}`}
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

      <TextField
        inputRef={register({ required: true })}
        size="small"
        name="duration"
        label="Duration*"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        error={Boolean(errors.duration)}
        helperText={errors.duration ? 'Field is required' : ' '}
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
        {rows && (
          <DataGrid
            columns={columns}
            rows={rows}
            onRowClick={({ data }) => setSelectedRow(data as ICall & { id: number })}
          />
        )}
      </div>
      <div className={globalClasses.editor}>
        <div className={globalClasses.editorHeader}>
          <Typography>
            {selectedRow ? 'Edit call' : 'Create new call'}
          </Typography>
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
      </div>
    </>
  );
};

export default Calls;
