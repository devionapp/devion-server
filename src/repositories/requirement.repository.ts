import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Requirement, RequirementRelations} from '../models';

export class RequirementRepository extends DefaultCrudRepository<
  Requirement,
  typeof Requirement.prototype.id,
  RequirementRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(Requirement, dataSource);
  }
}
