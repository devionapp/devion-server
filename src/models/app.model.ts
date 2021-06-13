import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Tenant} from './tenant.model';

@model({settings: {strict: false}})
export class App extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
  })
  type?: number;

  @property({
    type: 'string',
  })
  repository?: string;

  @property({
    type: 'string',
  })
  designPattern?: string;

  @property({
    type: 'string',
  })
  language?: string;

  @belongsTo(() => Tenant)
  tenantId: number;

  constructor(data?: Partial<App>) {
    super(data);
  }
}

export interface AppRelations {
  // describe navigational properties here
}

export type AppWithRelations = App & AppRelations;
