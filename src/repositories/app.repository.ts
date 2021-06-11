import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {App, AppRelations} from '../models';

export class AppRepository extends DefaultCrudRepository<
  App,
  typeof App.prototype.id,
  AppRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(App, dataSource);
  }
}
