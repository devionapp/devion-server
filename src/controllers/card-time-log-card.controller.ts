import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  CardTimeLog,
  Card,
} from '../models';
import {CardTimeLogRepository} from '../repositories';

export class CardTimeLogCardController {
  constructor(
    @repository(CardTimeLogRepository)
    public cardTimeLogRepository: CardTimeLogRepository,
  ) { }

  @get('/card-time-logs/{id}/card', {
    responses: {
      '200': {
        description: 'Card belonging to CardTimeLog',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Card)},
          },
        },
      },
    },
  })
  async getCard(
    @param.path.number('id') id: typeof CardTimeLog.prototype.id,
  ): Promise<Card> {
    return this.cardTimeLogRepository.card(id);
  }
}
