import AppError from '../../../shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import CreateUserService from './CreateUserService'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

let fakeUserRepository: FakeUserRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService


describe('CreateUser', () => {
  beforeEach(()=> {
   fakeUserRepository = new FakeUserRepository()
   fakeHashProvider = new FakeHashProvider()
   createUser = new CreateUserService(fakeUserRepository, fakeHashProvider)

  })
  it('Should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'jon@email.com',
      password: '123456'
    })

    expect(user).toHaveProperty('id')
  })

  it('Should not be able to create a user with existent email', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'jon@email.com',
      password: '123456'
    })

    expect(createUser.execute({
      name: 'John Doe',
      email: 'jon@email.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError)
  })

})
