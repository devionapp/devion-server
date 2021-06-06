import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Project} from './project.model';

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
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @belongsTo(() => Project)
  projectId: number;

  constructor(data?: Partial<Requirement>) {
    super(data);
  }
}

export interface RequirementRelations {
  // describe navigational properties here
}

export type RequirementWithRelations = Requirement & RequirementRelations;
