import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Tenant} from './tenant.model';

@model({
  settings: {
    foreignKeys: {
      tenantId: {
        name: 'fk_skill_tenantId',
        entity: 'Tenant',
        entityKey: 'id',
        foreignKey: 'tenantId',
      },
    },
  },
})
export class Skill extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Tenant)
  tenantId: number;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  constructor(data?: Partial<Skill>) {
    super(data);
  }
}

export interface SkillRelations {
  // describe navigational properties here
}

export type SkillWithRelations = Skill & SkillRelations;
