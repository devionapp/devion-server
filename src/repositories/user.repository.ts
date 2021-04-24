import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {User, UserRelations, Tenant} from '../models';
import {TenantRepository} from './tenant.repository';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly tenant: BelongsToAccessor<Tenant, typeof User.prototype.id>;

  constructor(@inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('TenantRepository') protected tenantRepositoryGetter: Getter<TenantRepository>,) {
    super(User, dataSource);
    this.tenant = this.createBelongsToAccessorFor('tenant', tenantRepositoryGetter,);
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
