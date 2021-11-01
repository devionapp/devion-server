import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {CardChecklist} from './card-checklist.model';
import {CardTimeLog} from './card-time-log.model';
import {Flow} from './flow.model';
import {Project} from './project.model';
import {Requirement} from './requirement.model';
import {Step} from './step.model';
import {User} from './user.model';

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
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
    required: true,
  })
  skillLevel: number;

  @property({
    type: 'number',
    mysql: {
      dataType: 'float',
      precision: 2,
    }
  })
  estimate: number;

  @property({
    type: 'number',
    mysql: {
      dataType: 'float',
      precision: 2,
    }
  })
  performed: number;

  @property({
    type: 'string',
    required: true,
  })
  type: string;
  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => Requirement)
  requirementId: number;

  @belongsTo(() => Project)
  projectId: number;

  @belongsTo(() => Step)
  stepId: number;

  @belongsTo(() => Flow)
  flowId: number;

  @hasMany(() => CardChecklist)
  cardChecklists: CardChecklist[];

  @hasMany(() => CardTimeLog)
  cardTimeLogs: CardTimeLog[];
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
