import * as React from 'react';

import {
  IconButton,
  TextField,
  Paper,
  Grid,
} from '@material-ui/core';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import createLocalitySql from '@sql/Localities/CreateLocality.sql';
import deleteLocalitySql from '@sql/Localities/DeleteLocality.sql';
import updateLocalitySql from '@sql/Localities/UpdateLocality.sql';
import camelcase from 'camelcase';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CodeButtons from '@/components/CodeButtons';
import { ILocality } from '@/interfaces/locality.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { createColumns } from '@/utlis/create-columns';
import { SqlParseVariableOption } from '@/utlis/parse-sql';

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

  const localitys = localitiesData?.data;
  const columns: ColDef[] = createColumns(localitys ? localitys[0] : {});
  const rows = localitys?.map((locality, index) => ({ id: index, ...locality }));
  const values = watch();

  const parseOptions: Record<string, SqlParseVariableOption> = {
    [camelcase('name')]: {
      value: values.name,
    },
    [camelcase('locality_id')]: {
      value: selectedRow?.locality_id,
    },
  };

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
    <Grid
      container
      spacing={2}
    >
      <Grid
        item
        xs={8}
      >
        <Paper className={globalClasses.dataGrid}>
          {rows && (
            <DataGrid
              columns={columns}
              rows={rows}
              onRowClick={({ data }) => setSelectedRow(data as ILocality & { id: number })}
            />
          )}
        </Paper>
      </Grid>
      <Grid
        item
        xs={4}
      >
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
              InputLabelProps={{ shrink: true }}
              error={Boolean(errors.name)}
              helperText={errors.name ? 'Field is required' : ' '}
            />

            <CodeButtons
              parseOptions={parseOptions}
              createSql={createLocalitySql}
              updateSql={updateLocalitySql}
              deleteSql={deleteLocalitySql}
              selected={selectedRow}
              disabled={!(formState.isDirty && formState.isValid)}
              onDeleteClick={deleteRow}
            />
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Localities;
