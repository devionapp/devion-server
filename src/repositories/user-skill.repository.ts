import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {UserSkill, UserSkillRelations} from '../models';

export class UserSkillRepository extends DefaultCrudRepository<
  UserSkill,
  typeof UserSkill.prototype.id,
  UserSkillRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(UserSkill, dataSource);
  }
}
