import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Step, StepRelations, Flow} from '../models';
import {FlowRepository} from './flow.repository';

export class StepRepository extends DefaultCrudRepository<
  Step,
  typeof Step.prototype.id,
  StepRelations
> {

  public readonly flow: BelongsToAccessor<Flow, typeof Step.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('FlowRepository') protected flowRepositoryGetter: Getter<FlowRepository>,
  ) {
    super(Step, dataSource);
    this.flow = this.createBelongsToAccessorFor('flow', flowRepositoryGetter,);
    this.registerInclusionResolver('flow', this.flow.inclusionResolver);
  }
}
