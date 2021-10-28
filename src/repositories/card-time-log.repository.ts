import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {CardTimeLog, CardTimeLogRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class CardTimeLogRepository extends DefaultCrudRepository<
  CardTimeLog,
  typeof CardTimeLog.prototype.id,
  CardTimeLogRelations
> {

  public readonly user: BelongsToAccessor<User, typeof CardTimeLog.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(CardTimeLog, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
