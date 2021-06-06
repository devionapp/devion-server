import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Skill, User, UserSkill, UserSkillRelations} from '../models';
import {SkillRepository} from './skill.repository';
import {UserRepository} from './user.repository';

export class UserSkillRepository extends DefaultCrudRepository<
  UserSkill,
  typeof UserSkill.prototype.id,
  UserSkillRelations
> {

  public readonly user: BelongsToAccessor<User, typeof UserSkill.prototype.id>;

  public readonly skill: BelongsToAccessor<Skill, typeof UserSkill.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('SkillRepository') protected skillRepositoryGetter: Getter<SkillRepository>,
  ) {
    super(UserSkill, dataSource);
    this.skill = this.createBelongsToAccessorFor('skill', skillRepositoryGetter,);
    this.registerInclusionResolver('skill', this.skill.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
