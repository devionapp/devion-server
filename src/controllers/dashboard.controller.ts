/* eslint-disable @typescript-eslint/no-explicit-any */
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {get, param, response} from '@loopback/rest';
import {Card, User} from '../models';
import {CardRepository, CardTimeLogRepository, ProjectRepository, UserRepository} from '../repositories';




export class DashboardController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(ProjectRepository)
    public projectRepository: ProjectRepository,
    @repository(CardRepository)
    public cardRepository: CardRepository,
    @repository(CardTimeLogRepository)
    public cardTimeLogRepository: CardTimeLogRepository,
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


  @get('/dashboard/projects-time-registered')
  @authenticate('jwt')
  @response(200, {
    description: 'Dashboard Time',
  })
  async projectsTimeRegistered(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
    @param.query.object('filter') filter?: Filter<Card>,
  ): Promise<any> {

    // const cards = await this.cardTimeLogRepository.find({
    //   include: [
    //     {
    //       relation: 'card'
    //     },
    //   ],
    // })

    // const cardsTask = cards.filter(c => c.card.type === 'task' && c.card.project === filter?.where?.projectId)
    // const cardsBug = cards.filter(c => c.type === 'bug')

    return
  }
}
