import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {ProjectApplication, ProjectApplicationRelations} from '../models';

export class ProjectApplicationRepository extends DefaultCrudRepository<
  ProjectApplication,
  typeof ProjectApplication.prototype.id,
  ProjectApplicationRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(ProjectApplication, dataSource);
  }
}
