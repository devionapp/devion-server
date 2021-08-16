import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Step,
  Skill,
} from '../models';
import {StepRepository} from '../repositories';

export class StepSkillController {
  constructor(
    @repository(StepRepository)
    public stepRepository: StepRepository,
  ) { }

  @get('/steps/{id}/skill', {
    responses: {
      '200': {
        description: 'Skill belonging to Step',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Skill)},
          },
        },
      },
    },
  })
  async getSkill(
    @param.path.number('id') id: typeof Step.prototype.id,
  ): Promise<Skill> {
    return this.stepRepository.skill(id);
  }
}
