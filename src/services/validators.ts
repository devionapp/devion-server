import {HttpErrors} from '@loopback/rest';
import * as isEmail from 'isemail';
import {Credentials} from '../repositories/user.repository';

export function validateCredentials(credentials: Credentials) {
  if (!isEmail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('E-mail inválido!');
  }

  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'Senha deve conter no minimo 8 caracteres!',
    );
  }
}
