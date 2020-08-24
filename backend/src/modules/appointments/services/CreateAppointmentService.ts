import { startOfHour, isBefore, getHours, format } from 'date-fns'
import { injectable, inject } from 'tsyringe'


import AppError from '@shared/errors/AppError'

import Appointment from '../infra/typeorm/entities/Appointment'
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository'

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'

interface IRequest {
  provider_id: string
  user_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({ provider_id, user_id, date }: IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date)


    if(isBefore(appointmentDate, Date.now())) {
      throw new AppError('Impossible to create an appointment at past date!')
    }

    if (user_id === provider_id) {
      throw new AppError('You can not create an appointment with yourself!')
    }

    if ( getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can not create an appointment before 8am or after 5pm!')
    }

    const hasAlreadyAppointment = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
      )

    if (hasAlreadyAppointment) {
      throw new AppError('Horário já preenchido!')
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date,
    })

    const dateFormatted = format(appointmentDate, "dd/MM/yyy 'às' HH:mm 'hs")

    

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`
    })

    return appointment
  }
}

export default CreateAppointmentService

//################################## NOTAS ####################################################

//          ### APLICANDO O DEPENDECY INVERSION ###
// Ao inves de instanciar uma nova classe do repositório dentro do service
// receberemos a instancia dessa classe como um parâmetro de dentro do repositório
// através do constructor:ou seja, receberemos essa instancia como uma variável
//  1 - Criar uma variável privada dentro da classe com o nome da instancia
//  2 - Recebe um parametro no constructor com nome e tipo da instancia importada
//  3 - No corpo do constructor associar a variável privada com a instancia recebida por parâmetro
//      dentro do constructor

// Para funcionar, dentro da rota da entidade será necessário
//  1 - Chamar o service como uma instancia da classe e enviar a variável que contém o
//      repositório como parametro. O método deverá estar contido em um bloco de try-Catch
//      para que as mensagens de erro possam ser capturadas dentro do arquivo de rotas

//#############################################################################################
