import AppError from '../../../shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import CreateLoginService from './CreateLoginService'
import CreateUserService from './CreateUserService'

describe('CreateLogin', () => {
  it('Should be able to authenticate a user', async () => {
    const fakeUserRepository = new FakeUserRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createLogin = new CreateLoginService(fakeUserRepository, fakeHashProvider)
    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider)

    const user = await createUser.execute({
      name: 'Miller Scot',
      email: 'miller@teste.com',
      password: '123456'
    })

    const response = await createLogin.execute({
      email: 'miller@teste.com',
      password: '123456'
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })

  it('Should be not able to authenticate a non existing user', async () => {
    const fakeUserRepository = new FakeUserRepository()
    const fakeHashProvider = new FakeHashProvider()
    const createLogin = new CreateLoginService(fakeUserRepository, fakeHashProvider)

    expect(createLogin.execute({
      email: 'miller@teste.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to authenticate with wrong password', async () => {
    const fakeUserRepository = new FakeUserRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createLogin = new CreateLoginService(fakeUserRepository, fakeHashProvider)
    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider)

    await createUser.execute({
      name: 'Miller Scot',
      email: 'miller@teste.com',
      password: '123456'
    })

    expect(
      createLogin.execute({
      email: 'miller@teste.com',
      password: 'wrong-key',
    }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
