import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Requirement, RequirementRelations, Project} from '../models';
import {ProjectRepository} from './project.repository';

export class RequirementRepository extends DefaultCrudRepository<
  Requirement,
  typeof Requirement.prototype.id,
  RequirementRelations
> {

  public readonly project: BelongsToAccessor<Project, typeof Requirement.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>,
  ) {
    super(Requirement, dataSource);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
  }
}
