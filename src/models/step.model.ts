import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Card} from './card.model';
import {Flow} from './flow.model';
import {Skill} from './skill.model';

@model({
  settings: {
    strict: false,
    foreignKeys: {
      flowId: {
        name: 'fk_step_flowId',
        entity: 'Flow',
        entityKey: 'id',
        foreignKey: 'flowId',
      },
    },
  }
})
export class Step extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Flow)
  flowId: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  index?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isFinish?: boolean;

  @belongsTo(() => Skill)
  skillId: number;

  @hasMany(() => Card)
  cards: Card[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Step>) {
    super(data);
  }
}

export interface StepRelations {
  // describe navigational properties here
}

export type StepWithRelations = Step & StepRelations;
