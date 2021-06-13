import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {App, User} from '../models';
import {AppRepository, UserRepository} from '../repositories';

export class AppController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(AppRepository)
    public appRepository: AppRepository,
  ) { }

  @post('/apps')
  @authenticate('jwt')
  @response(200, {
    description: 'App model instance',
    content: {'application/json': {schema: getModelSchemaRef(App)}},
  })
  async create(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(App, {
            title: 'NewApp',
            exclude: ['id'],
          }),
        },
      },
    })
    app: Omit<App, 'id'>,
  ): Promise<App> {
    const {tenantId} = await this.userRepository.findById(currentUser.id);
    app.tenantId = tenantId
    return this.appRepository.create(app);
  }

  @get('/apps/count')
  @authenticate('jwt')
  @response(200, {
    description: 'App model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(App) where?: Where<App>,
  ): Promise<Count> {
    return this.appRepository.count(where);
  }

  @get('/apps')
  @authenticate('jwt')
  @response(200, {
    description: 'Array of App model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(App, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
    @param.filter(App) filter?: Filter<App>,
  ): Promise<App[]> {
    const {tenantId} = await this.userRepository.findById(currentUser.id);
    return this.appRepository.find({
      where: {
        tenantId: tenantId,
      },
    });
  }

  @patch('/apps')
  @authenticate('jwt')
  @response(200, {
    description: 'App PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(App, {partial: true}),
        },
      },
    })
    app: App,
    @param.where(App) where?: Where<App>,
  ): Promise<Count> {
    return this.appRepository.updateAll(app, where);
  }

  @get('/apps/{id}')
  @response(200, {
    description: 'App model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(App, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(App, {exclude: 'where'}) filter?: FilterExcludingWhere<App>
  ): Promise<App> {
    return this.appRepository.findById(id, filter);
  }

  @patch('/apps/{id}')
  @response(204, {
    description: 'App PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(App, {partial: true}),
        },
      },
    })
    app: App,
  ): Promise<void> {
    await this.appRepository.updateById(id, app);
  }

  @put('/apps/{id}')
  @response(204, {
    description: 'App PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() app: App,
  ): Promise<void> {
    await this.appRepository.replaceById(id, app);
  }

  @del('/apps/{id}')
  @response(204, {
    description: 'App DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.appRepository.deleteById(id);
  }
}
