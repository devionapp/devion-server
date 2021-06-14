import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Flow,
  Tenant,
} from '../models';
import {FlowRepository} from '../repositories';

export class FlowTenantController {
  constructor(
    @repository(FlowRepository)
    public flowRepository: FlowRepository,
  ) { }

  @get('/flows/{id}/tenant', {
    responses: {
      '200': {
        description: 'Tenant belonging to Flow',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tenant)},
          },
        },
      },
    },
  })
  async getTenant(
    @param.path.number('id') id: typeof Flow.prototype.id,
  ): Promise<Tenant> {
    return this.flowRepository.tenant(id);
  }
}
