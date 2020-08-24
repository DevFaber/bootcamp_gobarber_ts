import AppError from '../../../shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import ShowProfileService from './ShowProfileService'

let fakeUserRepository: FakeUserRepository
let showProfile: ShowProfileService

describe('ShowProfileService', () => {
  beforeEach(()=> {
    fakeUserRepository = new FakeUserRepository()
    showProfile = new ShowProfileService(fakeUserRepository)
  })

  it('Should be able to show the user profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'jon@email.com',
      password: '123456'
    })

    const profile = await showProfile.execute({
      user_id: user.id,
    })

     expect(profile.name).toBe('John Doe')
     expect(profile.email).toBe('jon@email.com')
    })
  it('Should not be able to show a no-existing user profile', async () => {
     expect(
       showProfile.execute({
        user_id: 'non-existing-user_id'
    })
     ).rejects.toBeInstanceOf(AppError)
  })
})
