import * as React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Database from './views/Database';
import Lab from './views/Lab/index';

const App: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route
        exact
        path="/"
        component={Database}
      />
      <Route
        path="/lab"
        component={Lab}
      />
    </Switch>
  </BrowserRouter>
);

export default App;
