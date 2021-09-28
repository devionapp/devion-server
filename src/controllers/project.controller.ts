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
    projectData: Project,
  ): Promise<Project> {
    const {id, tenantId} = await this.userRepository.findById(currentUser.id);

    projectData.createdBy = id
    projectData.tenantId = tenantId

    const apps = _.cloneDeep(projectData.apps)
    const requirements = _.cloneDeep(projectData.requirements)

    delete projectData.apps

    const project = await this.projectRepository.create(projectData);

    if (apps?.length) {
      await Promise.all(apps.map(async app => {
        await this.projectRepository.apps(project.id).link(app.id)
      }))
    }

    if (requirements?.length) {
      await Promise.all(requirements.map(async requirement => {
        const fields = requirement.fields
        const businessRules = requirement.businessRules

        delete requirement.id
        delete requirement.fields
        delete requirement.businessRules

        const {id: requirementId} = await this.projectRepository.requirements(project.id).create(requirement)

        if (fields?.length) {
          await Promise.all(fields?.map(async field => {
            await this.requirementRepository.fields(requirementId).create(field)
          }))
        }

        if (businessRules?.length) {
          await Promise.all(businessRules?.map(async rule => {
            delete rule.index
            await this.requirementRepository.businessRules(requirementId).create(rule)
          }))
        }
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
      await this.projectRepository.requirements(id).delete({
        id: {nin: project.requirements?.map(req => req.id)}
      })
      const teste = project.requirements?.flatMap(requirement => requirement.fields?.filter(field => !!field.id).map(field => field.id))
      console.log(teste)

      project.requirements?.map(async requirement => {
        //Fields
        await this.requirementRepository.fields(requirement.id).delete({
          id: {nin: project.requirements?.flatMap(req => req.fields?.filter(field => !!field.id).map(field => field.id))}
        })

        requirement.fields?.map(field => {
          if (field.id) {
            return this.requirementRepository.fields(requirement.id).patch(field, {id: field.id})
          }
          return this.requirementRepository.fields(requirement.id).create(field)
        })

        delete requirement.fields
        delete requirement.businessRules

        if (requirement.id) {
          return this.projectRepository.requirements(id).patch(requirement, {id: requirement.id})
        }
        return this.projectRepository.requirements(id).create(requirement)
      })


      //   //BusinessRules
      //   await this.requirementRepository.businessRules(requirement.id).delete({
      //     requirementId: {eq: requirement.id},
      //     id: {nin: requirement.businessRules?.map(businessRule => businessRule.id)},
      //   })

      //   requirement.businessRules?.map(businessRule => {
      //     delete businessRule.index
      //     if (businessRule.id) {
      //       return this.requirementRepository.businessRules(requirement.id).patch(businessRule, {id: businessRule.id})
      //     }

      //     return this.requirementRepository.businessRules(requirement.id).create(businessRule)
      //   })

      //   delete requirement.businessRules

      //   if (requirement.id) {
      //     return this.projectRepository.requirements(id).patch(requirement, {id: requirement.id})
      //   }

      //   return this.projectRepository.requirements(id).create(requirement)
      // })

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
