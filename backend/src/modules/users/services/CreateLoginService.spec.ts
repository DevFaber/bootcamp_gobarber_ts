import AppError from '../../../shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import CreateLoginService from './CreateLoginService'
import CreateUserService from './CreateUserService'

let fakeUserRepository: FakeUserRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService
let createLogin: CreateLoginService


describe('CreateLogin', () => {
beforeEach(()=> {
  fakeUserRepository = new FakeUserRepository()
  fakeHashProvider = new FakeHashProvider()
  createUser = new CreateUserService(fakeUserRepository, fakeHashProvider)
  createLogin = new CreateLoginService(fakeUserRepository, fakeHashProvider)
})

  it('Should be able to authenticate a user', async () => {
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
    expect(createLogin.execute({
      email: 'miller@teste.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to authenticate with wrong password', async () => {
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
