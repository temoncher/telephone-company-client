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

import { IDaytime } from '@/interfaces/daytime.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { createColumns } from '@/utlis/create-columns';

import ApiServiceContext from '../../contexts/api-service.context';

type DaytimeForm = Stringified<Omit<IDaytime, 'daytime_id'>>;

const defaultValues: DaytimeForm = {
  title: '',
};

const Daytimes: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<IDaytime & { id: number } | null>(null);
  const { register, handleSubmit, errors, reset, formState } = useForm<DaytimeForm>({ defaultValues, mode: 'onChange' });
  const { data: daytimesData, refetch: refetchDaytimes } = useQuery('daytimes', apiService.daytimeApi.getAllDaytimes);
  const globalClasses = useGlobalStyles();

  const daytimes = daytimesData?.data;
  const columns: ColDef[] = createColumns(daytimes ? daytimes[0] : {});
  const rows = daytimes?.map((daytime, index) => ({ id: index, ...daytime }));

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, daytime_id, ...fieldsToReset } = selectedRow;

    reset({ ...fieldsToReset });
  }, [selectedRow]);

  const handleSubmitClick = async (formData: DaytimeForm) => {
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
      <Paper className={globalClasses.dataGrid}>
        {rows && (
          <DataGrid
            columns={columns}
            rows={rows}
            onRowClick={({ data }) => setSelectedRow(data as IDaytime & { id: number })}
          />
        )}
      </Paper>
      <Paper className={globalClasses.editor}>
        <div className={globalClasses.editorHeader}>
          {selectedRow ? 'Edit daytime' : 'Create new daytime'}
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
            name="title"
            label="Title*"
            variant="outlined"
            error={Boolean(errors.title)}
            helperText={errors.title ? 'Field is required' : ' '}
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

export default Daytimes;
