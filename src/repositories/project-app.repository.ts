import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {ProjectApp, ProjectAppRelations} from '../models';

export class ProjectAppRepository extends DefaultCrudRepository<
  ProjectApp,
  typeof ProjectApp.prototype.id,
  ProjectAppRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(ProjectApp, dataSource);
  }
}
