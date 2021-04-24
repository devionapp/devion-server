import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Skill, SkillRelations} from '../models';

export class SkillRepository extends DefaultCrudRepository<
  Skill,
  typeof Skill.prototype.id,
  SkillRelations
> {
  constructor(@inject('datasources.database') dataSource: DatabaseDataSource) {
    super(Skill, dataSource);
  }
}
