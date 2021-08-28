import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Step,
  Card,
} from '../models';
import {StepRepository} from '../repositories';

export class StepCardController {
  constructor(
    @repository(StepRepository) protected stepRepository: StepRepository,
  ) { }

  @get('/steps/{id}/cards', {
    responses: {
      '200': {
        description: 'Array of Step has many Card',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Card)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Card>,
  ): Promise<Card[]> {
    return this.stepRepository.cards(id).find(filter);
  }

  @post('/steps/{id}/cards', {
    responses: {
      '200': {
        description: 'Step model instance',
        content: {'application/json': {schema: getModelSchemaRef(Card)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Step.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Card, {
            title: 'NewCardInStep',
            exclude: ['id'],
            optional: ['stepId']
          }),
        },
      },
    }) card: Omit<Card, 'id'>,
  ): Promise<Card> {
    return this.stepRepository.cards(id).create(card);
  }

  @patch('/steps/{id}/cards', {
    responses: {
      '200': {
        description: 'Step.Card PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Card, {partial: true}),
        },
      },
    })
    card: Partial<Card>,
    @param.query.object('where', getWhereSchemaFor(Card)) where?: Where<Card>,
  ): Promise<Count> {
    return this.stepRepository.cards(id).patch(card, where);
  }

  @del('/steps/{id}/cards', {
    responses: {
      '200': {
        description: 'Step.Card DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Card)) where?: Where<Card>,
  ): Promise<Count> {
    return this.stepRepository.cards(id).delete(where);
  }
}
