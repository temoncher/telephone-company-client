import * as React from 'react';

import {
  IconButton,
  TextField,
  Box,
} from '@material-ui/core';
import { ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import createDaytimeSql from '@sql/Daytimes/CreateDaytime.sql';
import deleteDaytimeSql from '@sql/Daytimes/DeleteDaytime.sql';
import updateDaytimeSql from '@sql/Daytimes/UpdateDaytime.sql';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CodeButtons from '@/components/CodeButtons';
import Layout from '@/components/Layout';
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
  const { register, handleSubmit, errors, reset, watch, formState } = useForm<DaytimeForm>({ defaultValues, mode: 'onChange' });
  const { data: daytimesData, refetch: refetchDaytimes } = useQuery('daytimes', apiService.daytimeApi.getAllDaytimes);
  const globalClasses = useGlobalStyles();

  const daytimes = daytimesData?.data;
  const columns: ColDef[] = daytimes ? createColumns(daytimes[0]) : [];
  const rows = daytimes?.map((daytime, index) => ({ id: index, ...daytime }));
  const values = watch();

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
    <Layout
      cols={columns}
      rows={rows}
      onRowClick={({ data }) => setSelectedRow(data as IDaytime & { id: number })}
    >
      <Box className={globalClasses.editorHeader}>
        {selectedRow ? 'Edit daytime' : 'Create new daytime'}
        {selectedRow && (
          <IconButton
            size="small"
            onClick={() => setSelectedRow(null)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
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
          InputLabelProps={{ shrink: Boolean(values.title) }}
          error={Boolean(errors.title)}
          helperText={errors.title ? 'Field is required' : ' '}
        />

        <CodeButtons
          type={daytimes && daytimes[0] || {}}
          values={{ ...values, daytime_id: selectedRow?.daytime_id }}
          createSql={createDaytimeSql}
          updateSql={updateDaytimeSql}
          deleteSql={deleteDaytimeSql}
          selected={selectedRow}
          disabled={!(formState.isDirty && formState.isValid)}
          onDeleteClick={deleteRow}
        />
      </form>
    </Layout>
  );
};

export default Daytimes;
