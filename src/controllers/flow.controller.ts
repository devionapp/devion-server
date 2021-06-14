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
import {Flow} from '../models';
import {FlowRepository} from '../repositories';

export class FlowController {
  constructor(
    @repository(FlowRepository)
    public flowRepository : FlowRepository,
  ) {}

  @post('/flows')
  @response(200, {
    description: 'Flow model instance',
    content: {'application/json': {schema: getModelSchemaRef(Flow)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Flow, {
            title: 'NewFlow',
            exclude: ['id'],
          }),
        },
      },
    })
    flow: Omit<Flow, 'id'>,
  ): Promise<Flow> {
    return this.flowRepository.create(flow);
  }

  @get('/flows/count')
  @response(200, {
    description: 'Flow model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Flow) where?: Where<Flow>,
  ): Promise<Count> {
    return this.flowRepository.count(where);
  }

  @get('/flows')
  @response(200, {
    description: 'Array of Flow model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Flow, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Flow) filter?: Filter<Flow>,
  ): Promise<Flow[]> {
    return this.flowRepository.find(filter);
  }

  @patch('/flows')
  @response(200, {
    description: 'Flow PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Flow, {partial: true}),
        },
      },
    })
    flow: Flow,
    @param.where(Flow) where?: Where<Flow>,
  ): Promise<Count> {
    return this.flowRepository.updateAll(flow, where);
  }

  @get('/flows/{id}')
  @response(200, {
    description: 'Flow model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Flow, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Flow, {exclude: 'where'}) filter?: FilterExcludingWhere<Flow>
  ): Promise<Flow> {
    return this.flowRepository.findById(id, filter);
  }

  @patch('/flows/{id}')
  @response(204, {
    description: 'Flow PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Flow, {partial: true}),
        },
      },
    })
    flow: Flow,
  ): Promise<void> {
    await this.flowRepository.updateById(id, flow);
  }

  @put('/flows/{id}')
  @response(204, {
    description: 'Flow PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() flow: Flow,
  ): Promise<void> {
    await this.flowRepository.replaceById(id, flow);
  }

  @del('/flows/{id}')
  @response(204, {
    description: 'Flow DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.flowRepository.deleteById(id);
  }
}
