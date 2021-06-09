import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
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
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {Skill, User} from '../models';
import {SkillRepository, UserRepository} from '../repositories';


export class SkillController {
  constructor(
    @repository(SkillRepository)
    public skillRepository: SkillRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @post('/skills')
  @authenticate('jwt')
  @response(200, {
    description: 'Skill model instance',
    content: {'application/json': {schema: getModelSchemaRef(Skill)}},
  })
  async create(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Skill, {
            title: 'NewSkill',

          }),
        },
      },
    })
    skill: Skill,
  ): Promise<Skill> {
    const {tenantId} = await this.userRepository.findById(currentUser.id);
    skill.tenantId = tenantId
    return this.skillRepository.create(skill);
  }

  @get('/skills/count')
  @authenticate('jwt')
  @response(200, {
    description: 'Skill model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Skill) where?: Where<Skill>,
  ): Promise<Count> {
    return this.skillRepository.count(where);
  }

  @get('/skills')
  @authenticate('jwt')
  @response(200, {
    description: 'Array of Skill model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Skill, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
    @param.filter(Skill) filter?: Filter<Skill>,
  ): Promise<Skill[]> {
    const {tenantId} = await this.userRepository.findById(currentUser.id);

    return this.skillRepository.find({
      where: {
        tenantId: tenantId,
      },
    });
  }

  @patch('/skills')
  @authenticate('jwt')
  @response(200, {
    description: 'Skill PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Skill, {partial: true}),
        },
      },
    })
    skill: Skill,
    @param.where(Skill) where?: Where<Skill>,
  ): Promise<Count> {
    return this.skillRepository.updateAll(skill, where);
  }

  @get('/skills/{id}')
  @authenticate('jwt')
  @response(200, {
    description: 'Skill model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Skill, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Skill, {exclude: 'where'}) filter?: FilterExcludingWhere<Skill>
  ): Promise<Skill> {
    return this.skillRepository.findById(id, filter);
  }

  @patch('/skills/{id}')
  @authenticate('jwt')
  @response(204, {
    description: 'Skill PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Skill, {partial: true}),
        },
      },
    })
    skill: Skill,
  ): Promise<void> {
    await this.skillRepository.updateById(id, skill);
  }

  @put('/skills/{id}')
  @authenticate('jwt')
  @response(204, {
    description: 'Skill PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() skill: Skill,
  ): Promise<void> {
    await this.skillRepository.replaceById(id, skill);
  }

  @del('/skills/{id}')
  @authenticate('jwt')
  @response(204, {
    description: 'Skill DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.skillRepository.deleteById(id);
  }
}
