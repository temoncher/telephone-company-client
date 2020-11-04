import * as React from 'react';

import {
  Grid,
  Button,
  Typography,
  makeStyles,
  createStyles,
} from '@material-ui/core';

import SchemaSrc from '../assets/DBSchema.png';

const useStyles = makeStyles(() =>
  createStyles({
    schema: {
      width: '100%',
      maxHeight: '50vh',
    },
  }),
);

interface ShecmaProps {
  errored: boolean | null;
  onNext: <T>(callback?: () => Promise<T>) => void;
}

const SchemaStep: React.FC<ShecmaProps> = ({ errored, onNext }) => {
  const classes = useStyles();

  return (
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
          color={ errored ? 'secondary' : 'primary'}
          onClick={() => onNext()}
        >
          Next
        </Button>
      </Grid>
    </Grid>
  );
};

export default SchemaStep;
