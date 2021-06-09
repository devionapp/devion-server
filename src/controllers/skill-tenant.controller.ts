import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Skill,
  Tenant,
} from '../models';
import {SkillRepository} from '../repositories';

export class SkillTenantController {
  constructor(
    @repository(SkillRepository)
    public skillRepository: SkillRepository,
  ) { }

  @get('/skills/{id}/tenant', {
    responses: {
      '200': {
        description: 'Tenant belonging to Skill',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tenant)},
          },
        },
      },
    },
  })
  async getTenant(
    @param.path.number('id') id: typeof Skill.prototype.id,
  ): Promise<Tenant> {
    return this.skillRepository.tenant(id);
  }
}
