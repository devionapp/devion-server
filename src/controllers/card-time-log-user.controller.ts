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
  User,
} from '../models';
import {CardTimeLogRepository} from '../repositories';

export class CardTimeLogUserController {
  constructor(
    @repository(CardTimeLogRepository)
    public cardTimeLogRepository: CardTimeLogRepository,
  ) { }

  @get('/card-time-logs/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to CardTimeLog',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof CardTimeLog.prototype.id,
  ): Promise<User> {
    return this.cardTimeLogRepository.user(id);
  }
}
