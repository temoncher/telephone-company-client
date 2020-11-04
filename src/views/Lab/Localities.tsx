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

import { ILocality } from '@/interfaces/locality.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';

import ApiServiceContext from '../../contexts/api-service.context';

type LocalityForm = Stringified<Omit<ILocality, 'locality_id'>>

const defaultValues: LocalityForm = {
  name: '',
};

const Localitys: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<ILocality & { id: number } | null>(null);
  const { register, handleSubmit, errors, reset } = useForm<LocalityForm>({ defaultValues });
  const { data: localitiesData, refetch: refetchLocalitys } = useQuery('localitys', apiService.localityApi.getAllLocalities);
  const globalClasses = useGlobalStyles();

  const localitys = localitiesData?.data;
  const columns: ColDef[] = Object.entries(localitys ? localitys[0] : {}).map(([key, value]) => ({
    field: key,
    width: typeof value === 'string' ? 200 : 100,
    type: typeof value === 'string' ? 'string' : 'number',
  }));
  const rows = localitys?.map((locality, index) => ({ id: index, ...locality }));
  const isFormValid = Object.keys(errors).length === 0;

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
      <div
        className={globalClasses.dataGrid}
      >
        {rows && (
          <DataGrid
            columns={columns}
            rows={rows}
            onRowClick={({ data }) => setSelectedRow(data as ILocality & { id: number })}
          />
        )}
      </div>
      <div className={globalClasses.editor}>
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
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.name)}
            helperText={errors.name ? 'Field is required' : ' '}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid}
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
      </div>
    </>
  );
};

export default Localitys;
