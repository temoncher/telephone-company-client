import * as React from 'react';

import { useQuery } from 'react-query';

import ApiServiceContext from './contexts/api-service.context';

const App: React.FC = () => {
  const apiService = React.useContext(ApiServiceContext);
  const { data } = useQuery('databases', apiService.databaseApi.getDatabases);

  const renderDatabases = () => {
    if (!data) return <></>;

    const databases = data.data;

    return databases.map(({ name }) => <div key={name}>{ name }</div>);
  };

  return (
    <div className="App">
      { data ? renderDatabases() : 'Wait for it...'}
    </div>
  );
};

export default App;
