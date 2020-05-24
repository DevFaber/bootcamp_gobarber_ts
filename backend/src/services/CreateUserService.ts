import { getRepository } from 'typeorm'
import { hash } from 'bcrypt'

import AppError from '../errors/AppError'
import User from '../models/User'

interface Request {
  name: string
  email: string
  password: string
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User)

    const checkUserExists = await userRepository.findOne({
      where: {
        email,
      },
    })

    if (checkUserExists) {
      throw new AppError('Usuário já cadastrado!')
    }

    const hashedPassword = await hash(password, 8)

    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    await userRepository.save(newUser)

    return newUser
  }
}

export default CreateUserService
