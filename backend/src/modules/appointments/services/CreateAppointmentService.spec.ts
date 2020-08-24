import AppError from '../../../shared/errors/AppError'
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository'
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import CreateAppointmentService from './CreateAppointmentService'

let fakeNotificationsRepository: FakeNotificationsRepository
let fakeAppointmentRepository: FakeAppointmentRepository
let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository()
    fakeNotificationsRepository = new FakeNotificationsRepository()
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository, fakeNotificationsRepository)

  })
  it('Should be able to create a new appointment', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: '1002',
      user_id: '1001',
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('1002')
  })

  it('Should not be able to create two appointments at same date', async () => {
    const appointmentDate = new Date(2020, 7, 25, 9)

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '1002',
      user_id: '1001',

    })

   await expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: '1002',
      user_id: '1001',

    })).rejects.toBeInstanceOf(AppError)

})
  it('Should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 10, 12).getTime()
    })

    expect(
      createAppointment.execute({
        date: new Date(2020, 8, 10, 11),
        user_id: '123123',
        provider_id: '123123'
      })
    )
  })

  it('Should not be able to create an appointment with user_id as a provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 16, 12).getTime()
    })

    await expect(createAppointment.execute({
      date: new Date(2020, 7, 16, 13),
      provider_id: '1001',
      user_id: '1001',

    })).rejects.toBeInstanceOf(AppError)

  })

  it('Should not be able to create an appointment before 8:00 and after 17:00', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 16, 12).getTime()
    })

    await expect(createAppointment.execute({
      date: new Date(2020, 7, 16, 19),
      provider_id: '1002',
      user_id: '1001',

    })).rejects.toBeInstanceOf(AppError)

    await expect(createAppointment.execute({
      date: new Date(2020, 7, 16, 7),
      provider_id: '1002',
      user_id: '1001',

    })).rejects.toBeInstanceOf(AppError)

  })
})
