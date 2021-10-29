import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {CardTimeLog, CardTimeLogRelations, User, Card, Project} from '../models';
import {UserRepository} from './user.repository';
import {CardRepository} from './card.repository';
import {ProjectRepository} from './project.repository';

export class CardTimeLogRepository extends DefaultCrudRepository<
  CardTimeLog,
  typeof CardTimeLog.prototype.id,
  CardTimeLogRelations
> {

  public readonly user: BelongsToAccessor<User, typeof CardTimeLog.prototype.id>;

  public readonly card: BelongsToAccessor<Card, typeof CardTimeLog.prototype.id>;

  public readonly project: BelongsToAccessor<Project, typeof CardTimeLog.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('CardRepository') protected cardRepositoryGetter: Getter<CardRepository>, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>,
  ) {
    super(CardTimeLog, dataSource);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
    this.card = this.createBelongsToAccessorFor('card', cardRepositoryGetter,);
    this.registerInclusionResolver('card', this.card.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
