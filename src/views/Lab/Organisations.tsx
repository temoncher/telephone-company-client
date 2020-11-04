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

import { IOrganisation } from '@/interfaces/organisation.interface';
import { useGlobalStyles } from '@/styles/global-styles';
import { Stringified } from '@/types/stringified';
import { createColumns } from '@/utlis/create-columns';

import ApiServiceContext from '../../contexts/api-service.context';

type OrganisationForm = Stringified<Omit<IOrganisation, 'organisation_id'>>

const defaultValues: OrganisationForm = {
  name: '',
};

const Organisations: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<IOrganisation & { id: number } | null>(null);
  const { register, handleSubmit, errors, reset, control, formState } = useForm<OrganisationForm>({ defaultValues, mode: 'onChange' });
  const { data: organisationsData, refetch: refetchOrganisations } = useQuery('organisations', apiService.organisationApi.getAllOrganisations);
  const globalClasses = useGlobalStyles();

  const organisations = organisationsData?.data;
  const columns: ColDef[] = createColumns(organisations ? organisations[0] : {});
  const rows = organisations?.map((organisation, index) => ({ id: index, ...organisation }));
  const values = control.getValues();

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, organisation_id, ...fieldsToReset } = selectedRow;

    reset(
      { ...fieldsToReset },
      {
        isValid: true,
        isDirty: false,
      },
    );
  }, [selectedRow]);

  const handleSubmitClick = async (formData: OrganisationForm) => {
    if (selectedRow) {
      await apiService.organisationApi.updateOrganisation(selectedRow.organisation_id, formData);

      setSelectedRow(null);
    } else {
      await apiService.organisationApi.createOrganisation(formData);
    }

    await refetchOrganisations();
  };

  const deleteRow = async () => {
    if (!selectedRow) return;

    await apiService.organisationApi.deleteOrganisation(selectedRow?.organisation_id);

    setSelectedRow(null);

    await refetchOrganisations();
  };

  return (
    <>
      <Paper
        className={globalClasses.dataGrid}
      >
        {rows && (
          <DataGrid
            columns={columns}
            rows={rows}
            onRowClick={({ data }) => setSelectedRow(data as IOrganisation & { id: number })}
          />
        )}

      </Paper>
      <Paper className={globalClasses.editor}>
        <div className={globalClasses.editorHeader}>
          {selectedRow ? 'Edit organisation' : 'Create new organisation'}
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

export default Organisations;
