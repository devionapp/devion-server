import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Requirement} from '.';

@model({settings: {strict: false}})
export class BusinessRule extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Requirement)
  requirementId: number;

  @property({
    type: 'string',
    required: true,
  })
  description: string;


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
