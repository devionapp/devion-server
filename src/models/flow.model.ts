import {Entity, hasMany, model, property} from '@loopback/repository';
import {Step} from './step.model';

@model({settings: {strict: false, }})
export class Flow extends Entity {
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

  @hasMany(() => Step)
  steps: Step[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Flow>) {
    super(data);
  }
}

export interface FlowRelations {
  // describe navigational properties here
}

export type FlowWithRelations = Flow & FlowRelations;
