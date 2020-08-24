import AppError from '../../../shared/errors/AppError'
import FakeUserRepository from '../../users/repositories/fakes/FakeUsersRepository'
import ListProvidersService from './ListProvidersService'

let fakeUserRepository: FakeUserRepository
let listProviders: ListProvidersService

describe('FindAllProviders', () => {
  beforeEach(()=> {
    fakeUserRepository = new FakeUserRepository()
    listProviders = new ListProvidersService(fakeUserRepository)
  })

  it('Should be able to list all providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'jon_doe@email.com',
      password: '123456'
    })

    const user2 = await fakeUserRepository.create({
      name: 'John Tre',
      email: 'jon_tre@email.com',
      password: '123456'
    })

    const userLogged = await fakeUserRepository.create({
      name: 'John Qua',
      email: 'jon_qua@email.com',
      password: '123456'
    })

    const providers = await listProviders.execute({
      user_id: userLogged.id,
    })

     expect(providers).toEqual([
       user1,
       user2
     ])
    })

  // it('Should not be able to show a no-existing user profile', async () => {
  //    expect(
  //      showProfile.execute({
  //       user_id: 'non-existing-user_id'
  //   })
  //    ).rejects.toBeInstanceOf(AppError)
  // })
})
