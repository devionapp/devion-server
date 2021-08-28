import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Step, StepRelations, Flow, Skill, Card} from '../models';
import {FlowRepository} from './flow.repository';
import {SkillRepository} from './skill.repository';
import {CardRepository} from './card.repository';

export class StepRepository extends DefaultCrudRepository<
  Step,
  typeof Step.prototype.id,
  StepRelations
> {

  public readonly flow: BelongsToAccessor<Flow, typeof Step.prototype.id>;

  public readonly skill: BelongsToAccessor<Skill, typeof Step.prototype.id>;

  public readonly cards: HasManyRepositoryFactory<Card, typeof Step.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('FlowRepository') protected flowRepositoryGetter: Getter<FlowRepository>, @repository.getter('SkillRepository') protected skillRepositoryGetter: Getter<SkillRepository>, @repository.getter('CardRepository') protected cardRepositoryGetter: Getter<CardRepository>,
  ) {
    super(Step, dataSource);
    this.cards = this.createHasManyRepositoryFactoryFor('cards', cardRepositoryGetter,);
    this.registerInclusionResolver('cards', this.cards.inclusionResolver);
    this.skill = this.createBelongsToAccessorFor('skill', skillRepositoryGetter,);
    this.registerInclusionResolver('skill', this.skill.inclusionResolver);
    this.flow = this.createBelongsToAccessorFor('flow', flowRepositoryGetter,);
    this.registerInclusionResolver('flow', this.flow.inclusionResolver);
  }
}
