import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  DataObject,
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
import * as _ from 'lodash';
import {Flow, Step, User} from '../models';
import {FlowRepository, StepRepository, UserRepository} from '../repositories';

export class FlowController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(StepRepository)
    public stepRepository: StepRepository,
    @repository(FlowRepository)
    public flowRepository: FlowRepository,
  ) { }

  @post('/flows')
  @authenticate('jwt')
  @response(200, {
    description: 'Flow model instance',
    content: {'application/json': {schema: getModelSchemaRef(Flow)}},
  })
  async create(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
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
    const {tenantId} = await this.userRepository.findById(currentUser.id);

    flow.tenantId = tenantId

    const steps = _.cloneDeep(flow.steps)

    delete flow.steps

    const newFlow = await this.flowRepository.create(flow);

    if (steps?.length) {
      await Promise.all(steps?.map(async (step: DataObject<Step>) => {
        await this.flowRepository.steps(newFlow.id).create(step)
      }))
    }

    return newFlow
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
  @authenticate('jwt')
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
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
    @param.filter(Flow) filter?: Filter<Flow>,
  ): Promise<Flow[]> {
    const {tenantId} = await this.userRepository.findById(currentUser.id);

    return this.flowRepository.find({
      where: {
        tenantId: tenantId,
      },
    });
  }

  @patch('/flows')
  @authenticate('jwt')
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
    return this.flowRepository.findById(id, {
      include: [
        {relation: 'steps'},
      ],
    });
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
  @authenticate('jwt')
  @response(204, {
    description: 'Flow PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() flow: Flow,
  ): Promise<void> {
    await this.flowRepository.steps(flow.id).delete()

    if (flow.steps?.length) {
      await Promise.all(flow.steps?.map(async (step: DataObject<Step>) => {
        await this.flowRepository.steps(flow.id).create(step)
      }))
    }

    delete flow.steps

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