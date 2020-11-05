import { makeStyles, Theme } from '@material-ui/core';

export const useGlobalStyles = makeStyles((theme: Theme) => ({
  dataGrid: {
    width: '100%',
    height: '100%',
  },
  editor: {
    width: '100%',
    fontSize: '0.875rem',
    fontWeight: 400,
    borderRadius: 4,
    border: '1px solid rgba(224, 224, 224, 1)',
    '& > *': {
      padding: theme.spacing(2),
    },
  },
  editorHeader: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    padding: theme.spacing(2),
    height: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
  },
  editorForm: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
