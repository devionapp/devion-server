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
  Project,
  Card,
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectCardController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{id}/cards', {
    responses: {
      '200': {
        description: 'Array of Project has many Card',
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
    return this.projectRepository.cards(id).find(filter);
  }

  @post('/projects/{id}/cards', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(Card)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Project.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Card, {
            title: 'NewCardInProject',
            exclude: ['id'],
            optional: ['projectId']
          }),
        },
      },
    }) card: Omit<Card, 'id'>,
  ): Promise<Card> {
    return this.projectRepository.cards(id).create(card);
  }

  @patch('/projects/{id}/cards', {
    responses: {
      '200': {
        description: 'Project.Card PATCH success count',
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
    return this.projectRepository.cards(id).patch(card, where);
  }

  @del('/projects/{id}/cards', {
    responses: {
      '200': {
        description: 'Project.Card DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Card)) where?: Where<Card>,
  ): Promise<Count> {
    return this.projectRepository.cards(id).delete(where);
  }
}
