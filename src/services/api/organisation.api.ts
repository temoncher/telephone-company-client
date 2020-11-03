import { IOrganisation } from '@/interfaces/organisation.interface';

import { ApiBase } from './api-base';

const ORGANISATIONS_API_ROOT = 'organisations';

export class OrganisationApi extends ApiBase {
  getAllOrganisations = () => this.apiService.sendRequest<IOrganisation[]>({
    method: 'GET',
    url: `${ORGANISATIONS_API_ROOT}`,
  })
}
