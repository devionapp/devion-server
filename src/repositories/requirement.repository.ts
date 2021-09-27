import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {BusinessRule, Field, Project, Requirement, RequirementRelations} from '../models';
import {BusinessRuleRepository} from './business-rule.repository';
import {FieldRepository} from './field.repository';
import {ProjectRepository} from './project.repository';

export class RequirementRepository extends DefaultCrudRepository<
  Requirement,
  typeof Requirement.prototype.id,
  RequirementRelations
> {

  public readonly project: BelongsToAccessor<Project, typeof Requirement.prototype.id>;

  public readonly fields: HasManyRepositoryFactory<Field, typeof Requirement.prototype.id>;

  public readonly businessRules: HasManyRepositoryFactory<BusinessRule, typeof Requirement.prototype.id>;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('FieldRepository') protected fieldRepositoryGetter: Getter<FieldRepository>, @repository.getter('BusinessRuleRepository') protected businessRuleRepositoryGetter: Getter<BusinessRuleRepository>,
  ) {
    super(Requirement, dataSource);
    this.businessRules = this.createHasManyRepositoryFactoryFor('businessRules', businessRuleRepositoryGetter,);
    this.registerInclusionResolver('businessRules', this.businessRules.inclusionResolver);
    this.fields = this.createHasManyRepositoryFactoryFor('fields', fieldRepositoryGetter,);
    this.registerInclusionResolver('fields', this.fields.inclusionResolver);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
  }
}
