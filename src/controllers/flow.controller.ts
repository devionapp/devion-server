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

    // Step "Finalizado"
    await this.flowRepository.steps(newFlow.id).create({
      name: 'Finalizado',
      index: steps.length + 1,
      isFinish: true,
    })

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
        ...filter?.where
      },
      include: [
        {
          relation: 'steps',
          scope: {
            'order': ['index ASC']
          },
        },
      ],
    },
    );
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
        {
          relation: 'steps',
          scope: {
            'order': ['index ASC']
          },
        },
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
    const flowAux = await this.flowRepository.findById(id, {
      include: [
        {relation: 'steps'},
      ],
    });

    if (flow.steps?.length) {
      await Promise.all(flow.steps.map(async flowStep => {
        //Caso nao esteja da lista enviada, deleta
        flowAux.steps?.map(async step => {
          const isDeleted = !flow.steps?.some(step2 => step2.id === undefined || step2.id === step.id)
          if (isDeleted) {
            await this.flowRepository.steps(flow.id).delete({id: step.id})
          }
        })

        const stepId = flowStep.id
        delete flowStep.id

        if (!stepId) {
          await this.flowRepository.steps(flow.id).create(flowStep)
        } else {
          await this.flowRepository.steps(flow.id).patch(flowStep, {id: stepId})
        }
      }))
    } else {
      await this.flowRepository.steps(flow.id).delete()
    }

    // Step "Finalizado"
    const stepFinish = await this.flowRepository.steps(flow.id).find({where: {isFinish: true}})

    if (stepFinish?.[0]) {
      stepFinish[0].index = flow.steps ? flow.steps.length + 1 : 1
      await this.flowRepository.steps(flow.id).patch(stepFinish[0], {id: stepFinish[0].id})
    }

    delete flow.steps

    await this.flowRepository.replaceById(id, flow);
  }

  @del('/flows/{id}')
  @response(204, {
    description: 'Flow DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.flowRepository.steps(id).delete()
    await this.flowRepository.deleteById(id);
  }
}
