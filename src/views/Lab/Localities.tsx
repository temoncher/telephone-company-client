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

import { ILocality } from '@/interfaces/locality.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { createColumns } from '@/utlis/create-columns';

import ApiServiceContext from '../../contexts/api-service.context';

type LocalityForm = Stringified<Omit<ILocality, 'locality_id'>>

const defaultValues: LocalityForm = {
  name: '',
};

const Localitys: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<ILocality & { id: number } | null>(null);
  const { register, handleSubmit, errors, reset, control, formState } = useForm<LocalityForm>({ defaultValues, mode: 'onChange' });
  const { data: localitiesData, refetch: refetchLocalitys } = useQuery('localitys', apiService.localityApi.getAllLocalities);
  const globalClasses = useGlobalStyles();

  const localitys = localitiesData?.data;
  const columns: ColDef[] = createColumns(localitys ? localitys[0] : {});
  const rows = localitys?.map((locality, index) => ({ id: index, ...locality }));
  const values = control.getValues();

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, locality_id, ...fieldsToReset } = selectedRow;

    reset({ ...fieldsToReset });
  }, [selectedRow]);

  const handleSubmitClick = async (formData: LocalityForm) => {
    if (selectedRow) {
      await apiService.localityApi.updateLocality(selectedRow.locality_id, formData);

      setSelectedRow(null);
    } else {
      await apiService.localityApi.createLocality(formData);
    }

    await refetchLocalitys();
  };

  const deleteRow = async () => {
    if (!selectedRow) return;

    await apiService.localityApi.deleteLocality(selectedRow?.locality_id);

    setSelectedRow(null);

    await refetchLocalitys();
  };

  return (
    <>
      <Paper className={globalClasses.dataGrid}>
        {rows && (
          <DataGrid
            columns={columns}
            rows={rows}
            onRowClick={({ data }) => setSelectedRow(data as ILocality & { id: number })}
          />
        )}
      </Paper>
      <Paper className={globalClasses.editor}>
        <div className={globalClasses.editorHeader}>
          {selectedRow ? 'Edit locality' : 'Create new locality'}
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
            name="name"
            label="Name*"
            variant="outlined"
            InputLabelProps={{ shrink: Boolean(values.name) }}
            error={Boolean(errors.name)}
            helperText={errors.name ? 'Field is required' : ' '}
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

export default Localitys;
