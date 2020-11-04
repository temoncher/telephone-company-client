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
} from '@material-ui/core';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from 'react-query';

import { ISubscriber } from '@/interfaces/subscriber.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { createColumns } from '@/utlis/create-columns';
import { stringifyObjectProperites } from '@/utlis/stringify';

import ApiServiceContext from '../../contexts/api-service.context';

type SubscriberForm = Stringified<Omit<ISubscriber, 'subscriber_id'>>

const defaultValues: SubscriberForm = {
  organisation_id: '',
  inn: '',
  first_name: '',
  last_name: '',
  patronymic: '',
  adress: '',
};

const Subscribers: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<ISubscriber & { id: number } | null>(null);
  const { register, handleSubmit, control, errors, reset, formState } = useForm<SubscriberForm>({ defaultValues, mode: 'onChange' });
  const { data: subscribersData, refetch: refetchSubscribers } = useQuery('subscribers', apiService.subscriberApi.getAllSubscribers);
  const { data: organisationsData } = useQuery('organisations', apiService.organisationApi.getAllOrganisations);
  const globalClasses = useGlobalStyles();

  const subscribers = subscribersData?.data;
  const organisations = organisationsData?.data;
  const columns: ColDef[] = createColumns(subscribers ? subscribers[0] : {});
  const rows = subscribers?.map((subscriber, index) => ({ id: index, ...subscriber }));

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, subscriber_id, ...fieldsToReset } = selectedRow;

    reset({ ...stringifyObjectProperites(fieldsToReset) });
  }, [selectedRow]);

  const handleSubmitClick = async (formData: SubscriberForm) => {
    const validSubscriberForm: Omit<ISubscriber, 'subscriber_id'> = {
      ...formData,
      inn: Number(formData.inn),
      organisation_id: Number(formData.organisation_id),
    };

    if (selectedRow) {
      await apiService.subscriberApi.updateSubscriber(selectedRow.subscriber_id, validSubscriberForm);

      setSelectedRow(null);
    } else {
      await apiService.subscriberApi.createSubscriber(validSubscriberForm);
    }

    await refetchSubscribers();
  };

  const deleteRow = async () => {
    if (!selectedRow) return;

    await apiService.subscriberApi.deleteSubscriber(selectedRow?.subscriber_id);

    setSelectedRow(null);

    await refetchSubscribers();
  };

  return (
    <>
      <Paper className={globalClasses.dataGrid}>
        {rows && (
          <DataGrid
            columns={columns}
            rows={rows}
            onRowClick={({ data }) => setSelectedRow(data as ISubscriber & { id: number })}
          />
        )}
      </Paper>
      <Paper className={globalClasses.editor}>
        <div className={globalClasses.editorHeader}>
          {selectedRow ? 'Edit subscriber' : 'Create new subscriber'}
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
            name="inn"
            label="INN*"
            variant="outlined"
            error={Boolean(errors.inn)}
            helperText={errors.inn ? 'Field is required' : ' '}
          />
          <TextField
            inputRef={register({ required: true })}
            size="small"
            name="first_name"
            label="First name*"
            variant="outlined"
            error={Boolean(errors.first_name)}
            helperText={errors.first_name ? 'Field is required' : ' '}
          />
          <TextField
            inputRef={register({ required: true })}
            size="small"
            name="last_name"
            label="Last name*"
            variant="outlined"
            error={Boolean(errors.last_name)}
            helperText={errors.last_name ? 'Field is required' : ' '}
          />
          <TextField
            inputRef={register()}
            size="small"
            name="patronymic"
            label="Patronymic"
            variant="outlined"
            error={Boolean(errors.patronymic)}
            helperText={errors.patronymic ? 'Field is required' : ' '}
          />
          <TextField
            inputRef={register()}
            size="small"
            name="adress"
            label="Adress"
            variant="outlined"
            error={Boolean(errors.patronymic)}
            helperText={errors.adress ? 'Field is required' : ' '}
          />
          <FormControl
            variant="outlined"
            size="small"
          >
            <InputLabel id="organisation-label">
              Organisation*
            </InputLabel>
            <Controller
              rules={{ required: true }}
              as={
                <Select
                  labelId="organisation-label"
                  inputProps={{
                    name: 'organisation_id',
                  }}
                  label="Locality"
                  error={Boolean(errors.organisation_id)}
                >
                  <MenuItem value="">
                    None
                  </MenuItem>
                  {organisations?.map((organisation) => (
                    <MenuItem
                      key={organisation.name}
                      value={organisation.organisation_id}
                    >
                      {organisation.name}
                    </MenuItem>
                  ))}
                </Select>
              }
              name="organisation_id"
              control={control}
              defaultValue=""
            />
            <FormHelperText error={true}>{errors.organisation_id ? 'Field is required' : ' '}</FormHelperText>
          </FormControl>

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

export default Subscribers;
