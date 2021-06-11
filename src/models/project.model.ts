import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {App} from './app.model';
import {ProjectApp} from './project-app.model';
import {Requirement} from './requirement.model';
import {Tenant} from './tenant.model';

@model({
  settings: {
    strict: false,
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

  @belongsTo(() => Tenant)
  tenantId: number;

  @property({
    type: 'number',
  })
  createdBy?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

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
  requirements?: Requirement[];

  @hasMany(() => App, {through: {model: () => ProjectApp}})
  apps?: App[];

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
