import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: false,
    foreignKeys: {
      projectId: {
        name: 'fk_project_application_projectId',
        entity: 'Project',
        entityKey: 'id',
        foreignKey: 'projectId',
      },
      applicationId: {
        name: 'fk_project_application_applicationId',
        entity: 'Application',
        entityKey: 'id',
        foreignKey: 'applicationId',
      },
    },
  },
})
export class ProjectApplication extends Entity {
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
  applicationId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ProjectApplication>) {
    super(data);
  }
}

export interface ProjectApplicationRelations {
  // describe navigational properties here
}

export type ProjectApplicationWithRelations = ProjectApplication & ProjectApplicationRelations;
