import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class BusinessRule extends Entity {
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

  @property({
    type: 'number',
  })
  requirementId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<BusinessRule>) {
    super(data);
  }
}

export interface BusinessRuleRelations {
  // describe navigational properties here
}

export type BusinessRuleWithRelations = BusinessRule & BusinessRuleRelations;
