import * as React from 'react';

import {
  Grid,
  Button,
  Typography,
} from '@material-ui/core';

import ExecutionProgress from '../components/ExecutionProgress';
import ApiServiceContext from '../contexts/api-service.context';

interface CreateViewsStepProps {
  loading: boolean;
  errored: boolean;
  onNext: <T>(callback?: () => Promise<T>) => void;
}

const CreateViewsStep: React.FC<CreateViewsStepProps> = ({ loading, errored, onNext }) => {
  const apiService = React.useContext(ApiServiceContext);

  return (
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Typography variant="body1">Create helpful views for all tables</Typography>
        <Typography variant="body1">You can examine related code later in database manager</Typography>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color={ errored ? 'secondary' : 'primary'}
          onClick={() => onNext(apiService.databaseApi.createViews)}
        >
          { loading ? <ExecutionProgress /> : 'Create'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateViewsStep;
