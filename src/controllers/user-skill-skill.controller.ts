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
  Skill,
} from '../models';
import {UserSkillRepository} from '../repositories';

export class UserSkillSkillController {
  constructor(
    @repository(UserSkillRepository)
    public userSkillRepository: UserSkillRepository,
  ) { }

  @get('/user-skills/{id}/skill', {
    responses: {
      '200': {
        description: 'Skill belonging to UserSkill',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Skill)},
          },
        },
      },
    },
  })
  async getSkill(
    @param.path.number('id') id: typeof UserSkill.prototype.id,
  ): Promise<Skill> {
    return this.userSkillRepository.skill(id);
  }
}
