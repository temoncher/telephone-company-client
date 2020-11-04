import * as React from 'react';

import {
  Grid,
  Button,
  Typography,
} from '@material-ui/core';

import { useOnboardingStyles } from '@/styles/onboarding-styles';

import ExecutionProgress from '../components/ExecutionProgress';
import SqlCodeBlock from '../components/SqlCodeBlock';
import { seedDatabaseSQL } from '../constants/sql/databases-sql';
import ApiServiceContext from '../contexts/api-service.context';

interface SeedDatabaseStepProps {
  loading: boolean;
  errored: boolean;
  onNext: <T>(callback?: () => Promise<T>) => void;
}

const SeedDatabaseStep: React.FC<SeedDatabaseStepProps> = ({ errored, loading, onNext }) => {
  const apiService = React.useContext(ApiServiceContext);
  const classes = useOnboardingStyles();

  return (
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Typography variant="body1">Seed database with mock data</Typography>
      </Grid>
      <Grid
        className={classes.codeBlock}
        item
      >
        <SqlCodeBlock text={seedDatabaseSQL} />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color={ errored ? 'secondary' : 'primary'}
          onClick={() => onNext(apiService.databaseApi.seed)}
        >
          { loading ? <ExecutionProgress /> : 'Execute'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default SeedDatabaseStep;
