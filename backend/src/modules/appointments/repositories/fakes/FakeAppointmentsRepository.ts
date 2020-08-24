
import { uuid } from 'uuidv4'
import { isEqual, getMonth, getYear, getDate } from 'date-fns'
import IAppointmentsRepository from '../IAppointmentsRepository'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import ICreateAppointmentDTO from '../../../appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthDTO from '../../../appointments/dtos/IFindAllInMonthDTO'
import IFindAllInDayDTO from '../../../appointments/dtos/IFindAllInDayDTO'

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = []


  public async findAllInDay({ provider_id, day, month, year }: IFindAllInDayDTO): Promise<Appointment[]> {
    const appointment = this.appointments.filter(appointment => {

        return (
          appointment.provider_id === provider_id &&
          getDate(appointment.date) === day &&
          getMonth(appointment.date) + 1 === month &&
          getYear(appointment.date) === year
        )
     })
    return appointment
  }

  public async findAllInMonth({ provider_id, month, year }: IFindAllInMonthDTO): Promise<Appointment[]> {
    const appointment = this.appointments.filter(appointment => {

        return (
          appointment.provider_id === provider_id &&
          getMonth(appointment.date) + 1 === month &&
          getYear(appointment.date) === year
        )
     })
    return appointment
  }

  public async findByDate(date: Date, provider_id: string ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment => isEqual(
      appointment.date,date) &&
      appointment.provider_id === provider_id
    )

    return findAppointment
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment()

    Object.assign(appointment, { id: uuid(), date, provider_id, user_id })

    this.appointments.push(appointment)

    return appointment
}
}

export default AppointmentsRepository
