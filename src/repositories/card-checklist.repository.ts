import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {CardChecklist, CardChecklistRelations} from '../models';

export class CardChecklistRepository extends DefaultCrudRepository<
  CardChecklist,
  typeof CardChecklist.prototype.id,
  CardChecklistRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(CardChecklist, dataSource);
  }
}
