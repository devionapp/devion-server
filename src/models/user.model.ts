import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Role} from './role.model';
import {Skill} from './skill.model';
import {Tenant} from './tenant.model';
import {UserSkill} from './user-skill.model';

@model({
  settings: {
    strict: false,
    foreignKeys: {
      tenantId: {
        name: 'fk_tenantId',
        entity: 'Tenant',
        entityKey: 'id',
        foreignKey: 'tenantId',
      },
      roleId: {
        name: 'fk_roleId',
        entity: 'Role',
        entityKey: 'id',
        foreignKey: 'roleId',
      },
    },
  },
})
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @belongsTo(() => Tenant)
  tenantId: number;

  @belongsTo(() => Role)
  roleId: number;

  @hasMany(() => Skill, {through: {model: () => UserSkill}})
  skills: Skill[];
  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
