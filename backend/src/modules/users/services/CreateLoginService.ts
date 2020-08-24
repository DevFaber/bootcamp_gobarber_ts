import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import authConfig from '@config/authConfig'

import User from '@modules/users/infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'


interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: User
  token: string
}
@injectable()
class CreateLoginService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {

    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Usuário não encontrado!', 401)
    }

    console.log(email)
    const passwordVerify = await this.hashProvider.compareHash(password, user.password)

    if (!passwordVerify) {
      throw new AppError('Senha não confere!', 401)
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    })

    return { user, token }
  }
}

export default CreateLoginService
