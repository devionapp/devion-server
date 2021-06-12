import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Requirement, RequirementRelations, Project, Flow, Field, BusinessRule} from '../models';
import {ProjectRepository} from './project.repository';
import {FlowRepository} from './flow.repository';
import {FieldRepository} from './field.repository';
import {BusinessRuleRepository} from './business-rule.repository';

export class RequirementRepository extends DefaultCrudRepository<
  Requirement,
  typeof Requirement.prototype.id,
  RequirementRelations
> {

  public readonly project: BelongsToAccessor<Project, typeof Requirement.prototype.id>;

  public readonly flow: BelongsToAccessor<Flow, typeof Requirement.prototype.id>;

  public readonly fields: HasManyRepositoryFactory<Field, typeof Requirement.prototype.id>;

  public readonly businessRules: HasManyRepositoryFactory<BusinessRule, typeof Requirement.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('FlowRepository') protected flowRepositoryGetter: Getter<FlowRepository>, @repository.getter('FieldRepository') protected fieldRepositoryGetter: Getter<FieldRepository>, @repository.getter('BusinessRuleRepository') protected businessRuleRepositoryGetter: Getter<BusinessRuleRepository>,
  ) {
    super(Requirement, dataSource);
    this.businessRules = this.createHasManyRepositoryFactoryFor('businessRules', businessRuleRepositoryGetter,);
    this.registerInclusionResolver('businessRules', this.businessRules.inclusionResolver);
    this.fields = this.createHasManyRepositoryFactoryFor('fields', fieldRepositoryGetter,);
    this.registerInclusionResolver('fields', this.fields.inclusionResolver);
    this.flow = this.createBelongsToAccessorFor('flow', flowRepositoryGetter,);
    this.registerInclusionResolver('flow', this.flow.inclusionResolver);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
  }
}
