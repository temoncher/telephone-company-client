import * as React from 'react';

import {
  Grid,
  Button,
  Tab,
  Tabs,
  Box,
} from '@material-ui/core';

import { useOnboardingStyles } from '@/styles/onboarding-styles';

import ExecutionProgress from '../components/ExecutionProgress';
import SqlCodeBlock from '../components/SqlCodeBlock';
import {
  createAccountTriggerSQL,
  updateBalanceTriggerSQL,
  softDeleteCallTriggerSQL,
  createTransactionAfterCallTriggerSQL,
} from '../constants/sql/databases-sql';
import ApiServiceContext from '../contexts/api-service.context';

interface SetupTriggersStepProps {
  loading: boolean;
  errored: boolean;
  onNext: <T>(callback?: () => Promise<T>) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ value, index, children }) => {
  const onboardingClasses = useOnboardingStyles();

  return (
    <Box
      className={onboardingClasses.codeBlock}
      role="tabpanel"
      p={3}
      hidden={value !== index}
    >
      {value === index && children}
    </Box>
  );
};

const SetupTriggersStep: React.FC<SetupTriggersStepProps> = ({ loading, errored, onNext }) => {
  const apiService = React.useContext(ApiServiceContext);
  const [value, setValue] = React.useState(0);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Tabs
        value={value}
        onChange={handleChange}
      >
        <Tab label="Subscribers(after insert)" />
        <Tab label="Transactions(after insert)" />
        <Tab label="Calls(after insert)" />
        <Tab label="Calls(instead of delete)" />
      </Tabs>

      <TabPanel
        value={value}
        index={0}
      >
        <SqlCodeBlock text={createAccountTriggerSQL} />
      </TabPanel>

      <TabPanel
        value={value}
        index={1}
      >
        <SqlCodeBlock text={updateBalanceTriggerSQL} />
      </TabPanel>

      <TabPanel
        value={value}
        index={2}
      >
        <SqlCodeBlock text={createTransactionAfterCallTriggerSQL} />
      </TabPanel>

      <TabPanel
        value={value}
        index={3}
      >
        <SqlCodeBlock text={softDeleteCallTriggerSQL} />
      </TabPanel>

      <Grid item>
        <Button
          variant="contained"
          color={ errored ? 'secondary' : 'primary'}
          onClick={() => onNext(apiService.databaseApi.setupTriggers)}
        >
          { loading ? <ExecutionProgress /> : 'Execute all'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default SetupTriggersStep;
