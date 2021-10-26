import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Card,
  Flow,
} from '../models';
import {CardRepository} from '../repositories';

export class CardFlowController {
  constructor(
    @repository(CardRepository)
    public cardRepository: CardRepository,
  ) { }

  @get('/cards/{id}/flow', {
    responses: {
      '200': {
        description: 'Flow belonging to Card',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Flow)},
          },
        },
      },
    },
  })
  async getFlow(
    @param.path.number('id') id: typeof Card.prototype.id,
  ): Promise<Flow> {
    return this.cardRepository.flow(id);
  }
}
