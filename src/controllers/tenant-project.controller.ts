import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Tenant,
  Project,
} from '../models';
import {TenantRepository} from '../repositories';

export class TenantProjectController {
  constructor(
    @repository(TenantRepository) protected tenantRepository: TenantRepository,
  ) { }

  @get('/tenants/{id}/projects', {
    responses: {
      '200': {
        description: 'Array of Tenant has many Project',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Project>,
  ): Promise<Project[]> {
    return this.tenantRepository.projects(id).find(filter);
  }

  @post('/tenants/{id}/projects', {
    responses: {
      '200': {
        description: 'Tenant model instance',
        content: {'application/json': {schema: getModelSchemaRef(Project)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Tenant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {
            title: 'NewProjectInTenant',
            exclude: ['id'],
            optional: ['tenantId']
          }),
        },
      },
    }) project: Omit<Project, 'id'>,
  ): Promise<Project> {
    return this.tenantRepository.projects(id).create(project);
  }

  @patch('/tenants/{id}/projects', {
    responses: {
      '200': {
        description: 'Tenant.Project PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {partial: true}),
        },
      },
    })
    project: Partial<Project>,
    @param.query.object('where', getWhereSchemaFor(Project)) where?: Where<Project>,
  ): Promise<Count> {
    return this.tenantRepository.projects(id).patch(project, where);
  }

  @del('/tenants/{id}/projects', {
    responses: {
      '200': {
        description: 'Tenant.Project DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Project)) where?: Where<Project>,
  ): Promise<Count> {
    return this.tenantRepository.projects(id).delete(where);
  }
}
