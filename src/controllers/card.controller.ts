/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Card} from '../models';
import {CardRepository, StepRepository} from '../repositories';

export class CardController {
  constructor(
    @repository(CardRepository)
    public cardRepository: CardRepository,
    @repository(StepRepository)
    public stepRepository: StepRepository,
  ) { }

  @post('/cards')
  @response(200, {
    description: 'Card model instance',
    content: {'application/json': {schema: getModelSchemaRef(Card)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Card, {
            title: 'NewCard',

          }),
        },
      },
    })
    card: Card,
  ): Promise<Card> {
    const step = await this.stepRepository.findOne({where: {flowId: card.flowId, index: 1}})

    if (step) {
      card.stepId = step.id ?? 0
    }

    delete card.project
    delete card.flow
    delete card.step

    return this.cardRepository.create(card);
  }

  @get('/cards/count')
  @response(200, {
    description: 'Card model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Card) where?: Where<Card>,
  ): Promise<Count> {
    return this.cardRepository.count(where);
  }

  @get('/cards')
  @response(200, {
    description: 'Array of Card model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Card, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Card) filter?: Filter<Card>,
  ): Promise<Card[]> {
    return this.cardRepository.find({
      where: filter,
      include: [
        {
          relation: 'step',
        },
        {
          relation: 'project',
        },
        {
          relation: 'flow',
        },
      ],
    });
  }

  @patch('/cards')
  @response(200, {
    description: 'Card PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Card, {partial: true}),
        },
      },
    })
    card: Card,
    @param.where(Card) where?: Where<Card>,
  ): Promise<Count> {
    return this.cardRepository.updateAll(card, where);
  }

  @get('/cards/{id}')
  @response(200, {
    description: 'Card model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Card, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Card, {exclude: 'where'}) filter?: FilterExcludingWhere<Card>
  ): Promise<Card> {
    return this.cardRepository.findById(id, {
      include: [
        {
          relation: 'step',
        },
        {
          relation: 'project',
        },
        {
          relation: 'flow',
        },
      ],
    });
  }

  @patch('/cards/{id}')
  @response(204, {
    description: 'Card PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Card, {partial: true}),
        },
      },
    })
    card: Card,
  ): Promise<void> {
    delete card.project
    delete card.flow
    delete card.step
    await this.cardRepository.updateById(id, card);
  }

  @put('/cards/{id}')
  @response(204, {
    description: 'Card PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() card: Card,
  ): Promise<void> {
    delete card.project
    delete card.flow
    delete card.step
    await this.cardRepository.replaceById(id, card);
  }

  @del('/cards/{id}')
  @response(204, {
    description: 'Card DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.cardRepository.deleteById(id);
  }
}
