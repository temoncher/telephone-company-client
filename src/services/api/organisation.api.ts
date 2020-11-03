import { IOrganisation } from '@/interfaces/organisation.interface';

import { ApiBase } from './api-base';

const ORGANISATIONS_API_ROOT = 'organisations';

export class OrganisationApi extends ApiBase {
  getAllOrganisations = () => this.apiService.sendRequest<IOrganisation[]>({
    method: 'GET',
    url: `${ORGANISATIONS_API_ROOT}`,
  });

  createOrganisation = (organisation: Omit<IOrganisation, 'organisation_id'>) => this.apiService.sendRequest<number>({
    method: 'POST',
    url: `${ORGANISATIONS_API_ROOT}`,
    data: organisation,
  });

  updateOrganisation = (
    organisationId: number,
    organisation: Omit<IOrganisation, 'organisation_id'>,
  ) => this.apiService.sendRequest<number>({
    method: 'PUT',
    url: `${ORGANISATIONS_API_ROOT}/${organisationId}`,
    data: organisation,
  });

  deleteOrganisation = (organisationId: number) => this.apiService.sendRequest<number>({
    method: 'DELETE',
    url: `${ORGANISATIONS_API_ROOT}/${organisationId}`,
  });
}
