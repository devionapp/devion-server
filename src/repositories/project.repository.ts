import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory, repository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Application, Project, ProjectApplication, ProjectRelations, Requirement, Tenant} from '../models';
import {ApplicationRepository} from './application.repository';
import {ProjectApplicationRepository} from './project-application.repository';
import {RequirementRepository} from './requirement.repository';
import {TenantRepository} from './tenant.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly requirements: HasManyRepositoryFactory<Requirement, typeof Project.prototype.id>;

  public readonly tenant: BelongsToAccessor<Tenant, typeof Project.prototype.id>;

  public readonly applications: HasManyThroughRepositoryFactory<Application, typeof Application.prototype.id,
    ProjectApplication,
    typeof Project.prototype.id
  >;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('RequirementRepository') protected requirementRepositoryGetter: Getter<RequirementRepository>, @repository.getter('TenantRepository') protected tenantRepositoryGetter: Getter<TenantRepository>, @repository.getter('ProjectApplicationRepository') protected projectApplicationRepositoryGetter: Getter<ProjectApplicationRepository>, @repository.getter('ApplicationRepository') protected applicationRepositoryGetter: Getter<ApplicationRepository>,
  ) {
    super(Project, dataSource);
    this.applications = this.createHasManyThroughRepositoryFactoryFor('applications', applicationRepositoryGetter, projectApplicationRepositoryGetter,);
    this.registerInclusionResolver('applications', this.applications.inclusionResolver);
    this.tenant = this.createBelongsToAccessorFor('tenant', tenantRepositoryGetter,);
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
    this.requirements = this.createHasManyRepositoryFactoryFor('requirements', requirementRepositoryGetter,);
    this.registerInclusionResolver('requirements', this.requirements.inclusionResolver);
  }
}
