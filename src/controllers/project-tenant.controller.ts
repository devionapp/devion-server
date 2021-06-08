import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Project,
  Tenant,
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectTenantController {
  constructor(
    @repository(ProjectRepository)
    public projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{id}/tenant', {
    responses: {
      '200': {
        description: 'Tenant belonging to Project',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tenant)},
          },
        },
      },
    },
  })
  async getTenant(
    @param.path.number('id') id: typeof Project.prototype.id,
  ): Promise<Tenant> {
    return this.projectRepository.tenant(id);
  }
}
