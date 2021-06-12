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
  Requirement,
  Field,
} from '../models';
import {RequirementRepository} from '../repositories';

export class RequirementFieldController {
  constructor(
    @repository(RequirementRepository) protected requirementRepository: RequirementRepository,
  ) { }

  @get('/requirements/{id}/fields', {
    responses: {
      '200': {
        description: 'Array of Requirement has many Field',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Field)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Field>,
  ): Promise<Field[]> {
    return this.requirementRepository.fields(id).find(filter);
  }

  @post('/requirements/{id}/fields', {
    responses: {
      '200': {
        description: 'Requirement model instance',
        content: {'application/json': {schema: getModelSchemaRef(Field)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Requirement.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Field, {
            title: 'NewFieldInRequirement',
            exclude: ['id'],
            optional: ['requirementId']
          }),
        },
      },
    }) field: Omit<Field, 'id'>,
  ): Promise<Field> {
    return this.requirementRepository.fields(id).create(field);
  }

  @patch('/requirements/{id}/fields', {
    responses: {
      '200': {
        description: 'Requirement.Field PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Field, {partial: true}),
        },
      },
    })
    field: Partial<Field>,
    @param.query.object('where', getWhereSchemaFor(Field)) where?: Where<Field>,
  ): Promise<Count> {
    return this.requirementRepository.fields(id).patch(field, where);
  }

  @del('/requirements/{id}/fields', {
    responses: {
      '200': {
        description: 'Requirement.Field DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Field)) where?: Where<Field>,
  ): Promise<Count> {
    return this.requirementRepository.fields(id).delete(where);
  }
}
