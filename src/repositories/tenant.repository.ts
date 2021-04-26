import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Tenant, TenantRelations, Project} from '../models';
import {ProjectRepository} from './project.repository';

export class TenantRepository extends DefaultCrudRepository<
  Tenant,
  typeof Tenant.prototype.id,
  TenantRelations
> {

  public readonly projects: HasManyRepositoryFactory<Project, typeof Tenant.prototype.id>;

  constructor(@inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>,) {
    super(Tenant, dataSource);
    this.projects = this.createHasManyRepositoryFactoryFor('projects', projectRepositoryGetter,);
    this.registerInclusionResolver('projects', this.projects.inclusionResolver);
  }
}
