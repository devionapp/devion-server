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
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import * as _ from 'lodash';
import {Project, User} from '../models';
import {ProjectAppRepository, ProjectRepository, UserRepository} from '../repositories';

export class ProjectController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(ProjectRepository)
    public projectRepository: ProjectRepository,
    @repository(ProjectAppRepository)
    public projectAppRepository: ProjectAppRepository,
  ) { }

  @post('/projects')
  @authenticate('jwt')
  @response(200, {
    description: 'Project model instance',
  })
  async create(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
    @requestBody()
    projectData: Project,
  ): Promise<Project> {
    const {id, tenantId} = await this.userRepository.findById(currentUser.id);

    projectData.createdBy = id
    projectData.tenantId = tenantId

    const apps = _.cloneDeep(projectData.apps)
    delete projectData.apps

    const project = await this.projectRepository.create(projectData);

    if (apps?.length) {
      await Promise.all(apps.map(async app => {
        await this.projectRepository.apps(project.id).link(app.id)
      }))
    }

    return project
  }

  @get('/projects/count')
  @authenticate('jwt')
  @response(200, {
    description: 'Project model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Project) where?: Where<Project>,
  ): Promise<Count> {
    return this.projectRepository.count(where);
  }

  @get('/projects')
  @authenticate('jwt')
  @response(200, {
    description: 'Array of Project model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Project, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Project) filter?: Filter<Project>,
  ): Promise<Project[]> {
    return this.projectRepository.find(filter);
  }

  @patch('/projects')
  @authenticate('jwt')
  @response(200, {
    description: 'Project PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {partial: true}),
        },
      },
    })
    project: Project,
    @param.where(Project) where?: Where<Project>,
  ): Promise<Count> {
    return this.projectRepository.updateAll(project, where);
  }

  @get('/projects/{id}')
  @authenticate('jwt')
  @response(200, {
    description: 'Project model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Project, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Project, {exclude: 'where'}) filter?: FilterExcludingWhere<Project>
  ): Promise<Project> {
    const project = await this.projectRepository.findById(id, {
      include: [
        {relation: 'apps'},
        {relation: 'requirements'},
      ],
    });

    project.apps = project.apps ?? []
    project.requirements = project.requirements ?? []

    return Promise.resolve(project)
  }

  @patch('/projects/{id}')
  @authenticate('jwt')
  @response(204, {
    description: 'Project PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {partial: true}),
        },
      },
    })
    project: Project,
  ): Promise<void> {
    await this.projectRepository.updateById(id, project);
  }

  @put('/projects/{id}')
  @authenticate('jwt')
  @response(204, {
    description: 'Project PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() project: Project,
  ): Promise<void> {

    await this.projectAppRepository.deleteAll({projectId: id})

    if (project.apps?.length) {
      await Promise.all(project.apps.map(async app => {
        await this.projectRepository.apps(project.id).link(app.id)
      }))
    }

    await this.projectRepository.requirements(project.id).delete()

    if (project.requirements?.length) {
      await Promise.all(project.requirements.map(async requirement => {
        delete requirement.id
        await this.projectRepository.requirements(project.id).create(requirement)
      }))
    }

    delete project.apps
    delete project.requirements

    await this.projectRepository.replaceById(id, project);
  }

  @del('/projects/{id}')
  @authenticate('jwt')
  @response(204, {
    description: 'Project DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.projectRepository.deleteById(id);
  }
}
