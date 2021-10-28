/* eslint-disable @typescript-eslint/no-explicit-any */
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Card,
  CardTimeLog,
  User
} from '../models';
import {CardRepository, CardTimeLogRepository, UserRepository} from '../repositories';

export class CardCardTimeLogController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(CardRepository) protected cardRepository: CardRepository,
    @repository(CardTimeLogRepository) protected cardTimeLogRepository: CardTimeLogRepository,
  ) { }

  @get('/cards/{id}/card-time-logs', {
    responses: {
      '200': {
        description: 'Array of Card has many CardTimeLog',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(CardTimeLog)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<CardTimeLog>,
  ): Promise<CardTimeLog[]> {
    return this.cardRepository.cardTimeLogs(id).find({
      where: filter,
      include: [
        {
          relation: 'user',
        },
      ]
    });
  }

  @post('/cards/{id}/card-time-logs', {
    responses: {
      '200': {
        description: 'Card model instance',
        content: {'application/json': {schema: getModelSchemaRef(CardTimeLog)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
    @param.path.number('id') id: typeof Card.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CardTimeLog, {
            title: 'NewCardTimeLogInCard',
            exclude: ['id'],
            optional: ['cardId']
          }),
        },
      },
    }) cardTimeLog: Omit<CardTimeLog, 'id'>,
  ): Promise<CardTimeLog> {
    cardTimeLog.userId = currentUser.id
    cardTimeLog.type = 'Manual'
    cardTimeLog.hours = parseInt(cardTimeLog.hours)
    cardTimeLog.minutes = parseInt(cardTimeLog.minutes)

    const {id: cardTimeLogId} = await this.cardRepository.cardTimeLogs(id).create(cardTimeLog);

    const card = await this.cardRepository.findById(id)
    const cardTimeLogs = (await this.cardRepository.cardTimeLogs(id).find({where: {cardId: id}}))

    card.performed = cardTimeLogs.reduce((total, i) => {
      const hours = i?.hours ?? 0
      const minutes = (i?.minutes ?? 0) / 60;
      const hoursMinutes = hours + minutes
      return total + hoursMinutes
    }, 0)

    await this.cardRepository.updateById(id, card);

    return this.cardTimeLogRepository.findById(cardTimeLogId, {
      include: [
        {
          relation: 'user',
        },
      ]
    })
  }

  @patch('/cards/{id}/card-time-logs', {
    responses: {
      '200': {
        description: 'Card.CardTimeLog PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CardTimeLog, {partial: true}),
        },
      },
    })
    cardTimeLog: Partial<CardTimeLog>,
    @param.query.object('where', getWhereSchemaFor(CardTimeLog)) where?: Where<CardTimeLog>,
  ): Promise<Count> {
    return this.cardRepository.cardTimeLogs(id).patch(cardTimeLog, where);
  }

  @del('/cards/{id}/card-time-logs/{logId}', {
    responses: {
      '200': {
        description: 'Card.CardTimeLog DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.path.number('logId') logId: number,
    @param.query.object('where', getWhereSchemaFor(CardTimeLog)) where?: Where<CardTimeLog>,
  ): Promise<Count> {
    const count = this.cardRepository.cardTimeLogs(id).delete({where: {id: logId}});

    const card = await this.cardRepository.findById(id)
    const cardTimeLogs = (await this.cardRepository.cardTimeLogs(id).find({where: {cardId: id}}))

    card.performed = cardTimeLogs.reduce((total, i) => {
      const hours = i?.hours ?? 0
      const minutes = (i?.minutes ?? 0) / 60;
      const hoursMinutes = hours + minutes
      return total + hoursMinutes
    }, 0)

    await this.cardRepository.updateById(id, card);

    return count
  }
}
