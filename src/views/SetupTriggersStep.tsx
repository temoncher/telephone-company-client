import * as React from 'react';

import {
  Grid,
  Button,
  Tab,
  Tabs,
  Box,
} from '@material-ui/core';
import { CodeBlock, dracula } from 'react-code-blocks';

import { useOnboardingStyles } from '@/styles/onboarding-styles';

import ExecutionProgress from '../components/ExecutionProgress';
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
        <CodeBlock
          text={createAccountTriggerSQL}
          language="sql"
          theme={dracula}
        />
      </TabPanel>

      <TabPanel
        value={value}
        index={1}
      >
        <CodeBlock
          text={updateBalanceTriggerSQL}
          language="sql"
          theme={dracula}
        />
      </TabPanel>

      <TabPanel
        value={value}
        index={2}
      >
        <CodeBlock
          text={createTransactionAfterCallTriggerSQL}
          language="sql"
          theme={dracula}
        />
      </TabPanel>

      <TabPanel
        value={value}
        index={3}
      >
        <CodeBlock
          text={softDeleteCallTriggerSQL}
          language="sql"
          theme={dracula}
        />
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
