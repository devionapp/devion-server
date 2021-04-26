import {Entity, hasMany, model, property} from '@loopback/repository';
import {Requirement} from './requirement.model';

@model({
  settings: {
    foreignKeys: {
      tenantId: {
        name: 'fk_project_tenantId',
        entity: 'Tenant',
        entityKey: 'id',
        foreignKey: 'tenantId',
      },
    },
  },
})
export class Project extends Entity {
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
    required: true,
  })
  type: string;

  @property({
    type: 'number',
    required: true,
  })
  createdBy: number;

  @hasMany(() => Requirement)
  requirements: Requirement[];

  @property({
    type: 'number',
  })
  tenantId?: number;

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
