import { isEqual } from 'date-fns'
import AppError from '../../../shared/errors/AppError'
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'

describe('CreateAppointment', () => {
  it('Should be able to create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository()
    const createAppointment = new CreateAppointmentService(fakeAppointmentRepository)

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '1001',
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('1001')
  })

  it('Should not be able to create two appointments at same date', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository()
    const createAppointment = new CreateAppointmentService(fakeAppointmentRepository)

    const appointmentDate = new Date(2020, 6, 25, 20)

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '1001',
    })

    expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: '1001',
    })).rejects.toBeInstanceOf(AppError)

})

})
