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
  BusinessRule,
} from '../models';
import {RequirementRepository} from '../repositories';

export class RequirementBusinessRuleController {
  constructor(
    @repository(RequirementRepository) protected requirementRepository: RequirementRepository,
  ) { }

  @get('/requirements/{id}/business-rules', {
    responses: {
      '200': {
        description: 'Array of Requirement has many BusinessRule',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(BusinessRule)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<BusinessRule>,
  ): Promise<BusinessRule[]> {
    return this.requirementRepository.businessRules(id).find(filter);
  }

  @post('/requirements/{id}/business-rules', {
    responses: {
      '200': {
        description: 'Requirement model instance',
        content: {'application/json': {schema: getModelSchemaRef(BusinessRule)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Requirement.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BusinessRule, {
            title: 'NewBusinessRuleInRequirement',
            exclude: ['id'],
            optional: ['requirementId']
          }),
        },
      },
    }) businessRule: Omit<BusinessRule, 'id'>,
  ): Promise<BusinessRule> {
    return this.requirementRepository.businessRules(id).create(businessRule);
  }

  @patch('/requirements/{id}/business-rules', {
    responses: {
      '200': {
        description: 'Requirement.BusinessRule PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BusinessRule, {partial: true}),
        },
      },
    })
    businessRule: Partial<BusinessRule>,
    @param.query.object('where', getWhereSchemaFor(BusinessRule)) where?: Where<BusinessRule>,
  ): Promise<Count> {
    return this.requirementRepository.businessRules(id).patch(businessRule, where);
  }

  @del('/requirements/{id}/business-rules', {
    responses: {
      '200': {
        description: 'Requirement.BusinessRule DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(BusinessRule)) where?: Where<BusinessRule>,
  ): Promise<Count> {
    return this.requirementRepository.businessRules(id).delete(where);
  }
}
