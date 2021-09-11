import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Requirement} from '../models';
import {RequirementRepository} from '../repositories';

export class RequirementController {
  constructor(
    @repository(RequirementRepository)
    public requirementRepository : RequirementRepository,
  ) {}

  @post('/requirements')
  @response(200, {
    description: 'Requirement model instance',
    content: {'application/json': {schema: getModelSchemaRef(Requirement)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Requirement, {
            title: 'NewRequirement',
            
          }),
        },
      },
    })
    requirement: Requirement,
  ): Promise<Requirement> {
    return this.requirementRepository.create(requirement);
  }

  @get('/requirements/count')
  @response(200, {
    description: 'Requirement model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Requirement) where?: Where<Requirement>,
  ): Promise<Count> {
    return this.requirementRepository.count(where);
  }

  @get('/requirements')
  @response(200, {
    description: 'Array of Requirement model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Requirement, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Requirement) filter?: Filter<Requirement>,
  ): Promise<Requirement[]> {
    return this.requirementRepository.find(filter);
  }

  @patch('/requirements')
  @response(200, {
    description: 'Requirement PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Requirement, {partial: true}),
        },
      },
    })
    requirement: Requirement,
    @param.where(Requirement) where?: Where<Requirement>,
  ): Promise<Count> {
    return this.requirementRepository.updateAll(requirement, where);
  }

  @get('/requirements/{id}')
  @response(200, {
    description: 'Requirement model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Requirement, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Requirement, {exclude: 'where'}) filter?: FilterExcludingWhere<Requirement>
  ): Promise<Requirement> {
    return this.requirementRepository.findById(id, filter);
  }

  @patch('/requirements/{id}')
  @response(204, {
    description: 'Requirement PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Requirement, {partial: true}),
        },
      },
    })
    requirement: Requirement,
  ): Promise<void> {
    await this.requirementRepository.updateById(id, requirement);
  }

  @put('/requirements/{id}')
  @response(204, {
    description: 'Requirement PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() requirement: Requirement,
  ): Promise<void> {
    await this.requirementRepository.replaceById(id, requirement);
  }

  @del('/requirements/{id}')
  @response(204, {
    description: 'Requirement DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.requirementRepository.deleteById(id);
  }
}
