import { getRepository } from 'typeorm'
import { sign } from 'jsonwebtoken'
import { compare } from 'bcrypt'

import AppError from '../errors/AppError'
import authConfig from '../config/authConfig'
import User from '../models/User'

interface Request {
  email: string
  password: string
}

interface Response {
  user: User
  token: string
}

class CreateLoginService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User)

    const user = await userRepository.findOne({
      where: { email },
    })

    if (!user) {
      throw new AppError('Dados incorretos!', 401)
    }

    const passwordVerify = await compare(password, user.password)

    if (!passwordVerify) {
      throw new AppError('Dados incorretos!', 401)
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    })

    return { user, token }
  }
}

export default CreateLoginService
