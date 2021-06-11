import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class ProjectApp extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  projectId?: number;

  @property({
    type: 'number',
  })
  appId?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ProjectApp>) {
    super(data);
  }
}

export interface ProjectAppRelations {
  // describe navigational properties here
}

export type ProjectAppWithRelations = ProjectApp & ProjectAppRelations;
