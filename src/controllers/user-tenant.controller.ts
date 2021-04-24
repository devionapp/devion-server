import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Tenant, User} from '../models';
import {TenantRepository, UserRepository} from '../repositories';

export class UserTenantController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(TenantRepository)
    public tenantRepository: TenantRepository, // @inject('controllers.UserController') // public userController: UserController,
  ) {}
  @get('/users/{id}/tenant', {
    responses: {
      '200': {
        description: 'Tenant belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tenant)},
          },
        },
      },
    },
  })
  async getTenant(
    @param.path.number('id') id: typeof User.prototype.id,
  ): Promise<Tenant> {
    return this.userRepository.tenant(id);
  }
}
