import * as React from 'react';

import { Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { AxiosError } from 'axios';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Lab from './views/Lab/index';
import Onboarding from './views/Onboarding';

interface SqlError {
  errors: Record<string, string[]>;
  status: number;
  title: string;
  traceId: string;
  type: string;
}

const App: React.FC = () => {
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleRejection = (event: PromiseRejectionEvent) => {
    if (event.reason.isAxiosError) {
      const axiosError = event.reason as AxiosError<string | SqlError>;

      if (axiosError.response) {
        const { data } = axiosError.response;

        if (typeof data === 'string') {
          if (data.includes('permission was denied')) {
            setMessage('Permission denied');
            setIsSnackbarOpen(true);

            return;
          }

          if (data.includes('Violation of PRIMARY KEY constraint')) {
            setMessage('Violation of PRIMARY KEY constraint');
            setIsSnackbarOpen(true);

            return;
          }

          return;
        }

        if (Object.keys(data.errors).length) {
          const [, [firstError]] = Object.entries(data.errors)[0];

          setMessage(firstError);
          setIsSnackbarOpen(true);

          return;
        }
      }

      setMessage('Something went terribly wrong');
      setIsSnackbarOpen(true);
    }
  };

  React.useEffect(() => {
    window.addEventListener('unhandledrejection', handleRejection);
  }, []);

  const handleClose = (_: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsSnackbarOpen(false);
  };

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            component={Onboarding}
          />
          <Route
            path="/lab"
            component={Lab}
          />
        </Switch>
      </BrowserRouter>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  ); };

export default App;
