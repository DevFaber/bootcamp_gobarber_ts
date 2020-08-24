import { getRepository, Repository, Raw } from 'typeorm'

import IAppointmentsRepository from '../../../repositories/IAppointmentsRepository'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import ICreateAppointmentDTO from '../../../dtos/ICreateAppointmentDTO'
import IFindAllInMonthDTO from '../../../dtos/IFindAllInMonthDTO'
import IFindAllInDayDTO from '../../../dtos/IFindAllInDayDTO'

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>

  constructor() {
    this.ormRepository = getRepository(Appointment)
  }

  public async findAllInDay({ provider_id, day, month, year }: IFindAllInDayDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0')
    const parsedMonth = String(month).padStart(2, '0')

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        )
      },
      relations: [ 'user' ]
    })

    return appointments
  }

  public async findAllInMonth({ provider_id, month, year }: IFindAllInMonthDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0')

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        )
      }
    })

    return appointments
  }

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    })

    return findAppointment
  }

  public async create({ provider_id, user_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, user_id, date})

    await this.ormRepository.save(appointment)

    return appointment
  }
}

export default AppointmentsRepository
