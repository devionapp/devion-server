import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Card, CardRelations, User, Requirement} from '../models';
import {UserRepository} from './user.repository';
import {RequirementRepository} from './requirement.repository';

export class CardRepository extends DefaultCrudRepository<
  Card,
  typeof Card.prototype.id,
  CardRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Card.prototype.id>;

  public readonly requirement: BelongsToAccessor<Requirement, typeof Card.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('RequirementRepository') protected requirementRepositoryGetter: Getter<RequirementRepository>,
  ) {
    super(Card, dataSource);
    this.requirement = this.createBelongsToAccessorFor('requirement', requirementRepositoryGetter,);
    this.registerInclusionResolver('requirement', this.requirement.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
