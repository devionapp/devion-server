import {Entity, model, property} from '@loopback/repository';

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

  @property({
    type: 'number',
  })
  userId?: number;

  @property({
    type: 'number',
  })
  skillId?: number;

  constructor(data?: Partial<UserSkill>) {
    super(data);
  }
}

export interface UserSkillRelations {
  // describe navigational properties here
}

export type UserSkillWithRelations = UserSkill & UserSkillRelations;
