import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Application extends Entity {
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



  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Application>) {
    super(data);
  }
}

export interface ApplicationRelations {
  // describe navigational properties here
}

export type ApplicationWithRelations = Application & ApplicationRelations;
