import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Project, ProjectRelations, Requirement} from '../models';
import {RequirementRepository} from './requirement.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly requirements: HasManyRepositoryFactory<Requirement, typeof Project.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('RequirementRepository') protected requirementRepositoryGetter: Getter<RequirementRepository>,
  ) {
    super(Project, dataSource);
    this.requirements = this.createHasManyRepositoryFactoryFor('requirements', requirementRepositoryGetter,);
    this.registerInclusionResolver('requirements', this.requirements.inclusionResolver);
  }
}
