import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Requirement, RequirementRelations, Project, Flow} from '../models';
import {ProjectRepository} from './project.repository';
import {FlowRepository} from './flow.repository';

export class RequirementRepository extends DefaultCrudRepository<
  Requirement,
  typeof Requirement.prototype.id,
  RequirementRelations
> {

  public readonly project: BelongsToAccessor<Project, typeof Requirement.prototype.id>;

  public readonly flow: BelongsToAccessor<Flow, typeof Requirement.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('FlowRepository') protected flowRepositoryGetter: Getter<FlowRepository>,
  ) {
    super(Requirement, dataSource);
    this.flow = this.createBelongsToAccessorFor('flow', flowRepositoryGetter,);
    this.registerInclusionResolver('flow', this.flow.inclusionResolver);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
  }
}
