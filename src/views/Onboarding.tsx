import * as React from 'react';

import {
  Grid,
  Button,
  Typography,
  Container,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import { useHistory } from 'react-router';

import { OnboardingStepAlias } from '@/enums/onboarding-step-alias';
import { IOnboardingStep } from '@/interfaces/onboarding-step.interface';

import OnboardingStepper from '../components/OnboardingStepper';

import CreateDatabaseStep from './CreateDatabaseStep';
import CreateRolesStep from './CreateRolesStep';
import SeedDatabaseStep from './SeedDatabaseStep';
import SetupTriggersStep from './SetupTriggersStep';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: '100vh',
    },
    buttonMargin: {
      marginRight: 8,
    },
    codeBlock: {
      overflow: 'auto',
      maxHeight: '40vh',
      maxWidth: '100%',
    },
    schema: {
      width: '100%',
      maxHeight: '40vh',
    },
  }),
);

const Onboarding: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(OnboardingStepAlias.DATABASE);
  const [loading, setLoading] = React.useState(false);
  const [errored, setErrored] = React.useState(false);
  const history = useHistory();
  const classes = useStyles();

  const handleNext = async (callback?: () => Promise<unknown>) => {
    setLoading(true);

    try {
      if (callback) {
        await callback();

        setErrored(false);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch(error) {
      setErrored(true);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const renderCreateDatabase: React.FC = () => (
    <CreateDatabaseStep
      loading={loading}
      errored={errored}
      onNext={handleNext}
    />
  );

  const renderCreateRoles: React.FC = () => (
    <CreateRolesStep
      loading={loading}
      errored={errored}
      onNext={handleNext}
    />
  );

  const renderSetupTriggers: React.FC = () => (
    <SetupTriggersStep
      loading={loading}
      errored={errored}
      onNext={handleNext}
    />
  );

  const renderSeedDatabase: React.FC = () => (
    <SeedDatabaseStep
      loading={loading}
      errored={errored}
      onNext={handleNext}
    />
  );

  const renderProceed: React.FC = () => (
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Typography variant="body1">All steps completed - preparation finished</Typography>
      </Grid>
      <Grid item>
        <Button
          className={classes.buttonMargin}
          variant="contained"
          color="primary"
          onClick={() => history.push('lab')}
        >
          Finish
        </Button>
      </Grid>
    </Grid>
  );

  const steps: IOnboardingStep[] = [
    {
      alias: OnboardingStepAlias.DATABASE,
      Component: renderCreateDatabase,
      label: 'Create database',
    },
    {
      alias: OnboardingStepAlias.ROLES,
      Component: renderCreateRoles,
      label: 'Create system roles',
    },
    {
      alias: OnboardingStepAlias.TRIGGERS,
      Component: renderSetupTriggers,
      label: 'Setup triggers',
    },
    {
      alias: OnboardingStepAlias.SEED,
      Component: renderSeedDatabase,
      label: 'Seed database',
    },
    {
      alias: OnboardingStepAlias.PROCEED,
      Component: renderProceed,
      label: 'Proceed to database manager',
    },
  ];

  return (
    <Container className={classes.root}>
      <Grid
        container
        direction="column"
        spacing={1}
      >
        <OnboardingStepper
          activeStep={activeStep}
          steps={steps}
        />
      </Grid>
    </Container>
  );
};

export default Onboarding;
