import * as React from 'react';

import {
  Grid,
  Button,
  Typography,
  Container,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import { CodeBlock, dracula } from 'react-code-blocks';
import { useHistory } from 'react-router';

import { OnboardingStepAlias } from '@/enums/onboarding-step-alias';
import { IOnboardingStep } from '@/interfaces/onboarding-step.interface';

import SchemaSrc from '../assets/DBSchema.png';
import OnboardingStepper from '../components/OnboardingStepper';
import {
  createDatabaseSQL,
  createRolesSQL,
  createAccountTriggerSQL,
  updateBalanceTriggerSQL,
  seedDatabaseSQL,
} from '../constants/sql/databases-sql';
import ApiServiceContext from '../contexts/api-service.context';

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
      maxHeight: '50vh',
    },
    schema: {
      width: '100%',
      maxHeight: '50vh',
    },
  }),
);

const Database: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(OnboardingStepAlias.SCHEMA);
  const apiService = React.useContext(ApiServiceContext);
  const history = useHistory();
  const classes = useStyles();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const renderSchema: React.FC = () => (
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Typography variant="body1">Consider following database schema</Typography>
      </Grid>
      <Grid item>
        <img
          className={classes.schema}
          src={SchemaSrc}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
        >
          Next
        </Button>
      </Grid>
    </Grid>
  );

  const renderCreateDatabase: React.FC = () => (
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Typography variant="body1">It seems like you have no database, create one!</Typography>
      </Grid>
      <Grid
        className={classes.codeBlock}
        item
      >
        <CodeBlock
          text={createDatabaseSQL}
          language="sql"
          theme={dracula}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            apiService.databaseApi.createDatabase();

            handleNext();
          }}
        >
          Execute
        </Button>
      </Grid>
    </Grid>
  );

  const renderCreateRoles: React.FC = () => (
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Typography variant="body1">Create db users and roles, assign manager role to User1_baranov4 and admin to User_baranov4</Typography>
      </Grid>
      <Grid
        className={classes.codeBlock}
        item
      >
        <CodeBlock
          text={createRolesSQL}
          language="sql"
          theme={dracula}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            apiService.databaseApi.createRoles();

            handleNext();
          }}
        >
          Execute
        </Button>
      </Grid>
    </Grid>
  );

  const renderSetupTriggers: React.FC = () => (
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Typography variant="body1">Set up account creation trigger on new subscriber insertion</Typography>
      </Grid>
      <Grid
        className={classes.codeBlock}
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
        className={classes.codeBlock}
        item
      >
        <CodeBlock
          text={updateBalanceTriggerSQL}
          language="sql"
          theme={dracula}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            apiService.databaseApi.setupTriggers();

            handleNext();
          }}
        >
          Execute
        </Button>
      </Grid>
    </Grid>
  );

  const renderSeedDatabase: React.FC = () => (
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
        <CodeBlock
          text={seedDatabaseSQL}
          language="sql"
          theme={dracula}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            apiService.databaseApi.seed();

            handleNext();
          }}
        >
          Finish
        </Button>
      </Grid>
    </Grid>
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
          variant="outlined"
          color="primary"
          onClick={() => history.push('lab')}
        >
          Proceed
        </Button>
      </Grid>
    </Grid>
  );

  const steps: IOnboardingStep[] = [
    {
      alias: OnboardingStepAlias.SCHEMA,
      Component: renderSchema,
      label: 'View database schema',
    },
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

export default Database;
