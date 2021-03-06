import { inject, injectable } from 'tsyringe'

import Appointment from '../infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '../../appointments/repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string,
  month: number,
  year: number,
  day: number,
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, day, month, year }: IRequest): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findAllInDay({
      provider_id,
      day,
      month,
      year,
    })

    return appointments

    }
  }

export default ListProviderAppointmentsService
