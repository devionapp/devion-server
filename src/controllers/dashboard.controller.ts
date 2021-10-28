/* eslint-disable @typescript-eslint/no-explicit-any */

import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, response} from '@loopback/rest';
import {User} from '../models';
import {CardRepository, ProjectRepository, UserRepository} from '../repositories';




export class DashboardController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(ProjectRepository)
    public projectRepository: ProjectRepository,
    @repository(CardRepository)
    public cardRepository: CardRepository,
  ) { }

  @get('/dashboard/active-projects')
  @authenticate('jwt')
  @response(200, {
    description: 'Dashboard',
  })
  async activeProjects(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
  ): Promise<any> {
    const {tenantId} = await this.userRepository.findById(currentUser.id);

    const projects = await this.projectRepository.find({
      where: {
        tenantId: tenantId,
      },
    });

    const projectsDashboardData: any = [...projects]

    return Promise.all(projectsDashboardData.map(async (p: any) => {
      const cards = (await this.cardRepository.find({
        where: {projectId: p.id, type: 'task'},
        include: [
          {
            relation: 'step'
          },
        ],
      },
      ))

      p.horasEstimadas = cards.reduce((total, i) => total + i.estimate, 0)
      p.horasRealizadas = cards.reduce((total, i) => total + i.performed, 0)
      p.totalTarefas = cards.length
      p.tarefasFinalizadas = cards.filter(c => {return c.step.isFinish}).length
      const porcentagem = (100 * p.tarefasFinalizadas) / p.totalTarefas
      p.porcentagemTarefasFinalizadas = porcentagem ? porcentagem.toFixed(2) : 0

      return p
    }))
  }
}
