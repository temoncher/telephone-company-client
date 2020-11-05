import * as React from 'react';

import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListSubheader,
  makeStyles,
  IconButton,
  Box,
  Divider,
} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import {
  Route,
  Redirect,
  Switch,
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router-dom';

import { Role } from '@/enums/role.enum';

import ApiServiceContext from '../../contexts/api-service.context';

import Calls from './Calls';
import DaytimePrices from './DaytimePrices';
import Daytimes from './Daytimes';
import Localities from './Localities';
import Organisations from './Organisations';
import Prices from './Prices';
import Subscribers from './Subscribers';
import TransactionTypes from './TransactionTypes';
import Transactions from './Transactions';

interface MenuItem {
  url: string;
  title: string;
  onlyAdmin?: true;
  component: React.FC;
}

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const Lab: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const [role, setRole] = React.useState(Role.ADMIN);
  const classes = useStyles();
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();

  React.useEffect(() => {
    apiService.setRole(role);
  }, [role]);

  const menuItems: MenuItem[] = [
    {
      title: 'Prices',
      url: `${match.path}/prices`,
      component: Prices,
    },
    {
      title: 'Localities',
      url: `${match.path}/localities`,
      component: Localities,
    },
    {
      title: 'Daytimes',
      url: `${match.path}/daytimes`,
      component: Daytimes,
    },
    {
      title: 'Daytime prices',
      url: `${match.path}/daytimeprices`,
      component: DaytimePrices,
    },
    {
      title: 'Subscribers',
      onlyAdmin: true,
      url: `${match.path}/subscribers`,
      component: Subscribers,
    },
    {
      title: 'Organisations',
      onlyAdmin: true,
      url: `${match.path}/organisations`,
      component: Organisations,
    },
    {
      title: 'Transaction types',
      onlyAdmin: true,
      url: `${match.path}/transactiontypes`,
      component: TransactionTypes,
    },
    {
      title: 'Transactions',
      onlyAdmin: true,
      url: `${match.path}/transactions`,
      component: Transactions,
    },
    {
      title: 'Calls',
      onlyAdmin: true,
      url: `${match.path}/calls`,
      component: Calls,
    },
  ];
  const otherRole = role === Role.ADMIN ? Role.MANAGER : Role.ADMIN;

  return (
    <Box className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <List>
          <ListItem>
            <ListItemText primary={`You are: ${role}`} />
            <ListItemSecondaryAction>
              <IconButton
                color="primary"
                edge="end"
                onClick={() => setRole(otherRole)}
              >
                <CachedIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />
          <ListSubheader>API</ListSubheader>

          {menuItems.map((item) => (
            <ListItem
              button
              selected={location.pathname === item.url}
              key={`menu_${item.title}`}
              onClick={() => history.push(item.url)}
            >
              <ListItemText
                primary={item.title}
                secondary={item.onlyAdmin && 'Admin only'}
              />
            </ListItem>
          ))}

          <Divider />

          <ListItem
            button
            onClick={() => {
              apiService.setRole(Role.SUPER);

              history.push('/');
            }}
          >
            <ListItemText
              primary="Logout"
            />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <Switch>
          <Redirect
            exact
            path={match.path}
            to={`${match.path}/subscribers`}
          />
          {menuItems.map((item) => (
            <Route
              key={`route_${item.title}`}
              path={item.url}
              component={item.component}
            />
          ))}
        </Switch>
      </main>
    </Box>
  );
};

export default Lab;
