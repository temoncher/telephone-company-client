import * as React from 'react';

import {
  Grid,
  Button,
  Typography,
} from '@material-ui/core';
import { CodeBlock, dracula } from 'react-code-blocks';

import { useOnboardingStyles } from '@/styles/onboarding-styles';

import ExecutionProgress from '../components/ExecutionProgress';
import {
  createAccountTriggerSQL,
  updateBalanceTriggerSQL,
  createTransactionAfterCallTriggerSQL,
} from '../constants/sql/databases-sql';
import ApiServiceContext from '../contexts/api-service.context';

interface SetupTriggersStepProps {
  loading: boolean;
  errored: boolean;
  onNext: <T>(callback?: () => Promise<T>) => void;
}

const SetupTriggersStep: React.FC<SetupTriggersStepProps> = ({ loading, errored, onNext }) => {
  const apiService = React.useContext(ApiServiceContext);
  const onboardingClasses = useOnboardingStyles();

  return (
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Typography variant="body1">Set up account creation trigger on new subscriber insertion</Typography>
      </Grid>
      <Grid
        className={onboardingClasses.codeBlock}
        item
      >
        <CodeBlock
          text={createAccountTriggerSQL}
          language="sql"
          theme={dracula}
        />
      </Grid>
      <Grid item>
        <Typography variant="body1">Set up account balance update trigger on new transaction insertion</Typography>
      </Grid>
      <Grid
        className={onboardingClasses.codeBlock}
        item
      >
        <CodeBlock
          text={updateBalanceTriggerSQL}
          language="sql"
          theme={dracula}
        />
      </Grid>
      <Grid item>
        <Typography variant="body1">Set up transaction creation trigger after inserting a call</Typography>
      </Grid>
      <Grid
        className={onboardingClasses.codeBlock}
        item
      >
        <CodeBlock
          text={createTransactionAfterCallTriggerSQL}
          language="sql"
          theme={dracula}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color={ errored ? 'secondary' : 'primary'}
          onClick={() => onNext(apiService.databaseApi.setupTriggers)}
        >
          { loading ? <ExecutionProgress /> : 'Execute'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default SetupTriggersStep;
