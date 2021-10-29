import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  CardTimeLog,
  Project,
} from '../models';
import {CardTimeLogRepository} from '../repositories';

export class CardTimeLogProjectController {
  constructor(
    @repository(CardTimeLogRepository)
    public cardTimeLogRepository: CardTimeLogRepository,
  ) { }

  @get('/card-time-logs/{id}/project', {
    responses: {
      '200': {
        description: 'Project belonging to CardTimeLog',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async getProject(
    @param.path.number('id') id: typeof CardTimeLog.prototype.id,
  ): Promise<Project> {
    return this.cardTimeLogRepository.project(id);
  }
}
