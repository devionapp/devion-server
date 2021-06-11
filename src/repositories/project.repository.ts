import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Project, ProjectRelations, Requirement, Tenant, App, ProjectApp} from '../models';
import {RequirementRepository} from './requirement.repository';
import {TenantRepository} from './tenant.repository';
import {ProjectAppRepository} from './project-app.repository';
import {AppRepository} from './app.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly requirements: HasManyRepositoryFactory<Requirement, typeof Project.prototype.id>;

  public readonly tenant: BelongsToAccessor<Tenant, typeof Project.prototype.id>;

  public readonly apps: HasManyThroughRepositoryFactory<App, typeof App.prototype.id,
          ProjectApp,
          typeof Project.prototype.id
        >;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('RequirementRepository') protected requirementRepositoryGetter: Getter<RequirementRepository>, @repository.getter('TenantRepository') protected tenantRepositoryGetter: Getter<TenantRepository>, @repository.getter('ProjectAppRepository') protected projectAppRepositoryGetter: Getter<ProjectAppRepository>, @repository.getter('AppRepository') protected appRepositoryGetter: Getter<AppRepository>,
  ) {
    super(Project, dataSource);
    this.apps = this.createHasManyThroughRepositoryFactoryFor('apps', appRepositoryGetter, projectAppRepositoryGetter,);
    this.registerInclusionResolver('apps', this.apps.inclusionResolver);
    this.tenant = this.createBelongsToAccessorFor('tenant', tenantRepositoryGetter,);
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
    this.requirements = this.createHasManyRepositoryFactoryFor('requirements', requirementRepositoryGetter,);
    this.registerInclusionResolver('requirements', this.requirements.inclusionResolver);
  }
}
