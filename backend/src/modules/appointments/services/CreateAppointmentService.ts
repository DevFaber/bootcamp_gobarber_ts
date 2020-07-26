import { startOfHour } from 'date-fns'
import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import Appointment from '../infra/typeorm/entities/Appointment'
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository'

/**
 * No Service ficará as funções responsáveis pelos métodos do repositório *
 * Este serviço precisa resolver os seguintes problemas:
 * ###-1 Recebimento e retorno dos dados do método. ===> MODEL
 * ###-2 Tratativa de erros e exceções.             ===> ERRORS
 * ###-3 Comunicação e acesso ao repositório        ===> REPOSITORY
 */

interface IRequest {
  provider_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository
  ) {

  }


  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date)

    const hasAlreadyAppointment = await this.appointmentsRepository.findByDate(
      appointmentDate,
      )

    if (hasAlreadyAppointment) {
      throw new AppError('Horário já preenchido!')
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date,
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
