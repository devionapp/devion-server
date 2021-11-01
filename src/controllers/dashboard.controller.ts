/* eslint-disable @typescript-eslint/no-explicit-any */
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {get, param, response} from '@loopback/rest';
import moment from 'moment';
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

      p.horasEstimadas = cards.reduce((total, i) => total + i?.estimate, 0)
      p.horasRealizadas = cards.reduce((total, i) => total + i?.performed, 0)
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

    const cards = await this.cardTimeLogRepository.find({
      where: filter?.where,
      include: [
        {
          relation: 'card'
        },
      ],
    })

    const tasks = cards.filter(c => c.card.type === 'task')
    const bugs = cards.filter(c => c.card.type === 'bug')

    const dashboard = []
    for (let i = 0; i < 7; i++) {
      const dateAux = moment().subtract(i, 'd').format('DD/MM')
      const tasksAux = tasks.filter(t => {
        const aux = moment(t.date).format('DD/MM')
        return aux === dateAux
      })
      const bugsAux = bugs.filter(t => {
        const aux = moment(t.date).format('DD/MM')
        return aux === dateAux
      })

      dashboard.push({
        date: dateAux,
        tasks: tasksAux.reduce((total, t) => {
          const hours = t?.hours ?? 0
          const minutes = (t?.minutes ?? 0) / 60;
          const hoursMinutes = hours + minutes
          return total + hoursMinutes
        }, 0),

        bugs: bugsAux.reduce((total, t) => {
          const hours = t?.hours ?? 0
          const minutes = (t?.minutes ?? 0) / 60;
          const hoursMinutes = hours + minutes
          return total + hoursMinutes
        }, 0)
      })
    }
    return dashboard.reverse()
  }

  @get('/dashboard/users-activity')
  @authenticate('jwt')
  @response(200, {
    description: 'Dashboard users-activity',
  })
  async usersActivity(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
  ): Promise<any> {
    const {tenantId} = await this.userRepository.findById(currentUser.id);
    const users = await this.userRepository.find({where: {tenantId: tenantId}})
    return Promise.all(users.map(async u => {
      const timeLog = await this.cardTimeLogRepository.find({
        where: {userId: u.id},
        include: [
          {
            relation: 'card'
          },
        ],
      })

      const tasks = timeLog.filter(c => c.card.type === 'task')
      const bugs = timeLog.filter(c => c.card.type === 'bug')
      const timeTasks = tasks.reduce((total, t) => {
        const hours = t?.hours ?? 0
        const minutes = (t?.minutes ?? 0) / 60;
        const hoursMinutes = hours + minutes
        return total + hoursMinutes
      }, 0)
      const timeBugs = bugs.reduce((total, t) => {
        const hours = t?.hours ?? 0
        const minutes = (t?.minutes ?? 0) / 60;
        const hoursMinutes = hours + minutes
        return total + hoursMinutes
      }, 0)
      const total = timeTasks + timeBugs
      const percentTasks = (100 * timeTasks) / total
      const percentBugs = (100 * timeBugs) / total

      return {
        name: `${u.firstName} ${u.lastName}`,
        timeTasks,
        timeBugs,
        percentTasks: percentTasks ? percentTasks.toFixed(2) : 0,
        percentBugs: percentBugs ? percentBugs.toFixed(2) : 0,
        total: total ? total.toFixed(2) : 0,
      }
    }))
  }


  @get('/dashboard/employee-activity')
  @authenticate('jwt')
  @response(200, {
    description: 'Dashboard',
  })
  async employeeActivity(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: User,
  ): Promise<any> {
    const {roleId, tenantId} = await this.userRepository.findById(currentUser.id);

    let activities = []

    if (roleId === 1 || roleId === 2) {
      activities = (await this.cardTimeLogRepository.find({
        order: ['date DESC'],
        limit: 10,
        include: [
          {
            relation: 'card',
            scope: {
              include: ['requirement', 'project'],
            },
          },
          {
            relation: 'user',
          },
        ],
      })).filter(a => a.user.tenantId === tenantId)
    } else {
      activities = (await this.cardTimeLogRepository.find({
        order: ['date DESC'],
        limit: 10,
        where: {userId: currentUser.id},
        include: [
          {
            relation: 'card',
            scope: {
              include: ['requirement', 'project'],
            },
          },
          {
            relation: 'user',
          },
        ],
      }))
    }

    return Promise.all(activities.map(a => {
      a.userName = `${a.user.firstName} ${a.user.lastName}`
      a.date = moment(a.date).format('L')
      a.time = `${a.hours}h${a.minutes}m`
      return a
    }))
  }
}
