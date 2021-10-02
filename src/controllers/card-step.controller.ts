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
  Step,
} from '../models';
import {CardRepository} from '../repositories';

export class CardStepController {
  constructor(
    @repository(CardRepository)
    public cardRepository: CardRepository,
  ) { }

  @get('/cards/{id}/step', {
    responses: {
      '200': {
        description: 'Step belonging to Card',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Step)},
          },
        },
      },
    },
  })
  async getStep(
    @param.path.number('id') id: typeof Card.prototype.id,
  ): Promise<Step> {
    return this.cardRepository.step(id);
  }
}
