import {Entity, model, property, hasMany} from '@loopback/repository';
import {Permission} from './permission.model';
import {RolePermission} from './role-permission.model';

@model({settings: {strict: false}})
export class Role extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasMany(() => Permission, {through: {model: () => RolePermission}})
  permissions: Permission[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
