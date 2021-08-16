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
  Flow,
  Step
} from '../models';
import {FlowRepository} from '../repositories';

export class FlowStepController {
  constructor(
    @repository(FlowRepository) protected flowRepository: FlowRepository,
  ) { }

  @get('/flows/{id}/steps', {
    responses: {
      '200': {
        description: 'Array of Flow has many Step',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Step)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Step>,
  ): Promise<Step[]> {
    return this.flowRepository.steps(id).find(filter);
  }

  @post('/flows/{id}/steps', {
    responses: {
      '200': {
        description: 'Flow model instance',
        content: {'application/json': {schema: getModelSchemaRef(Step)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Flow.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Step, {
            title: 'NewStepInFlow',
            exclude: ['id'],
            optional: ['flowId']
          }),
        },
      },
    }) step: Omit<Step, 'id'>,
  ): Promise<Step> {
    return this.flowRepository.steps(id).create(step);
  }

  @patch('/flows/{id}/steps', {
    responses: {
      '200': {
        description: 'Flow.Step PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Step, {partial: true}),
        },
      },
    })
    step: Partial<Step>,
    @param.query.object('where', getWhereSchemaFor(Step)) where?: Where<Step>,
  ): Promise<Count> {
    return this.flowRepository.steps(id).patch(step, where);
  }

  @del('/flows/{id}/steps', {
    responses: {
      '200': {
        description: 'Flow.Step DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Step)) where?: Where<Step>,
  ): Promise<Count> {
    return this.flowRepository.steps(id).delete(where);
  }
}
