import * as React from 'react';

import {
  IconButton,
  TextField,
} from '@material-ui/core';
import { ColDef } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import createOrganisationSql from '@sql/Organisations/CreateOrganisation.sql';
import deleteOrganisationSql from '@sql/Organisations/DeleteOrganisation.sql';
import updateOrganisationSql from '@sql/Organisations/UpdateOrganisation.sql';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CodeButtons from '@/components/CodeButtons';
import Layout from '@/components/Layout';
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
  const { register, handleSubmit, errors, reset, watch, formState } = useForm<OrganisationForm>({ defaultValues, mode: 'onChange' });
  const { data: organisationsData, refetch: refetchOrganisations } = useQuery('organisations', apiService.organisationApi.getAllOrganisations);
  const globalClasses = useGlobalStyles();

  const organisations = organisationsData?.data;
  const columns: ColDef[] = createColumns(organisations ? organisations[0] : {});
  const rows = organisations?.map((organisation, index) => ({ id: index, ...organisation }));
  const values = watch();

  React.useEffect(() => {
    if (!selectedRow) {
      reset(defaultValues);

      return;
    }

    const { id, organisation_id, ...fieldsToReset } = selectedRow;

    reset({ ...fieldsToReset });
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
    <Layout
      cols={columns}
      rows={rows}
      onRowClick={({ data }) => setSelectedRow(data as IOrganisation & { id: number })}
    >
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

        <CodeButtons
          type={organisations && organisations[0] || {}}
          values={{ ...values, organisation_id: selectedRow?.organisation_id }}
          createSql={createOrganisationSql}
          updateSql={updateOrganisationSql}
          deleteSql={deleteOrganisationSql}
          onDeleteClick={deleteRow}
          selected={selectedRow}
          disabled={!(formState.isDirty && formState.isValid)}
        />
      </form>
    </Layout>
  );
};

export default Organisations;
