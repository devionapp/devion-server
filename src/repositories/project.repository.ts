import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Project, ProjectRelations, Requirement, Tenant} from '../models';
import {RequirementRepository} from './requirement.repository';
import {TenantRepository} from './tenant.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly requirements: HasManyRepositoryFactory<Requirement, typeof Project.prototype.id>;

  public readonly tenant: BelongsToAccessor<Tenant, typeof Project.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('RequirementRepository') protected requirementRepositoryGetter: Getter<RequirementRepository>, @repository.getter('TenantRepository') protected tenantRepositoryGetter: Getter<TenantRepository>,
  ) {
    super(Project, dataSource);
    this.tenant = this.createBelongsToAccessorFor('tenant', tenantRepositoryGetter,);
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
    this.requirements = this.createHasManyRepositoryFactoryFor('requirements', requirementRepositoryGetter,);
    this.registerInclusionResolver('requirements', this.requirements.inclusionResolver);
  }
}
