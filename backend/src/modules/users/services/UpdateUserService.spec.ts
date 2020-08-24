import AppError from '../../../shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import UpdateProfileService from './UpdateUserService'

let fakeUserRepository: FakeUserRepository
let fakeHashProvider: FakeHashProvider
let updateProfileService: UpdateProfileService

describe('UpdateProfile', () => {
  beforeEach(()=> {
    fakeUserRepository = new FakeUserRepository()
    fakeHashProvider = new FakeHashProvider()
    updateProfileService = new UpdateProfileService(fakeUserRepository, fakeHashProvider)
  })

  it('Should be able to update a user', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'jon@email.com',
      password: '123456'
    })

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Eod',
      email: 'john_cascade@email.com'
    })

     expect(updatedUser.name).toBe('John Eod')
     expect(updatedUser.email).toBe('john_cascade@email.com')
    })

    it('Should not be able to set a already existent user email ', async () => {
     await fakeUserRepository.create({
        name: 'John Doe',
        email: 'jon@email.com',
        password: '123456'
      })
    const user =  await fakeUserRepository.create({
        name: 'Teste',
        email: 'jon@email.com',
        password: '123456'
      })

    expect(
        updateProfileService.execute({
          user_id: user.id,
          name: 'John Doe',
          email: 'jon@email.com'
      })).rejects.toBeInstanceOf(AppError)
   })

    it('Should be able to update a user password ', async () => {
     const user = await fakeUserRepository.create({
        name: 'John Doe',
        email: 'jon@email.com',
        password: '123456'
      })

    const updatedUser =  await updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'jon@email.com',
        old_password: '123456',
        password: '123123'
      })

      expect(updatedUser.password).toBe('123123')
   })

    it('Should not be able to update a user password without old password ', async () => {
     const user = await fakeUserRepository.create({
        name: 'John Doe',
        email: 'jon@email.com',
        password: '123456'
      })

     await expect(
        updateProfileService.execute({
          user_id: user.id,
          name: 'John Doe',
          email: 'jon@email.com',
          password: '123123'
      })).rejects.toBeInstanceOf(AppError)
   })

    it('Should not be able to update a user password without correct old password ', async () => {
     const user = await fakeUserRepository.create({
        name: 'John Doe',
        email: 'jon@email.com',
        password: '123456'
      })

     await expect(
        updateProfileService.execute({
          user_id: user.id,
          name: 'John Doe',
          email: 'jon@email.com',
          old_password: 'wrong-password-test',
          password: '123123'
      })).rejects.toBeInstanceOf(AppError)
   })
})
