import * as React from 'react';

import {
  Grid,
  Button,
  Typography,
} from '@material-ui/core';
import { CodeBlock, dracula } from 'react-code-blocks';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';

import { createDatabaseSQL, dropDatabaseSQL } from '../constants/sql/databases-sql';
import ApiServiceContext from '../contexts/api-service.context';

const Database: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const history = useHistory();
  const { data, isLoading, refetch } = useQuery('databases', apiService.databaseApi.getDatabases);

  const createDatabase = async () => {
    await apiService.databaseApi.createDatabase();

    await refetch();
  };

  const dropDatabase = async () => {
    await apiService.databaseApi.dropDatabase();

    await refetch();
  };

  const renderCreateDatabase = () => (
    <>
      <Grid item>
        <Typography variant="h4">It seems like you have no database, create one!</Typography>
      </Grid>
      <Grid item>
        <CodeBlock
          text={createDatabaseSQL}
          language="sql"
          theme={dracula}
        />
      </Grid>
      <Grid item>
        <Button
          color="primary"
          variant="contained"
          onClick={createDatabase}
        >
          CREATE
        </Button>
      </Grid>
    </>
  );

  const renderDropDatabase = () => (
    <>
      <Grid item>
        <Typography variant="h4">It seems like you have a database!</Typography>
      </Grid>
      <Grid item>
        <CodeBlock
          text={dropDatabaseSQL}
          language="sql"
          theme={dracula}
        />
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          onClick={dropDatabase}
        >
          DROP
        </Button>

        <Button
          color="primary"
          variant="contained"
          onClick={() => history.push('/lab')}
        >
          PROCEED
        </Button>
      </Grid>
    </>
  );

  const renderBody = () => {
    if (!data) return <></>;

    if (!data.data.length) return renderCreateDatabase();

    return renderDropDatabase();
  };

  return (
    <Grid
      container
      direction="column"
      spacing={1}
    >
      { isLoading ? 'Wait for it...' : renderBody() }
    </Grid>
  );
};

export default Database;
