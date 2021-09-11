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
  User,
} from '../models';
import {CardRepository} from '../repositories';

export class CardUserController {
  constructor(
    @repository(CardRepository)
    public cardRepository: CardRepository,
  ) { }

  @get('/cards/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Card',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Card.prototype.id,
  ): Promise<User> {
    return this.cardRepository.user(id);
  }
}
