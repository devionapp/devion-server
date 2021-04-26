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
User,
UserSkill,
Skill,
} from '../models';
import {UserRepository} from '../repositories';

export class UserSkillController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/skills', {
    responses: {
      '200': {
        description: 'Array of User has many Skill through UserSkill',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Skill)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Skill>,
  ): Promise<Skill[]> {
    return this.userRepository.skills(id).find(filter);
  }

  @post('/users/{id}/skills', {
    responses: {
      '200': {
        description: 'create a Skill model instance',
        content: {'application/json': {schema: getModelSchemaRef(Skill)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Skill, {
            title: 'NewSkillInUser',
            exclude: ['id'],
          }),
        },
      },
    }) skill: Omit<Skill, 'id'>,
  ): Promise<Skill> {
    return this.userRepository.skills(id).create(skill);
  }

  @patch('/users/{id}/skills', {
    responses: {
      '200': {
        description: 'User.Skill PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Skill, {partial: true}),
        },
      },
    })
    skill: Partial<Skill>,
    @param.query.object('where', getWhereSchemaFor(Skill)) where?: Where<Skill>,
  ): Promise<Count> {
    return this.userRepository.skills(id).patch(skill, where);
  }

  @del('/users/{id}/skills', {
    responses: {
      '200': {
        description: 'User.Skill DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Skill)) where?: Where<Skill>,
  ): Promise<Count> {
    return this.userRepository.skills(id).delete(where);
  }
}
