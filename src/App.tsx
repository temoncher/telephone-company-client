import * as React from 'react';

import {
  Snackbar,
  IconButton,
  Drawer,
  makeStyles,
  createStyles,
  Fab,
  Theme,
} from '@material-ui/core';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import CloseIcon from '@material-ui/icons/Close';
import { AxiosError } from 'axios';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import SchemaSrc from './assets/DBSchema.png';
import Lab from './views/Lab/index';
import Onboarding from './views/Onboarding';

interface SqlError {
  errors: Record<string, string[]>;
  status: number;
  title: string;
  traceId: string;
  type: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    schemaFab: {
      position: 'fixed',
      bottom: 0,
      right: 0,
      margin: theme.spacing(4),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }),
);

const App: React.FC = () => {
  const [isSnackbarOpened, setIsSnackbarOpened] = React.useState(false);
  const [isSchemaOpened, setIsSchemaOpened] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const classes = useStyles();

  const handleRejection = (event: PromiseRejectionEvent) => {
    if (event.reason.isAxiosError) {
      const axiosError = event.reason as AxiosError<string | SqlError>;

      if (axiosError.response) {
        const { data } = axiosError.response;

        if (typeof data === 'string') {
          if (data.includes('permission was denied')) {
            setMessage('Permission denied');
            setIsSnackbarOpened(true);

            return;
          }

          if (data.includes('Violation of PRIMARY KEY constraint')) {
            setMessage('Violation of PRIMARY KEY constraint');
            setIsSnackbarOpened(true);

            return;
          }

          return;
        }

        if (Object.keys(data.errors).length) {
          const [, [firstError]] = Object.entries(data.errors)[0];

          setMessage(firstError);
          setIsSnackbarOpened(true);

          return;
        }
      }

      setMessage('Something went terribly wrong');
      setIsSnackbarOpened(true);
    }
  };

  React.useEffect(() => {
    window.addEventListener('unhandledrejection', handleRejection);
  }, []);

  const handleClose = (_: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsSnackbarOpened(false);
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

      <Fab
        className={classes.schemaFab}
        color="primary"
        variant="extended"
        onClick={() => setIsSchemaOpened(true)}
      >
        <AccountTreeIcon className={classes.extendedIcon} />
        Schema
      </Fab>

      <Drawer
        anchor="left"
        open={isSchemaOpened}
        onClose={() => setIsSchemaOpened(false)}
      >
        <img src={SchemaSrc} />
      </Drawer>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={isSnackbarOpened}
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
