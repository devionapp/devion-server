import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserSkill,
  User,
} from '../models';
import {UserSkillRepository} from '../repositories';

export class UserSkillUserController {
  constructor(
    @repository(UserSkillRepository)
    public userSkillRepository: UserSkillRepository,
  ) { }

  @get('/user-skills/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to UserSkill',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof UserSkill.prototype.id,
  ): Promise<User> {
    return this.userSkillRepository.user(id);
  }
}
