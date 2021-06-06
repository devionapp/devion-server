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
  Flow,
} from '../models';
import {RequirementRepository} from '../repositories';

export class RequirementFlowController {
  constructor(
    @repository(RequirementRepository)
    public requirementRepository: RequirementRepository,
  ) { }

  @get('/requirements/{id}/flow', {
    responses: {
      '200': {
        description: 'Flow belonging to Requirement',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Flow)},
          },
        },
      },
    },
  })
  async getFlow(
    @param.path.number('id') id: typeof Requirement.prototype.id,
  ): Promise<Flow> {
    return this.requirementRepository.flow(id);
  }
}
