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
} from '@material-ui/core';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from 'react-query';

import { ISubscriber } from '@/interfaces/subscriber.interface';
import { useGlobalStyles } from '@/styles/global-styles';

import ApiServiceContext from '../../contexts/api-service.context';

const defaultValues: Omit<Partial<ISubscriber>, 'subscriber_id'> = {
  organisation_id: undefined,
  inn: undefined,
  first_name: '',
  last_name: '',
  patronymic: '',
  adress: '',
};

const Subscribers: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<ISubscriber & { id: number } | null>(null);
  const { register, handleSubmit, control, errors, reset } = useForm<Omit<ISubscriber, 'subscriber_id'>>({ defaultValues });
  const { data: subscribersData, refetch: refetchSubscribers } = useQuery('subscribers', apiService.subscriberApi.getAllSubscribers);
  const { data: organisationsData } = useQuery('organisations', apiService.organisationApi.getAllOrganisations);
  const globalClasses = useGlobalStyles();

  const subscribers = subscribersData?.data;
  const organisations = organisationsData?.data;
  const columns: ColDef[] = Object.entries(subscribers ? subscribers[0] : {}).map(([key, value]) => ({
    field: key,
    width: typeof value === 'string' ? 200 : 100,
    type: typeof value === 'string' ? 'string' : 'number',
  }));
  const rows = subscribers?.map((subscriber, index) => ({ id: index, ...subscriber }));
  const isFormValid = Object.keys(errors).length === 0;

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, subscriber_id, ...fieldsToReset } = selectedRow;

    reset({ ...fieldsToReset });
  }, [selectedRow]);

  const handleSubmitClick = async (subscriber: ISubscriber) => {
    const validSubscriber: ISubscriber = {
      ...subscriber,
      inn: Number(subscriber.inn),
    };

    if (selectedRow) {
      await apiService.subscriberApi.updateSubscriber(selectedRow.subscriber_id, validSubscriber);

      setSelectedRow(null);
    } else {
      await apiService.subscriberApi.createSubscriber(validSubscriber);
    }

    await refetchSubscribers();
  };

  const deleteRow = async () => {
    if (!selectedRow) return;

    await apiService.subscriberApi.deleteSubscriber(selectedRow?.subscriber_id);

    await refetchSubscribers();
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
          onRowClick={({ data }) => setSelectedRow(data as ISubscriber & { id: number })}
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
            name="inn"
            label="INN*"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.inn)}
            helperText={errors.inn ? 'Field is required' : ' '}
          />
          <TextField
            inputRef={register({ required: true })}
            size="small"
            name="first_name"
            label="First name*"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.first_name)}
            helperText={errors.first_name ? 'Field is required' : ' '}
          />
          <TextField
            inputRef={register({ required: true })}
            size="small"
            name="last_name"
            label="Last name*"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.last_name)}
            helperText={errors.last_name ? 'Field is required' : ' '}
          />
          <TextField
            inputRef={register()}
            size="small"
            name="patronymic"
            label="Patronymic"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.patronymic)}
            helperText={errors.patronymic ? 'Field is required' : ' '}
          />
          <TextField
            inputRef={register()}
            size="small"
            name="adress"
            label="Adress"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.patronymic)}
            helperText={errors.adress ? 'Field is required' : ' '}
          />
          <FormControl
            variant="outlined"
            size="small"
          >
            <InputLabel
              id="organisation-label"
              shrink={true}
            >
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
                  id="demo-simple-select-outlined"
                  label="Locality"
                  error={Boolean(errors.organisation_id)}
                >
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

export default Subscribers;
