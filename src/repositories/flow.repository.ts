import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Flow, FlowRelations, Step, Tenant} from '../models';
import {StepRepository} from './step.repository';
import {TenantRepository} from './tenant.repository';

export class FlowRepository extends DefaultCrudRepository<
  Flow,
  typeof Flow.prototype.id,
  FlowRelations
> {

  public readonly steps: HasManyRepositoryFactory<Step, typeof Flow.prototype.id>;

  public readonly tenant: BelongsToAccessor<Tenant, typeof Flow.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('StepRepository') protected stepRepositoryGetter: Getter<StepRepository>, @repository.getter('TenantRepository') protected tenantRepositoryGetter: Getter<TenantRepository>,
  ) {
    super(Flow, dataSource);
    this.tenant = this.createBelongsToAccessorFor('tenant', tenantRepositoryGetter,);
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
    this.steps = this.createHasManyRepositoryFactoryFor('steps', stepRepositoryGetter,);
    this.registerInclusionResolver('steps', this.steps.inclusionResolver);
  }
}
