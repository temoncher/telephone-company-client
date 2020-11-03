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

import { IDaytime } from '@/interfaces/daytime.interface';
import { useGlobalStyles } from '@/styles/global-styles';

import ApiServiceContext from '../../contexts/api-service.context';

const defaultValues: Omit<Partial<IDaytime>, 'daytime_id'> = {
  title: '',
};

const Daytimes: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<IDaytime & { id: number } | null>(null);
  const { register, handleSubmit, errors, reset } = useForm<Omit<IDaytime, 'daytime_id'>>({ defaultValues });
  const { data: daytimesData, refetch: refetchDaytimes } = useQuery('daytimes', apiService.daytimeApi.getAllDaytimes);
  const globalClasses = useGlobalStyles();

  const daytimes = daytimesData?.data;
  const columns: ColDef[] = Object.entries(daytimes ? daytimes[0] : {}).map(([key, value]) => ({
    field: key,
    width: typeof value === 'string' ? 200 : 100,
    type: typeof value === 'string' ? 'string' : 'number',
  }));
  const rows = daytimes?.map((daytime, index) => ({ id: index, ...daytime }));
  const isFormValid = Object.keys(errors).length === 0;

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, daytime_id, ...fieldsToReset } = selectedRow;

    reset({ ...fieldsToReset });
  }, [selectedRow]);

  const handleSubmitClick = async (formData: IDaytime) => {
    if (selectedRow) {
      await apiService.daytimeApi.updateDaytime(selectedRow.daytime_id, formData);

      setSelectedRow(null);
    } else {
      await apiService.daytimeApi.createDaytime(formData);
    }

    await refetchDaytimes();
  };

  const deleteRow = async () => {
    if (!selectedRow) return;

    await apiService.daytimeApi.deleteDaytime(selectedRow?.daytime_id);

    setSelectedRow(null);

    await refetchDaytimes();
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
          onRowClick={({ data }) => setSelectedRow(data as IDaytime & { id: number })}
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
            name="title"
            label="Title*"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.title)}
            helperText={errors.title ? 'Field is required' : ' '}
          />

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

export default Daytimes;
