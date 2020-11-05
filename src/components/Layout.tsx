import * as React from 'react';

import {
  Paper,
  Grid,
  IconButton,
  Box,
} from '@material-ui/core';
import { DataGrid, ColDef, RowParams, RowsProp } from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';

import { useGlobalStyles } from '@/styles/global-styles';

import DataGridFab from './DataGridFab';
import SqlCodeBlock from './SqlCodeBlock';

interface LayoutProps {
  cols?: ColDef[];
  rows?: RowsProp;
  viewSql?: string;
  onRowClick?: (param: RowParams) => void;
}

const Layout: React.FC<LayoutProps> = ({
  rows = [],
  cols = [],
  viewSql,
  onRowClick,
  children,
}) => {
  const [isViewCodeShown, setIsViewCodeShown] = React.useState(false);
  const globalClasses = useGlobalStyles();

  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        item
        xs={8}
      >
        <Paper className={globalClasses.dataGrid}>
          {rows && (
            <DataGrid
              columns={cols}
              rows={rows}
              onRowClick={onRowClick}
            />
          )}

          {viewSql && <DataGridFab onClick={() => setIsViewCodeShown(!isViewCodeShown)} />}
        </Paper>
      </Grid>
      <Grid
        item
        xs={4}
      >
        <Paper className={globalClasses.editor}>
          { viewSql && isViewCodeShown
            ? (
              <>
                <Box className={globalClasses.editorHeader}>
                  <Box>View code</Box>
                  <IconButton
                    size="small"
                    onClick={() => setIsViewCodeShown(false)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
                <SqlCodeBlock text={viewSql} />
              </>
            ) : children }
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Layout;
