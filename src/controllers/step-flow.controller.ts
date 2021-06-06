import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Step,
  Flow,
} from '../models';
import {StepRepository} from '../repositories';

export class StepFlowController {
  constructor(
    @repository(StepRepository)
    public stepRepository: StepRepository,
  ) { }

  @get('/steps/{id}/flow', {
    responses: {
      '200': {
        description: 'Flow belonging to Step',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Flow)},
          },
        },
      },
    },
  })
  async getFlow(
    @param.path.number('id') id: typeof Step.prototype.id,
  ): Promise<Flow> {
    return this.stepRepository.flow(id);
  }
}
