import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Card,
  Project,
} from '../models';
import {CardRepository} from '../repositories';

export class CardProjectController {
  constructor(
    @repository(CardRepository)
    public cardRepository: CardRepository,
  ) { }

  @get('/cards/{id}/project', {
    responses: {
      '200': {
        description: 'Project belonging to Card',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async getProject(
    @param.path.number('id') id: typeof Card.prototype.id,
  ): Promise<Project> {
    return this.cardRepository.project(id);
  }
}
