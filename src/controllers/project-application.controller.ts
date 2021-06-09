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
  Application, Project
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectApplicationController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{id}/applications', {
    responses: {
      '200': {
        description: 'Array of Project has many Application through ProjectApplication',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Application)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Application>,
  ): Promise<Application[]> {
    return this.projectRepository.applications(id).find(filter);
  }

  @post('/projects/{id}/applications', {
    responses: {
      '200': {
        description: 'create a Application model instance',
        content: {'application/json': {schema: getModelSchemaRef(Application)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Project.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Application, {
            title: 'NewApplicationInProject',
            exclude: ['id'],
          }),
        },
      },
    }) application: Omit<Application, 'id'>,
  ): Promise<Application> {
    return this.projectRepository.applications(id).create(application);
  }

  @patch('/projects/{id}/applications', {
    responses: {
      '200': {
        description: 'Project.Application PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Application, {partial: true}),
        },
      },
    })
    application: Partial<Application>,
    @param.query.object('where', getWhereSchemaFor(Application)) where?: Where<Application>,
  ): Promise<Count> {
    return this.projectRepository.applications(id).patch(application, where);
  }

  @del('/projects/{id}/applications', {
    responses: {
      '200': {
        description: 'Project.Application DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Application)) where?: Where<Application>,
  ): Promise<Count> {
    return this.projectRepository.applications(id).delete(where);
  }
}
