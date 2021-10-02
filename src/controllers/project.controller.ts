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
import {Project, User} from '../models';
import {ProjectAppRepository, ProjectRepository, RequirementRepository, UserRepository} from '../repositories';
export class ProjectController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(ProjectRepository)
    public projectRepository: ProjectRepository,
    @repository(ProjectAppRepository)
    public projectAppRepository: ProjectAppRepository,
    @repository(RequirementRepository)
    public requirementRepository: RequirementRepository,
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
    project: Project,
  ): Promise<Project> {
    const {id, tenantId} = await this.userRepository.findById(currentUser.id);

    project.createdBy = id
    project.tenantId = tenantId

    delete project.requirements
    delete project.apps

    return this.projectRepository.create(project);

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
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
    @param.filter(Project) filter?: Filter<Project>,
  ): Promise<Project[]> {
    const {tenantId} = await this.userRepository.findById(currentUser.id);
    return this.projectRepository.find({
      where: {
        tenantId: tenantId,
      },
    });
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
        {
          relation: 'requirements',
          scope: {
            include: ['fields', 'businessRules'],
          },
        },
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
    try {
      delete project.requirements
      delete project.apps

      await this.projectRepository.replaceById(id, project);
    } catch (error) {
      console.error(error)
    }
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
