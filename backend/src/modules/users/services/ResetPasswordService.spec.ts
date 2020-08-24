import AppError from '../../../shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUsersTokenRepository from '../repositories/fakes/FakeUsersTokenRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import ResetPasswordService from './ResetPasswordService'

let fakeUserRepository: FakeUserRepository
let fakeHashProvider: FakeHashProvider
let fakeUserTokenRepository: FakeUsersTokenRepository
let resetPassword: ResetPasswordService

describe('ResetPasswordService', () => {
  beforeEach(()=> {
      fakeUserRepository = new FakeUserRepository()
      fakeUserTokenRepository = new FakeUsersTokenRepository()
      fakeHashProvider = new FakeHashProvider()

      resetPassword = new ResetPasswordService(
          fakeUserRepository,
          fakeUserTokenRepository,
          fakeHashProvider
      )
  })

  it('Should be able to reset a password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Victor Sales',
      email: 'victor.sales@email.com',
      password: '123456',
    })

    const { token } = await fakeUserTokenRepository.generate(user.id)

    const generatedHash = jest.spyOn(fakeHashProvider, 'generateHash')

    await resetPassword.execute({
      password: '123123',
      token
    })

    const newUser = await fakeUserRepository.findById(user.id)

    expect(generatedHash).toHaveBeenCalledWith('123123')
    expect(newUser?.password).toBe('123123')
  })

  it('Should not be able to reset a password with a non existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non existing',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to reset a password with a non existing user', async () => {
    const { token } = await fakeUserTokenRepository.generate('non existing user')

    await expect(
      resetPassword.execute({
        token,
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to reset a password after two hours from request', async () => {
    const user = await fakeUserRepository.create({
      name: 'Victor Sales',
      email: 'victor.sales@email.com',
      password: '123456'
    })

    const { token } = await fakeUserTokenRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()

      return customDate.setHours(customDate.getHours() + 3)
    })

    await expect(
      resetPassword.execute({
        token,
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

})
