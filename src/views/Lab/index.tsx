import * as React from 'react';

import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import {
  Route,
  Redirect,
  Switch,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';

import Prices from './Prices';
import Subscribers from './Subscribers';

interface MenuItem {
  path: string;
  title: string;
  component: any;
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
  },
}));

const Lab: React.FC = () => {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const menuItems: MenuItem[] = [
    {
      title: 'Subscribers',
      path: `${match.path}/subscribers`,
      component: Subscribers,
    },
    {
      title: 'Prices',
      path: `${match.path}/prices`,
      component: Prices,
    },
  ];

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
          {menuItems.map((item) => (
            <ListItem
              button
              key={`menu_${item.title}`}
              onClick={() => history.push(item.path)}
            >
              <ListItemText primary={item.title} />
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
