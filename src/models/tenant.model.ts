import {Entity, hasMany, model, property} from '@loopback/repository';
import {Project} from './project.model';

@model()
export class Tenant extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  name: string;

  @property({
    type: 'string',
    required: false,
    index: {
      unique: true,
    },
  })
  razaoSocial: string;

  @property({
    type: 'string',
    required: false,
    index: {
      unique: true,
    },
  })
  cnpj: string;


  @hasMany(() => Project)
  projects: Project[];

  constructor(data?: Partial<Tenant>) {
    super(data);
  }
}

export interface TenantRelations {
  // describe navigational properties here
}

export type TenantWithRelations = Tenant & TenantRelations;
