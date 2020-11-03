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

import { IOrganisation } from '@/interfaces/organisation.interface';
import { useGlobalStyles } from '@/styles/global-styles';

import ApiServiceContext from '../../contexts/api-service.context';

const defaultValues: Omit<Partial<IOrganisation>, 'organisation_id'> = {
  name: '',
};

const Organisations: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [selectedRow, setSelectedRow] = React.useState<IOrganisation & { id: number } | null>(null);
  const { register, handleSubmit, errors, reset } = useForm<Omit<IOrganisation, 'organisation_id'>>({ defaultValues });
  const { data: organisationsData, refetch: refetchOrganisations } = useQuery('organisations', apiService.organisationApi.getAllOrganisations);
  const globalClasses = useGlobalStyles();

  const organisations = organisationsData?.data;
  const columns: ColDef[] = Object.entries(organisations ? organisations[0] : {}).map(([key, value]) => ({
    field: key,
    width: typeof value === 'string' ? 200 : 100,
    type: typeof value === 'string' ? 'string' : 'number',
  }));
  const rows = organisations?.map((organisation, index) => ({ id: index, ...organisation }));
  const isFormValid = Object.keys(errors).length === 0;

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, organisation_id, ...fieldsToReset } = selectedRow;

    reset({ ...fieldsToReset });
  }, [selectedRow]);

  const handleSubmitClick = async (data: IOrganisation) => {
    if (selectedRow) {
      await apiService.organisationApi.updateOrganisation(selectedRow.organisation_id, data);

      setSelectedRow(null);
    } else {
      await apiService.organisationApi.createOrganisation(data);
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
      <div
        className={globalClasses.dataGrid}
      >
        {
          rows &&
        <DataGrid
          columns={columns}
          rows={rows}
          onRowClick={({ data }) => setSelectedRow(data as IOrganisation & { id: number })}
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

export default Organisations;