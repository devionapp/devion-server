import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {App, AppRelations, Tenant} from '../models';
import {TenantRepository} from './tenant.repository';

export class AppRepository extends DefaultCrudRepository<
  App,
  typeof App.prototype.id,
  AppRelations
> {

  public readonly tenant: BelongsToAccessor<Tenant, typeof App.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('TenantRepository') protected tenantRepositoryGetter: Getter<TenantRepository>,
  ) {
    super(App, dataSource);
    this.tenant = this.createBelongsToAccessorFor('tenant', tenantRepositoryGetter,);
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
