import * as React from 'react';

import {
  Grid,
  Button,
  Typography,
} from '@material-ui/core';
import createRolesSQL from '@sql/CreateRoles.sql';

import { useOnboardingStyles } from '@/styles/onboarding-styles';

import ExecutionProgress from '../components/ExecutionProgress';
import SqlCodeBlock from '../components/SqlCodeBlock';
import ApiServiceContext from '../contexts/api-service.context';

interface CreateRolesStepProps {
  loading: boolean;
  errored: boolean;
  onNext: <T>(callback?: () => Promise<T>) => void;
}

const CreateRolesStep: React.FC<CreateRolesStepProps> = ({ loading, errored, onNext }) => {
  const apiService = React.useContext(ApiServiceContext);
  const onboardingClasses = useOnboardingStyles();

  return (
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Typography variant="body1">Create db users and roles, assign manager role to User1_baranov4 and admin to User_baranov4</Typography>
      </Grid>
      <Grid
        className={onboardingClasses.codeBlock}
        item
      >
        <SqlCodeBlock text={createRolesSQL} />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color={ errored ? 'secondary' : 'primary'}
          onClick={() => onNext(apiService.databaseApi.createRoles)}
        >
          { loading ? <ExecutionProgress /> : 'Execute'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateRolesStep;
