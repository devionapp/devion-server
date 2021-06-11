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
  App, Project
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectAppController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{id}/apps', {
    responses: {
      '200': {
        description: 'Array of Project has many App through ProjectApp',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(App)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<App>,
  ): Promise<App[]> {
    return this.projectRepository.apps(id).find(filter);
  }

  @post('/projects/{id}/apps', {
    responses: {
      '200': {
        description: 'create a App model instance',
        content: {'application/json': {schema: getModelSchemaRef(App)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Project.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(App, {
            title: 'NewAppInProject',
            exclude: ['id'],
          }),
        },
      },
    }) app: Omit<App, 'id'>,
  ): Promise<App> {
    return this.projectRepository.apps(id).create(app);
  }

  @patch('/projects/{id}/apps', {
    responses: {
      '200': {
        description: 'Project.App PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(App, {partial: true}),
        },
      },
    })
    app: Partial<App>,
    @param.query.object('where', getWhereSchemaFor(App)) where?: Where<App>,
  ): Promise<Count> {
    return this.projectRepository.apps(id).patch(app, where);
  }

  @del('/projects/{id}/apps', {
    responses: {
      '200': {
        description: 'Project.App DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(App)) where?: Where<App>,
  ): Promise<Count> {
    return this.projectRepository.apps(id).delete(where);
  }
}
