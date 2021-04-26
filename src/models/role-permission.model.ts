import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: false,
    foreignKeys: {
      roleId: {
        name: 'fk_role-permission_roleId',
        entity: 'Role',
        entityKey: 'id',
        foreignKey: 'roleId',
      },
      permissionId: {
        name: 'fk_role-permission_permissionId',
        entity: 'Permission',
        entityKey: 'id',
        foreignKey: 'permissionId',
      },
    },
  },
})
export class RolePermission extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  roleId?: number;

  @property({
    type: 'number',
  })
  permissionId?: number;

  constructor(data?: Partial<RolePermission>) {
    super(data);
  }
}

export interface RolePermissionRelations {
  // describe navigational properties here
}

export type RolePermissionWithRelations = RolePermission &
  RolePermissionRelations;
