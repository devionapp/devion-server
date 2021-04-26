import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    foreignKeys: {
      projectId: {
        name: 'fk_projectId',
        entity: 'Project',
        entityKey: 'id',
        foreignKey: 'projectId',
      },
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

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'number',
  })
  projectId?: number;

  constructor(data?: Partial<Requirement>) {
    super(data);
  }
}

export interface RequirementRelations {
  // describe navigational properties here
}

export type RequirementWithRelations = Requirement & RequirementRelations;
