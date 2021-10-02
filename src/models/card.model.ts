import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Requirement} from './requirement.model';
import {User} from './user.model';
import {Project} from './project.model';
import {Step} from './step.model';

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
    type: 'number',
  })
  estimate: number;

  @property({
    type: 'number',
  })
  performed: number;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'number',
  })
  flowId?: number;
  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => Requirement)
  requirementId: number;

  @belongsTo(() => Project)
  projectId: number;

  @belongsTo(() => Step)
  stepId: number;
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
