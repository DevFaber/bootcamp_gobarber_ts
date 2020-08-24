import AppError from '../../../shared/errors/AppError'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderDayAvailability: ListProviderDayAvailabilityService

describe('ListProviderDayAvailability', () => {
  beforeEach(()=> {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProviderDayAvailability = new ListProviderDayAvailabilityService(fakeAppointmentsRepository)

  })

  it('Should be able to list days provider availability inside a month', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 4, 20, 8 , 0, 0),
    })
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 4, 20, 9 , 0, 0),
    })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   date: new Date(2020, 4, 20, 10 , 0, 0),
    // })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   date: new Date(2020, 4, 20, 11 , 0, 0),
    // })
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 4, 20, 12 , 0, 0),
    })
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 4, 20, 13 , 0, 0),
    })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   date: new Date(2020, 4, 20, 14 , 0, 0),
    // })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   date: new Date(2020, 4, 20, 15 , 0, 0),
    // })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   date: new Date(2020, 4, 20, 16 , 0, 0),
    // })
    // await fakeAppointmentsRepository.create({
    //   provider_id: 'user',
    //   date: new Date(2020, 4, 20, 17 , 0, 0),
    // })
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 4, 21, 8 , 0, 0),
    })
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 5, 21, 8 , 0, 0),
    })

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 13).getTime()
    })

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
      day: 20,
    })

    expect(availability).toEqual(expect.arrayContaining([
      { hour: 9, available: false },
      { hour: 12, available: false },
      { hour: 13, available: false },
      { hour: 14, available: true },
      { hour: 15, available: true },
      { hour: 16, available: true },
      { hour: 17, available: true },

    ]))
  })
})
