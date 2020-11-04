import * as React from 'react';

import { CircularProgress } from '@material-ui/core';

const ExecutionProgress: React.FC = () => (
  <CircularProgress
    style={{ padding: '2px 24px' }}
    color="inherit"
    size={20}
  />
);

export default ExecutionProgress;
