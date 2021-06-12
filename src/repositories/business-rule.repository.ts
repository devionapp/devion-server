import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {BusinessRule, BusinessRuleRelations} from '../models';

export class BusinessRuleRepository extends DefaultCrudRepository<
  BusinessRule,
  typeof BusinessRule.prototype.id,
  BusinessRuleRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(BusinessRule, dataSource);
  }
}
