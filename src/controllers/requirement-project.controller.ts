import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Requirement,
  Project,
} from '../models';
import {RequirementRepository} from '../repositories';

export class RequirementProjectController {
  constructor(
    @repository(RequirementRepository)
    public requirementRepository: RequirementRepository,
  ) { }

  @get('/requirements/{id}/project', {
    responses: {
      '200': {
        description: 'Project belonging to Requirement',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async getProject(
    @param.path.number('id') id: typeof Requirement.prototype.id,
  ): Promise<Project> {
    return this.requirementRepository.project(id);
  }
}
