// Uncomment these imports to begin using these cool features!
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {getJsonSchemaRef, post} from '@loopback/openapi-v3';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  requestBody,
  response,
} from '@loopback/rest';
import * as _ from 'lodash';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../keys';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {MyUserService} from '../services/user-service';
import {validateCredentials} from '../services/validators';
import {BcryptHasher} from './../services/hash.password.bcrypt';
import {JWTService} from './../services/jwt-service';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
  ) {}

  @post('/signup', {
    responses: {
      '200': {
        description: 'Sign Up User',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })
  async singUp(@requestBody() userData: User) {
    // Valida se o formato do email esta correto e se a senha tem pelo menos 8 caracteres
    validateCredentials(_.pick(userData, ['email', 'password']));

    // Criptografa a senha
    userData.password = await this.hasher.hashPassword(userData.password);

    const user = await this.userRepository.create(userData);

    return user;
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody() credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);

    return Promise.resolve({token});
  }

  @get('/users/me')
  @authenticate('jwt')
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
  ): Promise<User> {
    return Promise.resolve(currentUser);
  }

  @get('/users')
  @authenticate('jwt') // FAZER O MULTI TENANCY
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
    @param.filter(User)
    filter?: Filter<User>,
  ): Promise<User[]> {
    const {tenantId} = await this.findById(currentUser.id);

    return this.userRepository.find({
      where: {
        tenantId: tenantId,
      },
      fields: {password: false},
    });
  }

  @get('/users/{id}')
  @authenticate('jwt') // FAZER O MULTI TENANCY
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(User, {exclude: 'where'})
    filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, {
      fields: {password: false},
      include: [
        {relation: 'tenant'},
        {
          relation: 'role',
          scope: {
            include: ['permissions'],
          },
        },
      ],
    });
  }
}
