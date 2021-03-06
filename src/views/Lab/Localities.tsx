import * as React from 'react';

import {
  IconButton,
  TextField,
  Box,
} from '@material-ui/core';
import { ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import createLocalitySql from '@sql/Localities/CreateLocality.sql';
import deleteLocalitySql from '@sql/Localities/DeleteLocality.sql';
import updateLocalitySql from '@sql/Localities/UpdateLocality.sql';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CodeButtons from '@/components/CodeButtons';
import Layout from '@/components/Layout';
import { ILocality } from '@/interfaces/locality.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { createColumns } from '@/utlis/create-columns';

import ApiServiceContext from '../../contexts/api-service.context';

type LocalityForm = Stringified<Omit<ILocality, 'locality_id'>>

const defaultValues: LocalityForm = {
  name: '',
};

const Localities: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<ILocality & { id: number } | null>(null);
  const { register, handleSubmit, errors, watch, reset, formState } = useForm<LocalityForm>({ defaultValues, mode: 'onChange' });
  const { data: localitiesData, refetch: refetchLocalitys } = useQuery('localitys', apiService.localityApi.getAllLocalities);
  const globalClasses = useGlobalStyles();

  const localities = localitiesData?.data;
  const columns: ColDef[] = createColumns(localities ? localities[0] : {});
  const rows = localities?.map((locality, index) => ({ id: index, ...locality }));
  const values = watch();

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
    <Layout
      cols={columns}
      rows={rows}
      onRowClick={({ data }) => setSelectedRow(data as ILocality & { id: number })}
    >
      <Box className={globalClasses.editorHeader}>
        {selectedRow ? 'Edit locality' : 'Create new locality'}
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
          name="name"
          label="Name*"
          variant="outlined"
          InputLabelProps={{ shrink: Boolean(values.name) }}
          error={Boolean(errors.name)}
          helperText={errors.name ? 'Field is required' : ' '}
        />

        <CodeButtons
          type={localities && localities[0] || {}}
          values={{ ...values, locality_id: selectedRow?.locality_id }}
          createSql={createLocalitySql}
          updateSql={updateLocalitySql}
          deleteSql={deleteLocalitySql}
          selected={selectedRow}
          disabled={!(formState.isDirty && formState.isValid)}
          onDeleteClick={deleteRow}
        />
      </form>
    </Layout>
  );
};

export default Localities;
