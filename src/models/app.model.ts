import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<App>) {
    super(data);
  }
}

export interface AppRelations {
  // describe navigational properties here
}

export type AppWithRelations = App & AppRelations;
