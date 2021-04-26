import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Permission, PermissionRelations} from '../models';

export class PermissionRepository extends DefaultCrudRepository<
  Permission,
  typeof Permission.prototype.id,
  PermissionRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(Permission, dataSource);
  }
}
