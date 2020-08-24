import AppError from '../../../shared/errors/AppError'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import ListProviderAppointmentsService from './ListProviderAppointmentsService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderAppointments: ListProviderAppointmentsService

describe('ListProviderAppointments', () => {
  beforeEach(()=> {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProviderAppointments = new ListProviderAppointmentsService(fakeAppointmentsRepository)

  })

  it('Should be able to list provider appointments', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'userId',
      date: new Date(2020, 7, 20, 8 , 0, 0),
    })
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'userId',
      date: new Date(2020, 7, 20, 10 , 0, 0),

    })
    const appointment3 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'userId',
      date: new Date(2020, 7, 20, 14 , 0, 0),
    })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   user_id: 'userId',
    //   date: new Date(2020, 4, 20, 11 , 0, 0),
    // })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   user_id: 'userId',
    //   date: new Date(2020, 4, 20, 12 , 0, 0),
    // })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   user_id: 'userId',
    //   date: new Date(2020, 4, 20, 13 , 0, 0),
    // })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   user_id: 'userId',
    //   date: new Date(2020, 4, 20, 14 , 0, 0),
    // })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   user_id: 'userId',
    //   date: new Date(2020, 4, 20, 15 , 0, 0),
    // })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   user_id: 'userId',
    //   date: new Date(2020, 4, 20, 16 , 0, 0),
    // })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   user_id: 'userId',
    //   date: new Date(2020, 4, 20, 17 , 0, 0),
    // })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   user_id: 'userId',
    //   date: new Date(2020, 4, 21, 8 , 0, 0),
    // })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   user_id: 'userId',
    //   date: new Date(2020, 5, 21, 8 , 0, 0),
    // })

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      year: 2020,
      month: 8,
      day: 20
    })

    expect(appointments).toEqual([
      appointment1,
      appointment2,
      appointment3
    ])
  })
})
