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
  Card, Flow
} from '../models';
import {FlowRepository} from '../repositories';

export class FlowCardController {
  constructor(
    @repository(FlowRepository) protected flowRepository: FlowRepository,
  ) { }

  @get('/flows/{id}/cards', {
    responses: {
      '200': {
        description: 'Array of Flow has many Card',
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
    return this.flowRepository.cards(id).find({
      where: filter?.where,
      include: [
        {
          relation: 'step',
        },
        {
          relation: 'project',
        },
      ],
    });
  }

  @post('/flows/{id}/cards', {
    responses: {
      '200': {
        description: 'Flow model instance',
        content: {'application/json': {schema: getModelSchemaRef(Card)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Flow.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Card, {
            title: 'NewCardInFlow',
            exclude: ['id'],
            optional: ['flowId']
          }),
        },
      },
    }) card: Omit<Card, 'id'>,
  ): Promise<Card> {
    return this.flowRepository.cards(id).create(card);
  }

  @patch('/flows/{id}/cards', {
    responses: {
      '200': {
        description: 'Flow.Card PATCH success count',
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
    return this.flowRepository.cards(id).patch(card, where);
  }

  @del('/flows/{id}/cards', {
    responses: {
      '200': {
        description: 'Flow.Card DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Card)) where?: Where<Card>,
  ): Promise<Count> {
    return this.flowRepository.cards(id).delete(where);
  }
}
