import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {FlowStep, FlowStepRelations} from '../models';

export class FlowStepRepository extends DefaultCrudRepository<
  FlowStep,
  typeof FlowStep.prototype.id,
  FlowStepRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(FlowStep, dataSource);
  }
}
