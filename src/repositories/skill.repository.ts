import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Skill, SkillRelations, Tenant} from '../models';
import {TenantRepository} from './tenant.repository';

export class SkillRepository extends DefaultCrudRepository<
  Skill,
  typeof Skill.prototype.id,
  SkillRelations
> {

  public readonly tenant: BelongsToAccessor<Tenant, typeof Skill.prototype.id>;

  constructor(@inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('TenantRepository') protected tenantRepositoryGetter: Getter<TenantRepository>,) {
    super(Skill, dataSource);
    this.tenant = this.createBelongsToAccessorFor('tenant', tenantRepositoryGetter,);
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
