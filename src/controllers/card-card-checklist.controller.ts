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
  CardChecklist
} from '../models';
import {CardRepository} from '../repositories';

export class CardCardChecklistController {
  constructor(
    @repository(CardRepository) protected cardRepository: CardRepository,
  ) { }

  @get('/cards/{id}/card-checklists', {
    responses: {
      '200': {
        description: 'Array of Card has many CardChecklist',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(CardChecklist)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<CardChecklist>,
  ): Promise<CardChecklist[]> {
    return this.cardRepository.cardChecklists(id).find(filter);
  }

  @post('/cards/{id}/card-checklists', {
    responses: {
      '200': {
        description: 'Card model instance',
        content: {'application/json': {schema: getModelSchemaRef(CardChecklist)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Card.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CardChecklist, {
            title: 'NewCardChecklistInCard',
            exclude: ['id'],
            optional: ['cardId']
          }),
        },
      },
    }) cardChecklist: Omit<CardChecklist, 'id'>,
  ): Promise<CardChecklist> {
    return this.cardRepository.cardChecklists(id).create(cardChecklist);
  }

  @patch('/cards/{id}/card-checklists', {
    responses: {
      '200': {
        description: 'Card.CardChecklist PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CardChecklist, {partial: true}),
        },
      },
    })
    cardChecklist: Partial<CardChecklist>,
    @param.query.object('where', getWhereSchemaFor(CardChecklist)) where?: Where<CardChecklist>,
  ): Promise<Count> {
    return this.cardRepository.cardChecklists(id).patch(cardChecklist, where);
  }

  @del('/cards/{id}/card-checklists', {
    responses: {
      '200': {
        description: 'Card.CardChecklist DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(CardChecklist)) where?: Where<CardChecklist>,
  ): Promise<Count> {
    return this.cardRepository.cardChecklists(id).delete(where);
  }
}
