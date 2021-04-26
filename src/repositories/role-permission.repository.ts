import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {RolePermission, RolePermissionRelations} from '../models';

export class RolePermissionRepository extends DefaultCrudRepository<
  RolePermission,
  typeof RolePermission.prototype.id,
  RolePermissionRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(RolePermission, dataSource);
  }
}
