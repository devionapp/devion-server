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
    type: 'number',
    required: true,
  })
  createdBy: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
  })
  tenantId?: number;

  @property({
    type: 'string',
  })
  description: string;

  @property({
    type: 'string',
  })
  type: string;

  @property({
    type: 'string',
  })
  baseUrl: string;

  @property({
    type: 'string',
  })
  baseUrlDev: string;

  @property({
    type: 'string',
  })
  baseUrlQa: string;

  @property({
    type: 'string',
  })
  repository: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  startDate?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  finishDate?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  forecastDate?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdOn?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  modified?: string;

  @hasMany(() => Requirement)
  requirements: Requirement[];

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
