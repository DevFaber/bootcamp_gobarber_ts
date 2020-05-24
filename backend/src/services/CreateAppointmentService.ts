import { startOfHour } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import AppError from '../errors/AppError'

import Appointment from '../models/Appointment'
import AppointmentsRepository from '../reppos/AppointmentsRepository'

/**
 * No Service ficará as funções responsáveis pelos métodos do repositório *
 * Este serviço precisa resolver os seguintes problemas:
 * ###-1 Recebimento e retorno dos dados do método. ===> MODEL
 * ###-2 Tratativa de erros e exceções.             ===> ERRORS
 * ###-3 Comunicação e acesso ao repositório        ===> REPOSITORY
 */

interface Request {
  provider_id: string
  date: Date
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)

    // const appointmentDate = startOfHour(date)

    const hasAlreadyAppointment = await appointmentsRepository.findOne(date)

    if (hasAlreadyAppointment) {
      throw new AppError('Horário já preenchido!')
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date,
    })

    await appointmentsRepository.save(appointment)

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
