import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Role, RoleRelations, Permission, RolePermission} from '../models';
import {RolePermissionRepository} from './role-permission.repository';
import {PermissionRepository} from './permission.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {

  public readonly permissions: HasManyThroughRepositoryFactory<Permission, typeof Permission.prototype.id,
          RolePermission,
          typeof Role.prototype.id
        >;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('RolePermissionRepository') protected rolePermissionRepositoryGetter: Getter<RolePermissionRepository>, @repository.getter('PermissionRepository') protected permissionRepositoryGetter: Getter<PermissionRepository>,
  ) {
    super(Role, dataSource);
    this.permissions = this.createHasManyThroughRepositoryFactoryFor('permissions', permissionRepositoryGetter, rolePermissionRepositoryGetter,);
    this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
  }
}
