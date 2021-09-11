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
  Requirement,
} from '../models';
import {CardRepository} from '../repositories';

export class CardRequirementController {
  constructor(
    @repository(CardRepository)
    public cardRepository: CardRepository,
  ) { }

  @get('/cards/{id}/requirement', {
    responses: {
      '200': {
        description: 'Requirement belonging to Card',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Requirement)},
          },
        },
      },
    },
  })
  async getRequirement(
    @param.path.number('id') id: typeof Card.prototype.id,
  ): Promise<Requirement> {
    return this.cardRepository.requirement(id);
  }
}
