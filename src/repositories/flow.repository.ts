import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Flow, FlowRelations, Step} from '../models';
import {StepRepository} from './step.repository';

export class FlowRepository extends DefaultCrudRepository<
  Flow,
  typeof Flow.prototype.id,
  FlowRelations
> {

  public readonly steps: HasManyRepositoryFactory<Step, typeof Flow.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('StepRepository') protected stepRepositoryGetter: Getter<StepRepository>,
  ) {
    super(Flow, dataSource);
    this.steps = this.createHasManyRepositoryFactoryFor('steps', stepRepositoryGetter,);
    this.registerInclusionResolver('steps', this.steps.inclusionResolver);
  }
}
