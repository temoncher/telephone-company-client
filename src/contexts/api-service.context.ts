import * as React from 'react';

import { ApiService } from '../services/api.service';

const ApiServiceContext = React.createContext(new ApiService());

export default ApiServiceContext;
