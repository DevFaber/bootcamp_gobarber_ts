import AppError from '../../../shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import CreateUserService from './CreateUserService'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

describe('CreateUser', () => {
  it('Should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUserRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider)

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'jon@email.com',
      password: '123456'
    })

    expect(user).toHaveProperty('id')
  })

  it('Should not be able to create a user with existent email', async () => {
    const fakeUserRepository = new FakeUserRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider)

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
