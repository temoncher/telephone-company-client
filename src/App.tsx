import * as React from 'react';

import { Container } from '@material-ui/core';
import { BrowserRouter, Route } from 'react-router-dom';

import Database from './views/Database';
import Lab from './views/Lab';

const App: React.FC = () => (
  <Container fixed>
    <BrowserRouter>
      <Route
        exact
        path="/"
        component={Database}
      />
      <Route
        path="/lab"
        component={Lab}
      />
    </BrowserRouter>
  </Container>
);

export default App;
