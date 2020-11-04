import * as React from 'react';

import { Fab, makeStyles, createStyles, Theme, Typography } from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';

interface DataGridFabProps {
  Icon?: React.FC<{ className?: string }>;
  text?: string;
  onClick: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: 101,
      position: 'absolute',
      right: 0,
      top: 0,
      margin: 12,
      boxShadow: 'none',
    },
    text: {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
      fontSize: '0.8rem',
    },
  }),
);

const DataGridFab: React.FC<DataGridFabProps> = ({
  Icon = CodeIcon,
  text = 'View code',
  onClick,
}) => {
  const classes = useStyles();

  return (
    <Fab
      className={classes.root}
      color="primary"
      size="small"
      variant={text ? 'extended' : 'round'}
      onClick={onClick}
    >
      <Icon />
      {text && (
        <Typography className={classes.text}>{text}</Typography>
      )}
    </Fab>
  );
};

export default DataGridFab;
