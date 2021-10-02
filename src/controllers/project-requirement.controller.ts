import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Project,
  Requirement
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectRequirementController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{id}/requirements', {
    responses: {
      '200': {
        description: 'Array of Project has many Requirement',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Requirement)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Requirement>,
  ): Promise<Requirement[]> {
    return this.projectRepository.requirements(id).find(filter);
  }

  @post('/projects/{id}/requirements', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(Requirement)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Project.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Requirement, {
            title: 'NewRequirementInProject',
            exclude: ['id'],
            optional: ['projectId']
          }),
        },
      },
    }) requirement: Omit<Requirement, 'id'>,
  ): Promise<Requirement> {
    delete requirement.fields
    delete requirement.businessRules
    return this.projectRepository.requirements(id).create(requirement);
  }

  @patch('/projects/{id}/requirements/{idRequirement}', {
    responses: {
      '200': {
        description: 'Project.Requirement PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @param.path.number('idRequirement') idRequirement: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Requirement, {partial: true}),
        },
      },
    })
    requirement: Partial<Requirement>,
    @param.query.object('where', getWhereSchemaFor(Requirement)) where?: Where<Requirement>,
  ): Promise<Count> {
    delete requirement.fields
    delete requirement.businessRules
    return this.projectRepository.requirements(id).patch(requirement, {id: idRequirement});
  }

  @del('/projects/{id}/requirements/{idRequirement}', {
    responses: {
      '200': {
        description: 'Project.Requirement DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.path.number('idRequirement') idRequirement: number,
    @param.query.object('where', getWhereSchemaFor(Requirement)) where?: Where<Requirement>,
  ): Promise<Count> {
    return this.projectRepository.requirements(id).delete({id: idRequirement});
  }
}
