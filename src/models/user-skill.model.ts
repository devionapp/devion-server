import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Skill} from './skill.model';
import {User} from './user.model';

@model({
  settings: {
    strict: false,
    foreignKeys: {
      userId: {
        name: 'fk_userId',
        entity: 'User',
        entityKey: 'id',
        foreignKey: 'userId',
      },
      skillId: {
        name: 'fk_skillId',
        entity: 'Skill',
        entityKey: 'id',
        foreignKey: 'skillId',
      },
    },
  },
})
export class UserSkill extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => Skill)
  skillId: number;

  @property({
    type: 'number',
  })
  level?: number;

  constructor(data?: Partial<UserSkill>) {
    super(data);
  }
}

export interface UserSkillRelations {
  // describe navigational properties here
}

export type UserSkillWithRelations = UserSkill & UserSkillRelations;
