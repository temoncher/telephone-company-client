import * as React from 'react';

import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  makeStyles,
  IconButton,
  Divider,
} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import {
  Route,
  Redirect,
  Switch,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';

import { Role } from '@/enums/role.enum';

import ApiServiceContext from '../../contexts/api-service.context';

import Prices from './Prices';
import Subscribers from './Subscribers';

interface MenuItem {
  path: string;
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
  const history = useHistory();

  React.useEffect(() => {
    apiService.setRole(role);
  }, [role]);

  const menuItems: MenuItem[] = [
    {
      title: 'Prices',
      path: `${match.path}/prices`,
      component: Prices,
    },
    {
      title: 'Subscribers',
      onlyAdmin: true,
      path: `${match.path}/subscribers`,
      component: Subscribers,
    },
  ];
  const otherRole = role === Role.ADMIN ? Role.MANAGER : Role.ADMIN;

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <List>
          <ListItem button >
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
          {menuItems.map((item) => (
            <ListItem
              button
              key={`menu_${item.title}`}
              onClick={() => history.push(item.path)}
            >
              <ListItemText
                primary={item.title}
                secondary={item.onlyAdmin && 'Admin only'}
              />
            </ListItem>
          ))}
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
              path={item.path}
              component={item.component}
            />
          ))}
        </Switch>
      </main>
    </div>
  );
};

export default Lab;
