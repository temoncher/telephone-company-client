import * as React from 'react';

import {
  Typography,
  Box,
} from '@material-ui/core';
import { ColDef } from '@material-ui/data-grid';
import accountsTableSql from '@sql/Views/AccountsGlobalView.sql';
import { useQuery } from 'react-query';

import Layout from '@/components/Layout';
import { useGlobalStyles } from '@/styles/global-styles';
import { createColumns } from '@/utlis/create-columns';

import ApiServiceContext from '../../contexts/api-service.context';

const Accounts: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const { data: accountsTableData } = useQuery('accounts', apiService.accountApi.getAccountsTable);
  const globalClasses = useGlobalStyles();

  const accounts = accountsTableData?.data;
  const columns: ColDef[] = createColumns(accounts ? accounts[0] : {});
  const rows = accounts?.map((call, index) => ({ id: index, ...call }));

  return (
    <Layout
      cols={columns}
      rows={rows}
      viewSql={accountsTableSql}
    >
      <Box className={globalClasses.editorForm}>
        <Typography variant="body1">
          Accounts table is read only
        </Typography>
        <Typography variant="body1">
          Account is automatically created after subscriber insertion
        </Typography>
      </Box>
    </Layout>
  );
};

export default Accounts;
