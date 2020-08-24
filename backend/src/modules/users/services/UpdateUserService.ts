import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import User from '../infra/typeorm/entities/User'

interface IRequest {
  user_id: string
  name: string
  email: string
  old_password?: string
  password?: string
}

@injectable()
class UpdateUserProfile {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}



  public async execute({ user_id, name, email, password, old_password }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if(!user) {
      throw new AppError('Usuário não encontrado')
    }

    const emailValidUser = await this.usersRepository.findByEmail(email)

    if(emailValidUser && emailValidUser.id !== user_id) {
      throw new AppError('Email pertence a outro usuário')
    }

    user.name = name
    user.email = email

    if (password && !old_password) {
      throw new AppError('A senha antiga deve ser informada')
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      )

      if(!checkOldPassword) {
        throw new AppError('A senha antiga não confere!')
      }
    }

    if (password) {
      user.password = await this.hashProvider.generateHash(password)
    }
        return this.usersRepository.save(user)
   }
}

export default UpdateUserProfile
