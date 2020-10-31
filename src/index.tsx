import React from 'react';

import ReactDOM from 'react-dom';

import App from './App';
import ApiServiceContext from './contexts/api-service.context';
import { ApiService } from './services/api.service';

const ROOT = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <ApiServiceContext.Provider value={new ApiService()}>
      <App />
    </ApiServiceContext.Provider>
  </React.StrictMode>,
  ROOT,
);
