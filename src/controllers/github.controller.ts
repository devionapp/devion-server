/* eslint-disable @typescript-eslint/no-explicit-any */
// https://docs.github.com/en/rest/overview/resources-in-the-rest-api

import {get, response} from '@loopback/rest';

export class GithubController {
  constructor() {
    //
  }
  @get('/github/users/orgs')
  @response(200, {
    description: 'Github model instance',
  })
  githubIntegration(
  ): any {
    const api = 'https://api.github.com/users/octocat/orgs'

    return api
  }
}
