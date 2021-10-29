import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Card} from './card.model';
import {User} from './user.model';
import {Project} from './project.model';

@model({settings: {strict: false}})
export class CardTimeLog extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  hours?: number;

  @property({
    type: 'number',
  })
  minutes?: number;

  @property({
    type: 'date',
  })
  date?: string;

  @property({
    type: 'string',
  })
  type?: string;

  @belongsTo(() => Card)
  cardId: number;

  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => Project)
  projectId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<CardTimeLog>) {
    super(data);
  }
}

export interface CardTimeLogRelations {
  // describe navigational properties here
}

export type CardTimeLogWithRelations = CardTimeLog & CardTimeLogRelations;
