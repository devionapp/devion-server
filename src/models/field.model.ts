import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Field extends Entity {
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
  type?: string;

  @property({
    type: 'string',
  })
  min?: string;

  @property({
    type: 'number',
  })
  max?: number;

  @property({
    type: 'number',
  })
  rule?: number;

  @property({
    type: 'number',
  })
  requirementId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Field>) {
    super(data);
  }
}

export interface FieldRelations {
  // describe navigational properties here
}

export type FieldWithRelations = Field & FieldRelations;