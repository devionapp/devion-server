import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Card, CardRelations, Project, Requirement, Step, User} from '../models';
import {ProjectRepository} from './project.repository';
import {RequirementRepository} from './requirement.repository';
import {StepRepository} from './step.repository';
import {UserRepository} from './user.repository';

export class CardRepository extends DefaultCrudRepository<
  Card,
  typeof Card.prototype.id,
  CardRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Card.prototype.id>;

  public readonly requirement: BelongsToAccessor<Requirement, typeof Card.prototype.id>;

  public readonly project: BelongsToAccessor<Project, typeof Card.prototype.id>;

  public readonly step: BelongsToAccessor<Step, typeof Card.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('RequirementRepository') protected requirementRepositoryGetter: Getter<RequirementRepository>, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('StepRepository') protected stepRepositoryGetter: Getter<StepRepository>,
  ) {
    super(Card, dataSource);
    this.step = this.createBelongsToAccessorFor('step', stepRepositoryGetter,);
    this.registerInclusionResolver('step', this.step.inclusionResolver);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
    this.requirement = this.createBelongsToAccessorFor('requirement', requirementRepositoryGetter,);
    this.registerInclusionResolver('requirement', this.requirement.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
