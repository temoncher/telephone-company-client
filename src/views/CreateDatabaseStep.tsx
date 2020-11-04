import * as React from 'react';

import {
  Grid,
  Button,
  Typography,
} from '@material-ui/core';
import createDatabaseSql from '@sql/CreateTables.sql';

import { useOnboardingStyles } from '@/styles/onboarding-styles';

import ExecutionProgress from '../components/ExecutionProgress';
import SqlCodeBlock from '../components/SqlCodeBlock';
import ApiServiceContext from '../contexts/api-service.context';

interface CreateDatabaseStepProps {
  loading: boolean;
  errored: boolean;
  onNext: <T>(callback?: () => Promise<T>) => void;
}

const CreateDatabaseStep: React.FC<CreateDatabaseStepProps> = ({ loading, errored, onNext }) => {
  const apiService = React.useContext(ApiServiceContext);
  const onboardingClasses = useOnboardingStyles();

  return (
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Typography variant="body1">It seems like you have no database, create one!</Typography>
      </Grid>
      <Grid
        className={onboardingClasses.codeBlock}
        item
      >
        <SqlCodeBlock text={createDatabaseSql} />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color={ errored ? 'secondary' : 'primary'}
          onClick={() => onNext(apiService.databaseApi.createDatabase)}
        >
          { loading ? <ExecutionProgress /> : 'Execute'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateDatabaseStep;
