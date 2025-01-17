import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {BusinessRule} from './business-rule.model';
import {Field} from './field.model';
import {Project} from './project.model';

@model({
  settings: {
    strict: false,
    foreignKeys: {
      projectId: {
        name: 'fk_requirement_projectId',
        entity: 'Project',
        entityKey: 'id',
        foreignKey: 'projectId',
      }
    },
  },
})
export class Requirement extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Project)
  projectId?: number;

  @property({
    type: 'boolean',
  })
  hasTask?: boolean;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @hasMany(() => Field)
  fields?: Field[];

  @hasMany(() => BusinessRule)
  businessRules?: BusinessRule[];

  constructor(data?: Partial<Requirement>) {
    super(data);
  }
}

export interface RequirementRelations {
  // describe navigational properties here
}

export type RequirementWithRelations = Requirement & RequirementRelations;
