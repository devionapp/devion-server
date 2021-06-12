import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Field, FieldRelations} from '../models';

export class FieldRepository extends DefaultCrudRepository<
  Field,
  typeof Field.prototype.id,
  FieldRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(Field, dataSource);
  }
}
