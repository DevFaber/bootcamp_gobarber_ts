import AppError from '../../../shared/errors/AppError'
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUsersTokenRepository from '../repositories/fakes/FakeUsersTokenRepository'
import FakeMailProvider from '../../../shared/container/providers/MailProvider/fakes/FakeMailProvider'
import SendForgotPasswordEmailService from './SendForgotPasswodEmailService'

let fakeUserRepository: FakeUserRepository
let fakeMailProvider: FakeMailProvider
let fakeUserTokenRepository: FakeUsersTokenRepository
let sendForgotMail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
  beforeEach(()=> {
      fakeUserRepository = new FakeUserRepository()
      fakeMailProvider = new FakeMailProvider()
      fakeUserTokenRepository = new FakeUsersTokenRepository()
      sendForgotMail = new SendForgotPasswordEmailService(
          fakeUserRepository,
          fakeMailProvider,
          fakeUserTokenRepository
      )
  })

  it('Should to send a email to recover a password', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    await fakeUserRepository.create({
      name: 'Victor Sales',
      email: 'victor.sales@email.com',
      password: '123456'
    })

    await sendForgotMail.execute({
      email: 'victor.sales@email.com',
    })
    expect(sendMail).toHaveBeenCalled()
  })

  it('Should not be able to recover a non-existing user password', async () => {
    await expect(sendForgotMail.execute({
      email: 'victor.sales@email.com',
    })).rejects.toBeInstanceOf(AppError)
  })

  it('Should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate')

    const user = await fakeUserRepository.create({
      name: 'Victor Sales',
      email: 'victor.sales@email.com',
      password: '123456'

    })

    await sendForgotMail.execute({
      email: 'victor.sales@email.com',
    })
    expect(generateToken).toHaveBeenCalledWith(user.id)
  })
})
