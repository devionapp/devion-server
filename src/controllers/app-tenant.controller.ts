import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  App,
  Tenant,
} from '../models';
import {AppRepository} from '../repositories';

export class AppTenantController {
  constructor(
    @repository(AppRepository)
    public appRepository: AppRepository,
  ) { }

  @get('/apps/{id}/tenant', {
    responses: {
      '200': {
        description: 'Tenant belonging to App',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tenant)},
          },
        },
      },
    },
  })
  async getTenant(
    @param.path.number('id') id: typeof App.prototype.id,
  ): Promise<Tenant> {
    return this.appRepository.tenant(id);
  }
}
