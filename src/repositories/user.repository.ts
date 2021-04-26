import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Role, Skill, Tenant, User, UserRelations, UserSkill} from '../models';
import {RoleRepository} from './role.repository';
import {SkillRepository} from './skill.repository';
import {TenantRepository} from './tenant.repository';
import {UserSkillRepository} from './user-skill.repository';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly tenant: BelongsToAccessor<Tenant, typeof User.prototype.id>;

  public readonly role: BelongsToAccessor<Role, typeof User.prototype.id>;

  public readonly skills: HasManyThroughRepositoryFactory<
    Skill,
    typeof Skill.prototype.id,
    UserSkill,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
    @repository.getter('UserSkillRepository')
    protected userSkillRepositoryGetter: Getter<UserSkillRepository>,
    @repository.getter('SkillRepository')
    protected skillRepositoryGetter: Getter<SkillRepository>,
  ) {
    super(User, dataSource);
    this.skills = this.createHasManyThroughRepositoryFactoryFor(
      'skills',
      skillRepositoryGetter,
      userSkillRepositoryGetter,
    );
    this.registerInclusionResolver('skills', this.skills.inclusionResolver);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
    this.tenant = this.createBelongsToAccessorFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
