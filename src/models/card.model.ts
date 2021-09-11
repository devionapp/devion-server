import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {Requirement} from './requirement.model';

@model({settings: {strict: false}})
export class Card extends Entity {
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
    type: 'number',
    required: true,
  })
  skillLevel: number;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'number',
  })
  flowId?: number;

  @property({
    type: 'number',
  })
  stepId?: number;

  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => Requirement)
  requirementId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Card>) {
    super(data);
  }
}

export interface CardRelations {
  // describe navigational properties here
}

export type CardWithRelations = Card & CardRelations;
